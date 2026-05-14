import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { femaleModes } from '../data/product';
import { useCms } from '../hooks/useCms';

const DEFAULT_PROFILES = [
  { icon: '🤱', title: 'Yeni Anne', modes: 'K-08 · K-09', desc: 'Doğum sonrası pelvik rehabilitasyon; levator ani hasarı ve pudendal nöropraksi.' },
  { icon: '🌿', title: 'Menopoz Dönemi', modes: 'K-01 · K-10', desc: 'Östrojen düşüşüyle artan inkontinans, pelvik atrofi ve cinsel isteksizlik.' },
  { icon: '🛡', title: 'Vajinismus / Ağrı', modes: 'K-05', desc: 'Kademeli kas spazmı çözme ve desensitizasyon protokolü.' },
  { icon: '✨', title: 'Orgazm Güçlüğü', modes: 'K-06 · K-07', desc: 'Pelvik kapasite artışı ve sensitizasyon restorasyonu.' },
];

export default function WomenPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('women_hero_title', 'Kadın Pelvik Sağlığı');
  const heroSubtitle = get('women_hero_subtitle', '10 bilimsel protokol. İdrar kaçırmadan vajinismusa, dismenorenin anından menopoza kapsamlı kadın pelvik rehabilitasyonu.');
  const targetProfiles = getJson('women_profiles', DEFAULT_PROFILES);
  const cmsFemModes = getJson('female_modes', femaleModes);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 60%, #0d9488 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">🌸</div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-blue-200 leading-relaxed mb-6">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['10 Protokol', 'Non-invazif', 'Evde Kullanım', 'Klinik Kanıtlı'].map((tag) => (
              <span key={tag} className="bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium">
                {tag}
              </span>
            ))}
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

      {/* All Female Modes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>10 Kadın Tedavi Protokolü</h2>
            <p className="text-gray-500">Her hastalık için bilimsel parametreler ve klinik kanıt altyapısı</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {cmsFemModes.map((mode) => (
              <div key={mode.code} className="rounded-2xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{mode.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{mode.code}</span>
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

      {/* Highlighted: Incontinence */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-sm font-bold text-teal-600 mb-2">K-01 · Öne Çıkan Protokol</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>İdrar Kaçırma (Üriner İnkontinans)</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stres inkontinansı (öksürme, hapşırma, koşma sırasında kaçırma) ve sıkışma inkontinansı için ayrı frekans protokolleri. 6 haftalık RCT verisiyle %95 iyileşme oranı.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  'Stres için 35–50 Hz, sıkışma için 10 Hz',
                  '6 hafta sonra %95 olguda sızıntı azalması',
                  'Pad kullanımında belirgin düşüş',
                  'Yaşam kalitesi anlamlı artış',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 italic">Stania M. et al. 2022 RCT · Cochrane sistematik derleme</div>
            </div>
            <div className="rounded-2xl bg-white border border-teal-200 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-teal-600">%95</div>
                <div className="text-sm text-gray-600 mt-1">İyileşme Oranı</div>
                <div className="text-xs text-gray-400">6 Haftalık RCT Sonucu</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Stres İnkontinans', freq: '35–50 Hz' },
                  { label: 'Sıkışma İnkontinansı', freq: '10 Hz' },
                  { label: 'Kombine', freq: 'Otomatik Protokol' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-teal-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-teal-600">{item.freq}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted: Dysmenorrhea */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-gray-50 border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold" style={{ color: '#1e3a5f' }}>%74</div>
                <div className="text-sm text-gray-600 mt-1">Ağrı Rahatlaması</div>
                <div className="text-xs text-gray-400">20 Dakika İçinde</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Akut Faz', freq: '80–100 Hz' },
                  { label: 'Endorfin Salınımı', freq: '2–4 Hz' },
                  { label: 'Analjezik Azalması', freq: '%93 azalma' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>{item.freq}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-sm font-bold text-teal-600 mb-2">K-04 · Öne Çıkan Protokol</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>Dismenore (Ağrılı Adet)</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                20 RCT içeren Cochrane derlemesi verileri: yüksek frekanslı EMS 20 dakika içinde %74 ağrı rahatlaması sağlar. Analjezik kullanımını %93 azaltır.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  '20 dakika içinde hızlı etki',
                  '%74 ağrı rahatlaması',
                  'Analjezik bağımlılığında %93 azalma',
                  'Cochrane 2024 — 20 RCT meta-analiz',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pelvik Sağlığınızı Geri Kazanın</h2>
          <p className="text-blue-300 mb-8">Klinik kanıtlı protokollerle, evinizin konforunda.</p>
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
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white rounded-xl border border-white/30 hover:bg-white/10 transition-all"
            >
              Klinik Kanıtlar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
