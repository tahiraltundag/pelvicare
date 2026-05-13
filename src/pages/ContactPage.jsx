import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useCms } from '../hooks/useCms';

const contactInfo = [
  { icon: <Mail size={20} />, title: 'E-posta', detail: 'info@pelvicair.com', sub: 'Genel sorular' },
  { icon: <Mail size={20} />, title: 'Klinisyen Hattı', detail: 'klinisyen@pelvicair.com', sub: 'Profesyonel destek' },
  { icon: <Phone size={20} />, title: 'Telefon', detail: '0850 123 45 67', sub: 'Hafta içi 09–18' },
  { icon: <Clock size={20} />, title: 'Destek Saatleri', detail: 'Pzt–Cum: 09:00–18:00', sub: 'Türkiye saati' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { get } = useCms();
  const contactTitle = get('contact_title', 'İletişim');
  const contactSubtitle = get('contact_subtitle', 'Size nasıl yardımcı olabileceğimizi öğrenmek isteriz.');
  const address = get('footer_address', 'Teknokent Binası, Blok A No:12 Ankara / Türkiye');
  const phone = get('footer_phone', '0850 123 45 67');
  const email = get('footer_email', 'info@pelvicair.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{contactTitle}</h1>
          <p className="text-blue-200 text-lg">{contactSubtitle}</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((c) => (
              <div key={c.title} className="flex items-start gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                  {c.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                  <div className="text-sm text-gray-700 mt-0.5">{c.detail}</div>
                  <div className="text-xs text-gray-400">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Bize Yazın</h2>
              {submitted ? (
                <div className="rounded-2xl p-8 text-center bg-white border border-teal-200">
                  <CheckCircle size={48} className="text-teal-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h3>
                  <p className="text-gray-600 text-sm">En kısa sürede size geri dönüş yapacağız (genellikle 1–2 iş günü).</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="">Konu seçin</option>
                      <option value="urun">Ürün Bilgisi</option>
                      <option value="siparis">Sipariş & Teslimat</option>
                      <option value="teknik">Teknik Destek</option>
                      <option value="klinisyen">Klinisyen İşbirliği</option>
                      <option value="iade">İade & Garanti</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none"
                      placeholder="Sorunuzu veya mesajınızı buraya yazın..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#0d9488' }}
                  >
                    Gönder
                  </button>
                  <p className="text-xs text-gray-400 text-center">Kişisel verileriniz <a href="/gizlilik" className="underline text-teal-600">Gizlilik Politikamız</a> kapsamında işlenir.</p>
                </form>
              )}
            </div>

            {/* Company Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a5f' }}>Şirket Bilgileri</h2>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Adres</div>
                    <div className="text-sm text-gray-600">{address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Telefon</div>
                    <div className="text-sm text-gray-600">{phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">E-posta</div>
                    <div className="text-sm text-gray-600">{email}</div>
                    <div className="text-sm text-gray-600">klinisyen@pelvicair.com</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Hızlı Bağlantılar</h3>
                <div className="space-y-2">
                  {[
                    { label: 'SSS — Sık Sorulan Sorular', path: '/sss' },
                    { label: 'İade Politikası', path: '/iade' },
                    { label: 'Klinisyen Kaynakları', path: '/klinisyenler' },
                    { label: 'Ürün Broşürünü İndir', path: '/kaynaklar' },
                  ].map((link) => (
                    <a key={link.label} href={link.path} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 py-1">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
