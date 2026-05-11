import { CheckCircle } from 'lucide-react';
import { useCms } from '../hooks/useCms';

const DEFAULT_VALUES = [
  { icon: '❤️', title: 'Empati', desc: 'Pelvik sağlık sorunları utanç değil, tıbbi bir gerçekliktir. Her hasta saygı ve anlayışla karşılanır.' },
  { icon: '🔬', title: 'İnovasyon', desc: 'Klinik etkinliği ev erişilebilirliğiyle birleştiren teknolojiyi geliştiriyoruz. Durmaksızın.' },
  { icon: '🛡', title: 'Güven', desc: 'CE belgeli, klinik kanıtlı, şeffaf. Müşterilerimiz her adımda bilgilendirilir.' },
  { icon: '🌿', title: 'Özgürlük', desc: 'Pelvik sağlık sorunu yaşayan her birey, utanmadan, konforla iyileşme hakkına sahiptir.' },
];

const DEFAULT_CERTS = [
  { title: 'CE Belgesi', detail: 'MDR 2017/745 uyumlu tıbbi cihaz' },
  { title: 'ISO 13485:2016', detail: 'Tıbbi cihaz kalite yönetim sistemi' },
  { title: 'ISO 10993', detail: 'Biyouyumluluk test sertifikası' },
  { title: '5 Patent', detail: 'Türk Patent Enstitüsü tescilli' },
];

const DEFAULT_TEAM = [
  { name: 'Dr. Elif Yıldız', role: 'Kurucu & CEO', bg: '#0d9488' },
  { name: 'Mhd. Tarık Demir', role: 'CTO / Ar-Ge', bg: '#1e3a5f' },
  { name: 'Fzt. Ayşe Kılıç', role: 'Klinik Direktör', bg: '#0d9488' },
  { name: 'Ahmet Şahin', role: 'Medikal İşler', bg: '#b87333' },
  { name: 'Dr. Mehmet Can', role: 'Üroloji Danışmanı', bg: '#1e3a5f' },
  { name: 'Selin Arslan', role: 'Ürün Yönetimi', bg: '#0d9488' },
];

const DEFAULT_MISSION_ITEMS = [
  { item: 'CE belgeli tıbbi sınıf cihaz' },
  { item: '50+ klinik araştırma desteği' },
  { item: 'Hem kadın hem erkek için 17 protokol' },
  { item: 'Evde, gizlilikle, klinik düzey tedavi' },
];

export default function AboutPage() {
  const { get, getJson } = useCms();
  const heroTitle = get('about_title', 'Hakkımızda');
  const heroSubtitle = get('about_hero_subtitle', 'PelviCare, pelvik sağlık sorunlarının utanç kaynağı değil çözülebilir tıbbi durumlar olduğuna inanan bir ekip tarafından kurulmuştur.');
  const missionTitle = get('about_mission_title', 'Pelvik Sağlığı Herkes İçin Erişilebilir Kılmak');
  const missionText1 = get('about_mission_text1', "Dünya genelinde 500 milyondan fazla insan pelvik taban bozukluğuyla yaşıyor. Bunların %68'i utanç, bilinçsizlik veya erişim engeli nedeniyle hiç tedavi aramıyor. Tek bir klinik HIFEM seansının maliyeti ₺5.000'i aşabiliyor.");
  const missionText2 = get('about_mission_text2', 'PelviCare bu boşluğu kapatmak için kuruldu: Klinik etkinliği, ev erişilebilirliği ve hem kadın hem erkek kapsamıyla birleştiren, giyilebilir, non-invazif bir platform.');
  const missionItems = getJson('about_mission_items', DEFAULT_MISSION_ITEMS);
  const valuesTitle = get('about_values_title', 'Temel Değerlerimiz');
  const values = getJson('about_values', DEFAULT_VALUES);
  const teamTitle = get('about_team_title', 'Ekibimiz');
  const teamSubtitle = get('about_team_subtitle', 'Tıp, mühendislik ve hasta savunuculuğundan gelen uzman ekip');
  const team = getJson('about_team', DEFAULT_TEAM);
  const certsTitle = get('about_certs_title', 'Sertifikalar & Standartlar');
  const certs = getJson('about_certs', DEFAULT_CERTS);
  const founderName = get('about_founder_name', 'Dr. Elif Yıldız');
  const founderRole = get('about_founder_role', 'Kurucu & CEO');
  const founderQuote = get('about_founder_quote', '"Pelvik taban sorunlarıyla kişisel deneyimim yaşandıktan sonra, bu konunun ne kadar büyük bir sessizlikle taşındığını gördüm. Mevcut çözümler ya klinik ortamda pahalı, ya invazif, ya da sadece kadınlara yönelik. PelviCare\'i hem kadın hem erkek için, hem klinik düzeyde etkili hem de evde kullanılabilir bir çözüm olarak inşa ettik."');

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

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-bold text-teal-600 mb-3">Misyonumuz</div>
              <h2 className="text-3xl font-bold mb-5" style={{ color: '#1e3a5f' }}>
                {missionTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">{missionText1}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{missionText2}</p>
              <div className="space-y-3">
                {missionItems.map((m) => (
                  <div key={m.item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                    {m.item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#f0fdfa' }}>
              <div className="text-6xl mb-4">🌍</div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#0d9488' }}>500M+</div>
              <div className="text-gray-600 mb-4">Küresel hasta</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#1e3a5f' }}>%68</div>
              <div className="text-gray-600 mb-4">Tedavi aramıyor</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#0d9488' }}>₺5.000+</div>
              <div className="text-gray-600">Tek klinik seans maliyeti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>{valuesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>{teamTitle}</h2>
            <p className="text-gray-500">{teamSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: member.bg }}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>{certsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certs.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-5 border border-teal-200 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#ccfbf1' }}>
                  <span className="text-teal-600 font-bold">✓</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 lg:p-10" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl" style={{ backgroundColor: '#0d9488' }}>
                E
              </div>
              <div>
                <div className="text-lg font-bold text-white">{founderName}</div>
                <div className="text-teal-400 text-sm">{founderRole}</div>
              </div>
            </div>
            <blockquote className="text-blue-200 leading-relaxed text-lg italic">
              {founderQuote}
            </blockquote>
            <div className="mt-4 text-sm text-blue-400">— {founderName}, PelviCare Kurucu</div>
          </div>
        </div>
      </section>
    </div>
  );
}
