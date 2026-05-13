import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Star, Shield, Truck, RotateCcw, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import DeviceModel3D from '../components/DeviceModel3D';

const galleryImages = [
  { src: '/images/urun-sistem-genel.jpg', alt: 'PelvicAir Sistem Genel Görünüm', label: 'Sistem Genel' },
  { src: '/images/urun-elektrod-pad.jpg', alt: 'PelvicAir Elektrod Pad Detay', label: 'Elektrod Pad' },
  { src: '/images/cihaz.png',   alt: 'PelvicAir Cihaz Yan Görünüm', label: 'Yan Görünüm' },
  { src: '/images/cihaz-2.png', alt: 'PelvicAir Cihaz Üst Görünüm', label: 'Üst Görünüm' },
  { src: '/images/cihaz-3.png', alt: 'PelvicAir Cihaz Ön Görünüm', label: 'Ön Görünüm' },
  { src: '/images/cihaz-4.png', alt: 'PelvicAir Cihaz Boyutları', label: 'Boyutlar' },
  { src: '/images/cihaz-5.png', alt: 'PelvicAir Cihaz Arka Görünüm', label: 'Arka Görünüm' },
  { src: '/images/cihaz-6.png', alt: 'PelvicAir Cihaz LED Panel', label: 'LED Panel' },
];

