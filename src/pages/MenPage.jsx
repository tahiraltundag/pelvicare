import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { maleModes } from '../data/product';
import { useCms } from '../hooks/useCms';

const DEFAULT_PROFILES = [
  { icon: '🔷', title: 'Erektil Disfonksiyon', modes: 'E-03', desc: 'İskiokavernozus güçlendirme ve intrakavernal basınç artışı.' },
  { icon: '⏱', title: 'Erken Boşalma', modes: 'E-04', desc: 'Nöromodülasyon ile IELT uzatma ve ejakülasyon eşik yükseltme.' },
  { icon: '💧', title: 'İdrar Kaçırma', modes: 'E-01', desc: 'Prostatektomi sonrası sfinkter güçlendirme ve erken iyileşme.' },
  { icon: '🛡', title: 'Prostatik Ağrı', modes: 'E-06', desc: 'Kombine protokol ile ağrı inhibisyonu ve miyofasyal gevşeme.' },
];

export default function MenPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('men_hero_title', 'Erkek Pelvik Sağlığı');
  const heroSubtitle = get('men_hero_subtitle', '7 bilimsel protokol. Erektil disfonksiyondan prostatik ağrıya, erken boşalmadan idrar kaçırmaya kapsamlı erkek pelvik rehabilitasyonu.');
  const targetProfiles = getJson('men_profiles', DEFAULT_PROFILES);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">💪</div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-blue-200 leading-relaxed mb-6">
            {heroSubtitle}
          </p>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-5 py-2">
            <span className="text-teal-300 text-sm font-medium">Evde gizlilikle uygulanabilir · Erkek anatomisine özel tasarım</span>
          </div>
        </div>
      </section>

      {/* Target Profiles */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetProfiles.map((p) => (
              <div key={p.title} className="text-center p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                <div className="text-xs font-mono text-teal-600 mb-2">{p.modes}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Male Modes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>7 Erkek Tedavi Protokolü</h2>
            <p className="text-gray-500">Her hastalık için bilimsel parametreler ve klinik kanıt altyapısı</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {maleModes.map((mode) => (
              <div key={mode.code} className="rounded-2xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{mode.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{mode.code}</span>
                      <h3 className="font-bold text-gray-900">{mode.name}</h3>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{mode.desc}</div>
                    <div className="space-y-1.5">
                      <div className="flex gap-2 text-xs">
                        <span className="font-medium text-gray-600 w-20 flex-shrink-0">Frekans:</span>
                        <span className="text-gray-700">{mode.freq}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="font-medium text-gray-600 w-20 flex-shrink-0">Sonuç:</span>
                        <span className="text-teal-700 font-medium">{mode.result}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="font-medium text-gray-600 w-20 flex-shrink-0">Kaynak:</span>
                        <span className="text-gray-400 italic">{mode.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted: ED */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-sm font-bold text-teal-600 mb-2">E-03 · Öne Çıkan Protokol</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>Erektil Disfonksiyon</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                İskiokavernozus ve periüretral kas gruplarını doğrudan hedefleyen EMS protokolü. Kavernöz sinir yenilenmesini destekler. RCT verisiyle intrakavernal basınçta anlamlı artış.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  '50 Hz periüretral + 80 Hz iskiokavernozus',
                  'İntrakavernal basınç anlamlı artış',
                  'Kavernöz sinir yenilenmesi desteği',
                  'Capogrosso et al. 2018 RCT onaylı',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 italic">Yale Medicine Üroloji — Doktor onaylı protokol</div>
            </div>
            <div className="rounded-2xl bg-white border border-teal-200 p-6">
              <div className="space-y-4">
                {[
                  { label: 'Periüretral Kas', freq: '50 Hz', color: 'bg-teal-50 text-teal-700' },
                  { label: 'İskiokavernozus', freq: '80 Hz', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Nöromodülasyon', freq: '20 Hz', color: 'bg-purple-50 text-purple-700' },
                ].map((item) => (
                  <div key={item.label} className={`flex justify-between items-center p-4 rounded-xl ${item.color}`}>
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-bold">{item.freq}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <div className="text-xs text-gray-500 mb-1">Klinik Sonuç</div>
                <div className="text-lg font-bold text-gray-900">Anlamlı Basınç Artışı</div>
                <div className="text-xs text-gray-400">Capogrosso P. et al. 2018 RCT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prostatectomy */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 lg:p-10" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="text-sm font-bold text-teal-400 mb-2">E-01 · Prostatektomi Sonrası</div>
                <h2 className="text-3xl font-bold mb-4">İdrar Kaçırmaya Hızlı Çözüm</h2>
                <p className="text-blue-200 mb-6 leading-relaxed">
                  Prostat ameliyatı sonrası gelişen idrar kaçırma için sfinkter güçlendirme protokolü. Evde gizlilikle, hızlı iyileşme.
                </p>
                <div className="space-y-3">
                  {[
                    'Ameliyat sonrası erken başlanabilir (hekim onayıyla)',
                    'Sfinkter güçlendirme + ereksiyon rehabilitasyonu',
                    'Üroloji klinikleri onaylı protokol',
                    'Takip uygulaması ile düzenli raporlama',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-blue-200">
                      <CheckCircle size={16} className="text-teal-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'E-01', label: 'İdrar Kaçırma', color: 'bg-teal-600' },
                  { value: 'E-03', label: 'Erektil Disf.', color: 'bg-blue-600' },
                  { value: '%95', label: 'İyileşme', color: 'bg-purple-600' },
                  { value: '12 Hafta', label: 'Protokol', color: 'bg-teal-700' },
                ].map((item) => (
                  <div key={item.label} className={`${item.color} rounded-2xl p-4 text-center text-white`}>
                    <div className="text-2xl font-bold mb-1">{item.value}</div>
                    <div className="text-xs text-white/80">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>Erkek Pelvik Sağlığında Yeni Dönem</h2>
          <p className="text-gray-500 mb-8">Gizlilikle, evinizde, klinik kanıtlı protokollerle.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/urun/pelvicair"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              Ürünü İncele <ArrowRight size={16} />
            </Link>
            <Link
              to="/klinik-kanit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold rounded-xl border-2 hover:bg-gray-100 transition-all"
              style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}
            >
              Klinik Kanıtlar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
