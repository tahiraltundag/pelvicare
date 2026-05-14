import { Smartphone, Zap, Activity, Waves } from 'lucide-react';
import { modalities, techSpecs } from '../data/product';
import { useCms } from '../hooks/useCms';

const DEFAULT_PHASES = [
  { code: 'F1', name: 'Fortifikasyon', duration: '1–2 Hafta', desc: 'Düşük yoğunlukta kas aktivasyonu ve nöromusküler bağlantı kurma. Vücut cihaza adapte olur.' },
  { code: 'F2', name: 'Güçlendirme', duration: '3–6 Hafta', desc: 'Artan şiddet ve frekansla klinik etkinlik bölgesine geçiş. Kas kuvveti ve dayanıklılık artar.' },
  { code: 'F3', name: 'İdame', duration: 'Sürekli', desc: 'Kazanılan terapötik kazanımları koruma. Haftada 3 seans ile uzun vadeli sağlık sürdürülür.' },
];

const PHASE_STYLES = {
  F1: { badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  F2: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  F3: { badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
};

const DEFAULT_APP_FEATURES = [
  { title: 'Hazır Modlar', desc: '17 tanıya tek dokunuşla başlatma. Kadın / Erkek profil seçimi. Mod açıklaması ve bilgi ekranı.' },
  { title: 'Manuel Kontrol', desc: 'EMS, Manyetik, Vibrasyon ayrı ayrı ayarlama. Frekans, şiddet, süre, duty cycle kontrolü.' },
  { title: 'Takip & Rehberlik', desc: 'Faz bazlı otomatik ilerleme F1→F2→F3. Seans geçmişi ve ilerleme grafiği. Hatırlatıcı desteği.' },
  { title: 'Bluetooth Bağlantı', desc: 'iOS ve Android uyumlu. Firmware güncelleme desteği. Cihaz durumu anlık izleme.' },
];

const DEFAULT_HOW_STEPS = [
  { num: '01', title: 'Elektrod Pedi Hazırlayın', desc: 'Resealable poşetten çıkarın. Hidrojel yüzeyinin nemliliğini kontrol edin. Her pad 3–5 seans kullanıma uygundur.' },
  { num: '02', title: 'Pedi Yerleştirin', desc: 'İç çamaşırı konforu ile perineal bölgeye yerleştirin. Prob yok, girişim yok. Giysi altında tamamen görünmez.' },
  { num: '03', title: 'Uygulamayı Açın', desc: 'Bluetooth ile cihaza bağlanın. Kadın veya erkek profilinizi seçin. Hastalık modunuzu belirleyin ve seanı başlatın.' },
  { num: '04', title: 'Seanı Tamamlayın', desc: '20 dakikalık protokol otomatik çalışır. Günlük aktivitelerinize devam edebilirsiniz. Uygulama ilerlemenizi kaydeder.' },
];

const DEFAULT_CONTRAINDICATIONS = [
  'Kalp pili (pacemaker) veya aktif implant',
  'Gebelik',
  'Aktif enfeksiyon veya açık yara',
  'Epilepsi',
  'Deri bütünlüğü bozuk bölge',
  'İmplante edilmiş metalik cihaz (pelvik bölge)',
  'Aktif kanser tedavisi',
  'Kalp ritim bozukluğu',
];

const APP_FEATURE_ICONS = [<Activity size={20} />, <Zap size={20} />, <Waves size={20} />, <Smartphone size={20} />];

export default function HowItWorksPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('how_hero_title', 'Nasıl Çalışır?');
  const heroSubtitle = get('how_hero_subtitle', 'PelvicAir, üç tedavi modalitesini tek bir giyilebilir cihazda birleştirerek klinik düzey pelvik taban rehabilitasyonunu evinize taşır.');
  const phases = getJson('how_phases', DEFAULT_PHASES);
  const appFeatures = getJson('how_app_features', DEFAULT_APP_FEATURES);
  const howSteps = getJson('how_steps', DEFAULT_HOW_STEPS);
  const contraindications = getJson('how_contraindications', DEFAULT_CONTRAINDICATIONS);
  const cmsModalities = getJson('home_modalities', modalities);
  const cmsSpecs = getJson('tech_specs', techSpecs);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-blue-200 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Kullanım Adımları</h2>
            <p className="text-gray-500">4 basit adımda klinik düzey tedavi</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {howSteps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#f0fdfa' }}>
              <div className="text-8xl mb-6">📱</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a5f' }}>PelvicAir Mobil App</h3>
              <p className="text-gray-600 text-sm mb-4">iOS & Android uyumlu. Türkçe arayüz.</p>
              <div className="flex justify-center gap-3">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 text-xs font-medium">App Store</div>
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 text-xs font-medium">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Phases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Faz Tabanlı Tedavi Protokolü</h2>
            <p className="text-gray-500">Bilimsel protokol üç fazda ilerler ve uygulama otomatik yönetir.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase) => {
              const styles = PHASE_STYLES[phase.code] || { badge: 'bg-gray-100 text-gray-700', border: 'border-gray-200' };
              return (
              <div key={phase.code} className={`rounded-2xl border-2 p-6 ${styles.border}`}>
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold mb-4 ${styles.badge}`}>
                  {phase.code}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{phase.name}</h3>
                <div className="text-sm text-gray-500 mb-3">{phase.duration}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{phase.desc}</p>
              </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Otomatik İlerleme:</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">F1</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">F2</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">F3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalities Detail */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Tedavi Modaliteleri Detayı</h2>
            <p className="text-gray-500">Her modalite farklı mekanizma ile etki eder — birlikte kullanıldığında sinerjik etki sağlarlar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {cmsModalities.map((m) => (
              <div key={m.name} className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{m.icon}</div>
                <h3 className={`text-lg font-bold mb-1 ${m.color}`}>{m.name}</h3>
                <div className="text-sm text-gray-500 mb-3">{m.fullName}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Mobil Uygulama Özellikleri</h2>
            <p className="text-blue-300">Tam kontrol parmaklarınızın ucunda</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((f, i) => (
              <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-teal-400 bg-teal-400/10 mb-4">
                  {APP_FEATURE_ICONS[i % APP_FEATURE_ICONS.length]}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-blue-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Teknik Parametreler</h2>
            <p className="text-gray-500">Tam programlanabilir, klinik düzey parametreler</p>
          </div>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {cmsSpecs.map((spec, i) => (
              <div key={spec.param} className={`flex justify-between items-center px-6 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <span className="text-sm font-medium text-gray-700">{spec.param}</span>
                <span className="text-sm font-semibold" style={{ color: '#0d9488' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contraindications */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-amber-800 mb-4">⚠️ Kontrendikasyonlar</h2>
          <p className="text-amber-700 text-sm mb-4">Aşağıdaki durumlarda kullanmayınız. Herhangi bir şüphede hekiminize danışın.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {contraindications.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-amber-800">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
