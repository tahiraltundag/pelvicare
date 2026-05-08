import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../hooks/useCms';

const DEFAULT_CATEGORIES = [
  { category: 'Cihaz Kullanımı', questions: [
    { q: 'PelviCare nasıl kullanılır?', a: 'Elektrod pedi iç çamaşırınızın üzerine perineal bölgeye yerleştiriyorsunuz. Mobil uygulama üzerinden hastalık modunuzu seçiyorsunuz ve 20 dakikalık seanslara başlıyorsunuz.' },
    { q: 'Seans süresi ne kadar?', a: 'Standart seans süresi 20 dakikadır. Günde 1-2 seans önerilir.' },
    { q: 'Cihaz ağrı verir mi?', a: 'Hayır. PelviCare non-invazif tasarımıyla ağrısız çalışır.' },
    { q: 'Elektrod pad ne kadar dayanır?', a: 'Her elektrod pad 3-5 seans kullanıma uygundur.' },
  ]},
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {open ? <ChevronUp size={18} className="text-teal-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{answer}</div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('faq_hero_title', 'Sık Sorulan Sorular');
  const heroSubtitle = get('faq_hero_subtitle', 'PelviCare hakkında merak ettiklerinizin yanıtları');
  const categories = getJson('faq_categories', DEFAULT_CATEGORIES);

  return (
    <div>
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-blue-200 text-lg">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <a key={cat.category} href={`#${cat.category.replace(/\s/g, '-')}`}
                className="px-4 py-1.5 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-colors">
                {cat.category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <div key={cat.category} id={cat.category.replace(/\s/g, '-')} className="mb-10">
              <h2 className="text-xl font-bold mb-5" style={{ color: '#1e3a5f' }}>{cat.category}</h2>
              <div className="space-y-3">
                {cat.questions.map((qa) => (
                  <FaqItem key={qa.q} question={qa.q} answer={qa.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Hâlâ sorunuz var mı?</h3>
          <p className="text-gray-500 mb-6">Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/iletisim" className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-all" style={{ backgroundColor: '#0d9488' }}>
              Bize Ulaşın
            </Link>
            <a href="mailto:info@pelvicare.com" className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all" style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}>
              info@pelvicare.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
