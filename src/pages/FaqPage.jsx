import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqItems } from '../data/product';
import { Link } from 'react-router-dom';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {open ? (
          <ChevronUp size={18} className="text-teal-600 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Sık Sorulan Sorular</h1>
          <p className="text-blue-200 text-lg">PelviCare hakkında merak ettiklerinizin yanıtları</p>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {faqItems.map((cat) => (
              <a
                key={cat.category}
                href={`#${cat.category.replace(' ', '-')}`}
                className="px-4 py-1.5 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                {cat.category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqItems.map((cat) => (
            <div key={cat.category} id={cat.category.replace(' ', '-')} className="mb-10">
              <h2 className="text-xl font-bold mb-5" style={{ color: '#1e3a5f' }}>{cat.category}</h2>
              <div className="space-y-3">
                {cat.questions.map((qa) => (
                  <FaqItem key={qa.q} question={qa.q} answer={qa.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Extra FAQ */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#1e3a5f' }}>Teknik Sorular</h2>
            <div className="space-y-3">
              {[
                { q: 'Uygulama hangi işletim sistemleriyle uyumlu?', a: 'PelviCare uygulaması iOS 14+ ve Android 8.0+ ile tam uyumludur. App Store ve Google Play\'den ücretsiz indirilebilir.' },
                { q: 'Cihazın pil ömrü ne kadar?', a: 'Tam şarjda 5–7 seans (yaklaşık 100–140 dakika) kullanım sağlar. USB-C ile şarj edilir ve 90 dakikada tam şarj olur.' },
                { q: 'Cihazı temizlemek için ne kullanmalıyım?', a: 'Nemli bez ile silin. Sıvı solventler, alkol veya su ile temizlemeyin. Elektrod pad bağlantı noktalarına nem girmesinden kaçının.' },
                { q: 'Bluetooth menzili ne kadar?', a: 'Bluetooth 5.0 ile 10 metreye kadar kararlı bağlantı sağlar. Seans sırasında telefonunuzun yakında olması önerilir.' },
              ].map((qa) => (
                <FaqItem key={qa.q} question={qa.q} answer={qa.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Hâlâ sorunuz var mı?</h3>
          <p className="text-gray-500 mb-6">Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              Bize Ulaşın
            </Link>
            <a
              href="mailto:info@pelvicare.com"
              className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all"
              style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}
            >
              info@pelvicare.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
