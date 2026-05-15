import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../hooks/useCms';

const DEFAULT_DOWNLOADS = [
  { title: 'Doktorunuz İçin Bilgi', desc: 'Hekim ziyaretinizde kullanabileceğiniz ürün tanıtım ve reçete talep formu', format: 'PDF', icon: '📄' },
  { title: 'Ürün Broşürü (TR)', desc: 'Türkçe tam ürün tanıtım broşürü — özellikler, protokoller ve fiyatlar', format: 'PDF', icon: '📋' },
  { title: 'Günlük Seans Takip Formu', desc: 'İlerlemenizi kağıt üzerinde takip etmek için yazdırılabilir form', format: 'PDF', icon: '📊' },
  { title: 'SGK / Özel Sigorta Mektubu', desc: 'Geri ödeme başvurusu için tıbbi gereklilik belgesi taslağı', format: 'PDF', icon: '🏥' },
];

const DEFAULT_ARTICLES = [
  {
    category: 'İdrar Kaçırma & Stres İnkontinans',
    items: [
      { title: 'Stres İnkontinansı Nedir ve Nasıl Tedavi Edilir?', date: 'Ocak 2026', desc: 'Öksürme, hapşırma ve koşma sırasında idrar kaçırmanın nedenleri ve modern tedavi seçenekleri.' },
      { title: 'EMS vs. Kegel: Hangisi Daha Etkili?', date: 'Şubat 2026', desc: 'Elektromusküler stimülasyon ile geleneksel Kegel egzersizinin karşılaştırmalı klinik analizi.' },
      { title: 'Pelvik Taban Neden Zayıflar?', date: 'Mart 2026', desc: 'Doğum, menopoz, obezite ve sedanter yaşam tarzının pelvik taban üzerine etkileri.' },
    ],
  },
  {
    category: 'OAB, Sıkışma & Noktüri',
    items: [
      { title: 'Aşırı Aktif Mesane (OAB) Nedir?', date: 'Ocak 2026', desc: 'Ani sıkışma hissi ve sık idrara çıkma sorununu anlamak ve yönetmek.' },
      { title: 'Noktüri: Gece İdrara Kalkmanın Çözümü', date: 'Şubat 2026', desc: 'Gece idrara kalkmanın altında yatan nedenler ve non-farmakolojik yaklaşımlar.' },
      { title: 'OAB İlaç Tedavisinin Alternatifleri', date: 'Mart 2026', desc: 'Antikolinerjik ilaçların yan etkileri ve elektrostimülasyon ile nöromodülasyon alternatifleri.' },
    ],
  },
  {
    category: 'Diğer Pelvik Taban Bozuklukları',
    items: [
      { title: 'Vajinismus: Tanı, Neden ve Tedavi', date: 'Şubat 2026', desc: "İstem dışı vajinal kas spazmının güncel tedavi protokolleri ve EMS'in rolü." },
      { title: 'Pelvik Organ Sarkması (Prolapsus)', date: 'Ocak 2026', desc: 'Prolapsusun evreleri ve konservatif tedavi seçenekleri.' },
      { title: 'Erkekte Pelvik Taban Sağlığı', date: 'Mart 2026', desc: 'Erkek pelvik taban bozukluklarının göz ardı edilen boyutu ve modern rehabilitasyon.' },
    ],
  },
  {
    category: 'Dismenore & Ağrı',
    items: [
      { title: "Dismenore İçin EMS: 20 Dakikada Ağrı Rahatlaması", date: 'Ocak 2026', desc: "Cochrane 2024 meta-analizi ışığında EMS'in dismenore tedavisindeki etkinliği." },
      { title: 'Kronik Pelvik Ağrı Yönetimi', date: 'Şubat 2026', desc: 'Kronik pelvik ağrının multidisipliner yaklaşımı ve elektrostimülasyonun yeri.' },
    ],
  },
];

export default function ResourcesPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('resources_hero_title', 'Kaynaklar');
  const heroTitleFs = get('resources_hero_title_fs', '');
  const downloads = getJson('resources_downloads', DEFAULT_DOWNLOADS);
  const articles = getJson('resources_articles', DEFAULT_ARTICLES);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={heroTitleFs ? { fontSize: `${heroTitleFs}px` } : {}}>{heroTitle}</h1>
          <p className="text-blue-200 text-lg">İndirilebilir belgeler, makaleler ve pelvik sağlık rehberleri</p>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1e3a5f' }}>İndirilebilir Belgeler</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {downloads.map((d) => (
              <div key={d.title} className="flex items-center gap-4 rounded-2xl p-5 border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer bg-white">
                <div className="text-3xl flex-shrink-0">{d.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm mb-0.5">{d.title}</div>
                  <div className="text-xs text-gray-500">{d.desc}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">{d.format}</span>
                  <Download size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-10" style={{ color: '#1e3a5f' }}>Makaleler & Rehberler</h2>
          <div className="space-y-12">
            {articles.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-200" style={{ color: '#0d9488' }}>
                  {cat.category}
                </h3>
                <div className="grid md:grid-cols-3 gap-5">
                  {cat.items.map((article) => (
                    <div key={article.title} className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer">
                      <div className="text-xs text-gray-400 mb-2">{article.date}</div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{article.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{article.desc}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700">
                        Devamını Oku <ArrowRight size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a5f' }}>Eğitim Videoları</h3>
          <p className="text-gray-500 text-sm mb-4">Nasıl kullanılır, hasta hikayeleri ve klinik açıklamalar.</p>
          <Link
            to="/yorumlar"
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
          >
            Yorumlara Git <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