function ProductGallery() {
  const [tab, setTab] = useState('photos');
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('3d')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === '3d' ? 'bg-teal-400 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
        >
          3D Görünüm
        </button>
        <button
          onClick={() => setTab('photos')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'photos' ? 'bg-teal-400 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
        >
          Fotoğraflar
        </button>
      </div>

      {tab === '3d' ? (
        <div className="rounded-2xl overflow-hidden" style={{ height: '380px' }}>
          <DeviceModel3D height="380px" />
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/20 flex items-center justify-center" style={{ height: '300px' }}>
            <img
              src={galleryImages[active].src}
              alt={galleryImages[active].alt}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-xl overflow-hidden border-2 transition-all aspect-square bg-white/10 ${active === i ? 'border-teal-400 scale-95' : 'border-transparent hover:border-white/40'}`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const packages = [
  {
    id: 'pkg-starter',
    name: 'Başlangıç Paketi',
    icon: '🩺',
    variant: 'PelvicAir Cihazı + 2 Pad',
    price: 4990,
    displayPrice: '₺4.990',
    oldPrice: null,
    badge: null,
    features: [
      'PelvicAir Ana Cihaz',
      '2 Adet Elektrod Pad (10 seans)',
      'Mobil Uygulama Erişimi',
      'Türkçe Kullanım Kılavuzu',
      '1 Yıl Garanti',
    ],
    cta: 'Sepete Ekle',
    highlighted: false,
  },
  {
    id: 'pkg-premium',
    name: 'Premium Paket',
    icon: '⭐',
    variant: 'PelvicAir Cihazı + 4 Pad + Şarj',
    price: 6490,
    displayPrice: '₺6.490',
    oldPrice: '₺7.990',
    badge: 'En Popüler',
    features: [
      'PelvicAir Ana Cihaz',
      '4 Adet Elektrod Pad (20 seans)',
      'Mobil Uygulama Erişimi (Premium)',
      'Türkçe Kullanım Kılavuzu',
      '2 Yıl Garanti',
      'Öncelikli Destek',
      'Şarj Ünitesi',
    ],
    cta: 'Sepete Ekle',
    highlighted: true,
  },
  {
    id: 'pkg-pro',
    name: 'Profesyonel Paket',
    icon: '🏥',
    variant: 'Klinisyen — 2 Cihaz + 10 Pad',
    price: 8990,
    displayPrice: '₺8.990',
    oldPrice: null,
    badge: 'Klinisyen İçin',
    features: [
      'PelvicAir Ana Cihaz (x2)',
      '10 Adet Elektrod Pad (50 seans)',
      'Klinisyen Yönetim Paneli',
      'Hasta Takip Sistemi',
      'Teknik Destek Hattı',
      '3 Yıl Garanti',
      'Eğitim Materyalleri',
    ],
    cta: 'Bilgi Al',
    highlighted: false,
  },
];

const guarantees = [
  { icon: <Shield size={22} />, title: '60 Gün Para İade', desc: 'Memnun kalmazsanız iade garantisi' },
  { icon: <Truck size={22} />, title: 'Ücretsiz Kargo', desc: '₺500 üzeri siparişlerde' },
  { icon: <RotateCcw size={22} />, title: '2 Yıl Garanti', desc: 'Premium pakette uzatılmış garanti' },
  { icon: <CheckCircle size={22} />, title: 'CE Belgeli', desc: 'Tıbbi sınıf ürün' },
];

const padDetails = [
  { label: 'Kullanım', value: '3–5 seans / pad' },
  { label: 'Yapı', value: 'Hidrojel (glisérin, su, tuz, poliakrilik asit)' },
  { label: 'Yapışkanlık', value: 'Hafif yapışkan, tüy çekmez' },
  { label: 'Boyut', value: 'Universal fit (tek beden)' },
  { label: 'Bağlantı', value: 'Kolay snap sistemi' },
  { label: 'Saklama', value: 'Resealable poşet' },
  { label: 'Biyouyumluluk', value: 'Test edilmiş, ISO 10993 uyumlu' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { addToCart } = useCart();
  const location = useLocation();

  const handleAdd = (pkg) => {
    if (pkg.cta === 'Bilgi Al') {
      window.location.href = '/iletisim';
      return;
    }
    addToCart({ id: pkg.id, name: pkg.name, icon: pkg.icon, variant: pkg.variant, price: pkg.price, path: location.pathname });
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white -mt-[3px]">
              <div className="inline-block bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-teal-300 text-sm font-medium">CE Belgeli · Tıbbi Sınıf</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">PelvicAir</h1>
              <p className="text-lg text-blue-200 mb-2">Akıllı Hibrit Pelvik Taban Rehabilitasyon Sistemi</p>
              <p className="text-blue-300 text-sm mb-6">"Üç güç. Bir cihaz. Sonsuz özgürlük."</p>
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={5} />
                <span className="text-blue-200 text-sm">4.8/5 · 500+ değerlendirme</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['⚡ EMS', '🧲 Manyetik', '📳 Vibrasyon'].map((mod) => (
                  <div key={mod} className="text-center bg-white/10 rounded-xl py-2 text-sm font-medium text-white">
                    {mod}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href="#paketler"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0d9488' }}
                >
                  Fiyatı Gör <ArrowRight size={16} />
                </a>
                <Link
                  to="/nasil-calisir"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl border border-white/30 hover:bg-white/10 transition-all"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto">
              <ProductGallery />
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((g) => (
              <div key={g.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                  {g.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{g.title}</div>
                  <div className="text-xs text-gray-500">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Temel Özellikler</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🩹', title: 'Non-invazif Tasarım', desc: 'Prob gerektirmez. İç çamaşırı gibi giyin. Giysi altında görünmez.' },
              { icon: '📱', title: 'Tam Mobil Kontrol', desc: 'iOS ve Android uyumlu uygulama. 17 hazır mod, manuel kontrol imkânı.' },
              { icon: '⚡', title: '3 Sinerjik Modalite', desc: 'EMS + Elektromanyetik Enerji + Vibrasyon. Kombinasyon tedavisi.' },
              { icon: '👥', title: 'Kadın & Erkek', desc: '10 kadın + 7 erkek protokolü. Anatomiye özel tasarım.' },
              { icon: '📊', title: 'İlerleme Takibi', desc: 'Seans geçmişi, grafik ve faz tabanlı otomatik ilerleme.' },
              { icon: '🔬', title: 'Klinik Kanıtlı', desc: '50+ klinik araştırma. RCT ve Cochrane meta-analiz destekli.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all">
                <div className="text-3xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="paketler" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Paket Seçenekleri</h2>
            <p className="text-gray-500">İhtiyacınıza en uygun paketi seçin.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-3xl p-8 ${
                  pkg.highlighted
                    ? 'border-2 shadow-xl relative'
                    : 'border border-gray-200 bg-white'
                }`}
                style={pkg.highlighted ? { borderColor: '#0d9488', backgroundColor: '#f0fdfa' } : {}}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold text-white px-4 py-1 rounded-full" style={{ backgroundColor: '#0d9488' }}>
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>{pkg.displayPrice}</span>
                </div>
                {pkg.oldPrice && (
                  <div className="text-sm text-gray-400 line-through mb-4">{pkg.oldPrice}</div>
                )}
                {!pkg.oldPrice && <div className="mb-4"></div>}
                <ul className="space-y-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAdd(pkg)}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={pkg.highlighted ? { backgroundColor: '#0d9488', color: 'white' } : { backgroundColor: '#1e3a5f', color: 'white' }}
                >
                  {pkg.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Fiyatlara KDV dahildir. Ücretsiz kargo geçerlidir. 60 gün para iade garantisi.</p>
        </div>
      </section>

      {/* Electrode Pad */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Aksesuar</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1e3a5f' }}>PelvicAir Elektrod Pad</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Özel hidrojel formülasyonu, yüksek iletkenlik ve vücut uyumu sağlar. Tüy çekmez, hafif yapışkan yüzeyi ile konforlu kullanım sunar.
              </p>
              <div className="space-y-3">
                {padDetails.map((d) => (
                  <div key={d.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">{d.label}</span>
                    <span className="text-sm text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>₺290</div>
                  <div className="text-xs text-gray-500">5'li paket (15–25 seans)</div>
                </div>
                <button
                  onClick={() => addToCart({ id: 'pad-5pack', name: 'Elektrod Pad', icon: '🔋', variant: '5\'li Paket (15–25 seans)', price: 290, path: '/urun/elektrod-pad' })}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{ backgroundColor: '#0d9488' }}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#f0fdfa' }}>
              <img
                src="/images/urun-elektrod-pad.jpg"
                alt="PelvicAir Elektrod Pad"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Mini */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a5f' }}>Sorunuz mu var?</h3>
          <p className="text-gray-500 text-sm mb-4">Sık sorulan soruların yanıtlarını bulun veya bizimle iletişime geçin.</p>
          <div className="flex justify-center gap-4">
            <Link to="/sss" className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700">
              SSS'ye Git <ArrowRight size={14} />
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/iletisim" className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700">
              İletişim <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
