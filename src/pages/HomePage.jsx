import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import DeviceModel3D from '../components/DeviceModel3D';
import AnimateInView from '../components/AnimateInView';
import { stats, modalities, clinicalResults, reviews } from '../data/product';
import { useCms } from '../hooks/useCms';

const PRODUCT_IMAGES = [
  '/images/urun-sistem-genel.jpg',
  '/images/cihaz.png',
  '/images/cihaz-2.png',
  '/images/cihaz-3.png',
  '/images/cihaz-4.png',
  '/images/cihaz-5.png',
  '/images/cihaz-6.png',
];

const HERO_DOTS = [
  { top: '12%', left: '4%',  size: 7,  dur: '4.2s', delay: '0s'    },
  { top: '55%', left: '2%',  size: 4,  dur: '5s',   delay: '1.1s'  },
  { top: '80%', left: '9%',  size: 9,  dur: '3.8s', delay: '0.5s'  },
  { top: '25%', right: '6%', size: 5,  dur: '4.6s', delay: '0.8s'  },
  { top: '65%', right: '4%', size: 7,  dur: '5.2s', delay: '1.6s'  },
  { top: '88%', right: '14%',size: 4,  dur: '4s',   delay: '2s'    },
  { top: '8%',  left: '52%', size: 3,  dur: '6s',   delay: '0.3s'  },
  { top: '92%', left: '38%', size: 5,  dur: '4.4s', delay: '1.3s'  },
];

const DEFAULT_TRUST_BADGES = [
  { icon: 'Shield', label: 'CE Belgeli', sub: 'Tıbbi Cihaz' },
  { icon: 'Activity', label: '50+ Klinik Araştırma', sub: 'RCT Destekli' },
  { icon: 'Star', label: '4.8/5 Puan', sub: '500+ Değerlendirme' },
  { icon: 'CheckCircle', label: '60 Gün', sub: 'Para İade Garantisi' },
];

const ICON_MAP = {
  Shield: <Shield size={20} />,
  Activity: <Activity size={20} />,
  Star: <Star size={20} />,
  CheckCircle: <CheckCircle size={20} />,
};

const DEFAULT_STEPS = [
  { step: '01', title: 'Elektrod Pedi Takın', desc: 'İç çamaşırı konforu ile perineal bölgeye yerleştirin. Prob yok, girişim yok.' },
  { step: '02', title: 'Modu Seçin', desc: 'Mobil uygulamadan 17 hastalık modundan birini seçin. Kadın ve erkek profilleri ayrı.' },
  { step: '03', title: 'Seanı Başlatın', desc: '20 dakikalık bilimsel protokol otomatik çalışır. Günlük hayatınıza devam edin.' },
  { step: '04', title: 'İlerlemenizi Takip Edin', desc: 'Uygulama seans geçmişinizi ve iyileşme grafiğinizi gösterir. F1→F2→F3 faz ilerlemesi.' },
];

