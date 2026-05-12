import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../../api/client';

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

export default function ClinicianBulkOrder() {
  const [form, setForm] = useState({ name: '', email: '', institution: '', phone: '', quantity: 1, message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/clinician/bulk-order', form);
      if (!res.success) throw new Error(res.error);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Başvurunuz Alındı</h2>
          <p className="text-gray-500 text-sm">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
          <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', institution: '', phone: '', quantity: 1, message: '' }); }}
            className="mt-6 px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
            style={{ backgroundColor: '#0d9488' }}>
            Yeni Başvuru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Toplu Sipariş Başvurusu</h1>
        <p className="text-gray-500 mt-1">Klinik ve hastaneler için özel fiyatlandırma ve toplu alım programı</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Soyad *</label>
                  <input className={inp} value={form.name} onChange={set('name')} required placeholder="Dr. Adı Soyadı" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">E-posta *</label>
                  <input type="email" className={inp} value={form.email} onChange={set('email')} required placeholder="doktor@klinik.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Kurum / Klinik *</label>
                  <input className={inp} value={form.institution} onChange={set('institution')} required placeholder="Klinik adı" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon</label>
                  <input type="tel" className={inp} value={form.phone} onChange={set('phone')} placeholder="0532 000 00 00" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Talep Edilen Adet</label>
                  <input type="number" className={inp} value={form.quantity} onChange={set('quantity')} min="1" max="9999" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mesaj / Özel İstek</label>
                  <textarea className={inp} rows={4} value={form.message} onChange={set('message')} placeholder="Özel koşullar, teslim tarihi, ödeme şekli..." />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition"
                style={{ backgroundColor: '#0d9488' }}>
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Başvuruyu Gönder'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Özel Fiyatlandırma', desc: '5+ adet alımda %15, 20+ adet alımda %25 indirim.' },
            { title: 'Öncelikli Destek', desc: 'Klinisyen hattımızdan 7/24 teknik ve klinik destek.' },
            { title: 'Eğitim Paketi', desc: 'Ücretsiz kurulum eğitimi ve klinik protokol rehberi.' },
            { title: 'Taksit İmkânı', desc: '12 aya kadar taksit seçenekleri.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="font-semibold text-gray-900 mb-1" style={{ color: '#0d9488' }}>{title}</div>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