const DEFAULT_COMPARISON = [
  { feature: 'Non-invazif', pelvicair: true, internal: false, surgery: false, pt: true, pads: true },
  { feature: 'Evde kullanım', pelvicair: true, internal: true, surgery: false, pt: false, pads: true },
  { feature: 'Erkek & kadın', pelvicair: true, internal: false, surgery: true, pt: true, pads: true },
  { feature: 'Klinik etkinlik', pelvicair: true, internal: true, surgery: true, pt: true, pads: false },
  { feature: 'Mobil kontrol', pelvicair: true, internal: false, surgery: false, pt: false, pads: false },
  { feature: '3 modalite', pelvicair: true, internal: false, surgery: false, pt: false, pads: false },
  { feature: 'Uygun maliyet', pelvicair: true, internal: false, surgery: false, pt: false, pads: true },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [heroView, setHeroView] = useState('photos');
  const [photoIndex, setPhotoIndex] = useState(0);
  const { get, getJson } = useCms();
  const heroTitle = get('hero_title', 'Pelvik Taban Terapisi. Müdahalesiz. Kolay.');
  const heroTitleFs = get('hero_title_fs', '');
  const heroSubtitle = get('hero_subtitle', '');
  const heroSubtitleFs = get('hero_subtitle_fs', '');
  const heroCta = get('hero_cta', 'Fiyatı Gör');
  const cmsStats = getJson('home_stats', stats);
  const cmsModalities = getJson('home_modalities', modalities);
  const cmsClinicalResults = getJson('home_clinical_results', clinicalResults);
  const cmsSteps = getJson('home_steps', DEFAULT_STEPS);
  const cmsComparison = getJson('home_comparison', DEFAULT_COMPARISON);
  const cmsTrustBadges = getJson('home_trust_badges', DEFAULT_TRUST_BADGES);
  const cmsReviews = getJson('reviews_items', reviews).slice(0, 6);

  const goToPrice = () => {
    navigate('/urun/pelvicair');
    setTimeout(() => {
      document.getElementById('paketler')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div>
      {/* Hero */}
      <section data-hero className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 60%, #0d9488 100%)' }}>
        {HERO_DOTS.map((d, i) => (
          <span
            key={i}
            className="hero-dot"
            style={{
              width: d.size, height: d.size,
              top: d.top, left: d.left, right: d.right,
              '--dur': d.dur, '--delay': d.delay,
            }}
          />
        ))}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:pt-6 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="text-white -mt-10 lg:mt-0">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6 mt-24">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span className="text-teal-300 text-sm font-medium">CE Standartlarına Uygun - Tıbbi Sınıf Cihaz</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6" style={heroTitleFs ? { fontSize: `${heroTitleFs}px` } : {}}>
                {(() => {
                  const parts = heroTitle.split('Müdahalesiz.');
                  if (parts.length < 2) return heroTitle;
                  return <>{parts[0]}<br /><span className="text-teal-400">Müdahalesiz.</span>{parts[1]}</>;
                })()}
              </h1>
              <p className="text-lg text-blue-200 mb-8 leading-relaxed" style={heroSubtitleFs ? { fontSize: `${heroSubtitleFs}px` } : {}}>
                {heroSubtitle || 'EMS + Elektromanyetik Enerji + Vibrasyon. Üç güç, bir cihaz. 17 hastalık modunda klinik düzey rehabilitasyon artık evinizde.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={goToPrice}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#0d9488' }}
                >
                  {heroCta}
                  <ArrowRight size={18} />
                </button>
                <Link
                  to="/nasil-calisir"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white rounded-xl border border-white/30 hover:bg-white/10 transition-all"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {['%95 İyileşme Oranı', '50+ Klinik Araştırma', '17 Hastalık Modu'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-200">
                    <CheckCircle size={16} className="text-teal-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Product visual */}
            <div className="flex justify-center lg:justify-end lg:pt-10">
              <div className="relative w-full max-w-md flex flex-col gap-3">
                {/* Tab buttons — ürün sayfasıyla aynı stil */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setHeroView('photos')}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${heroView === 'photos' ? 'bg-teal-400 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    Ürün Fotoğrafları
                  </button>
                  <button
                    onClick={() => setHeroView('3d')}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${heroView === '3d' ? 'bg-teal-400 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    3D Görünüm
                  </button>
                </div>

                {heroView === 'photos' ? (
                  <>
                    <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center" style={{ height: '380px' }}>
                      <img
                        key={photoIndex}
                        src={PRODUCT_IMAGES[photoIndex]}
                        alt="PelvicAir ürün fotoğrafı"
                        className="w-full h-full object-contain p-4"
                        style={{ animation: 'fadeIn 0.3s ease' }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {PRODUCT_IMAGES.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`rounded-xl overflow-hidden border-2 transition-all aspect-square bg-white/10 ${i === photoIndex ? 'border-teal-400 scale-95' : 'border-transparent hover:border-white/40'}`}
                        >
                          <img src={src} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl overflow-hidden" style={{ height: '380px' }}>
                    <DeviceModel3D height="380px" />
                  </div>
                )}

                {/* Floating badges */}
                <div className="hero-badge-float absolute top-14 -right-12 bg-white rounded-xl px-3 py-2 shadow-lg">
                  <div className="text-xs font-bold text-gray-800">CE Standartlarına Uygun</div>
                  <div className="text-xs text-gray-500">Tıbbi Cihaz</div>
                </div>
                <div className="hero-badge-float-alt absolute -bottom-4 -left-4 bg-teal-600 rounded-xl px-3 py-2 shadow-lg text-white">
                  <div className="text-xs font-bold">3 Modalite</div>
                  <div className="text-xs text-teal-200">17 Protokol</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {cmsTrustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                  {ICON_MAP[badge.icon] || null}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{badge.label}</div>
                  <div className="text-xs text-gray-500">{badge.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Pelvik Sağlık: Sessiz Kriz</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Milyonlar tedavi aramaktan çekinmekte. PelvicAir bu boşluğu klinik etkinlik ve ev erişilebilirliğiyle kapatıyor.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {cmsStats.map((stat, i) => (
              <AnimateInView key={stat.value} delay={i * 100}>
                <div className="text-center p-6 rounded-2xl bg-gray-50 h-full">
                  <div className="text-4xl font-bold mb-1" style={{ color: '#0d9488' }}>{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.desc}</div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Modalities */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Üç Tedavi Modalitesi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Her modalite diğerinin etkisini güçlendiren sinerjik bir yapıda çalışır.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {cmsModalities.map((m, i) => (
              <AnimateInView key={m.name} delay={i * 150} type="scale">
                <div className={`rounded-2xl border-2 p-6 bg-white h-full ${m.border}`}>
                  <div className="text-4xl mb-4">{m.icon}</div>
                  <h3 className={`text-lg font-bold mb-1 ${m.color}`}>{m.name}</h3>
                  <div className="text-sm font-medium text-gray-500 mb-3">{m.fullName}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-teal-600 text-white rounded-2xl px-6 py-3">
              <Zap size={18} />
              <span className="font-semibold">Sinerjik Etki:</span>
              <span className="text-teal-100 text-sm">Kombinasyon tedavisi tek başına hiçbir modalitaenin ulaşamadığı derinliği sağlar.</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Güvene Giden 4 Adım</h2>
            <p className="text-gray-500">Klinik düzey tedavi, evde basit adımlarla.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cmsSteps.map((s, i) => (
              <AnimateInView key={s.step} delay={i * 110}>
                <div className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4" style={{ backgroundColor: '#0d9488' }}>
                    {s.step}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/nasil-calisir" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700">
              Detaylı Bilgi <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Clinical Results */}
      <section className="py-16" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Bilimle Desteklenen Sonuçlar</h2>
            <p className="text-blue-300">RCT, meta-analiz ve Cochrane derleme verileri</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cmsClinicalResults.map((r, i) => (
              <AnimateInView key={r.value} delay={i * 100}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/10 h-full">
                  <div className="text-4xl font-bold text-teal-400 mb-2">{r.value}</div>
                  <div className="text-sm font-semibold text-white mb-1">{r.label}</div>
                  <div className="text-xs text-blue-300 mb-2">{r.detail}</div>
                  <div className="text-xs text-blue-400 italic">{r.source}</div>
                </div>
              </AnimateInView>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/klinik-kanit" className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300">
              Tüm Klinik Kanıtları Gör <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>PelvicAir vs. Diğer Yöntemler</h2>
            <p className="text-gray-500">Neden PelvicAir? Bir karşılaştırma.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Özellik</th>
                  <th className="py-3 px-4 font-bold text-teal-600 bg-teal-50 rounded-t-xl">PelvicAir</th>
                  <th className="py-3 px-4 font-medium text-gray-500">İnternal Cihazlar</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Cerrahi</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Fizyoterapi</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Ped/İç Çamaşır</th>
                </tr>
              </thead>
              <tbody>
                {cmsComparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-medium text-gray-700">{row.feature}</td>
                    {[row.pelvicair, row.internal, row.surgery, row.pt, row.pads].map((val, j) => (
                      <td key={j} className={`py-3 px-4 text-center ${j === 0 ? 'bg-teal-50' : ''}`}>
                        {val
                          ? <CheckCircle size={18} className="inline text-teal-500" />
                          : <span className="inline-block w-4 h-0.5 bg-red-300 rounded"></span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-2">
              <StarRating rating={5} />
              <span className="font-bold text-gray-900">4.8/5</span>
              <span className="text-gray-500 text-sm">· 500+ değerlendirme</span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>Kullanıcılarımız Ne Diyor?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cmsReviews.map((review, i) => (
              <AnimateInView key={review.name} delay={i * 120}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full">Doğrulanmış</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0d9488' }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{review.name}</div>
                      <div className="text-xs text-gray-400">{review.location} · {review.date}</div>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/yorumlar" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700">
              Tüm Yorumları Gör <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl p-10 border-2" style={{ borderColor: '#0d9488', backgroundColor: '#f0fdfa' }}>
            <div className="text-4xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Hangi Mod Size Uygun?</h2>
            <p className="text-gray-600 mb-6">3 dakikalık kısa testimizle size en uygun tedavi protokolünü belirleyin.</p>
            <Link
              to="/sss"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              Testi Başlat
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a5f' }}>Pelvik Sağlık Bültenimize Katılın</h3>
          <p className="text-gray-500 text-sm mb-5">İlk siparişinizde <span className="font-semibold text-teal-600">₺500 indirim</span> kazanın. Bilimsel içerikler ve ürün haberleri.</p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
