import { clinicalResults, modalities, techSpecs } from '../data/product';
import { useCms } from '../hooks/useCms';

const DEFAULT_STUDIES = [
  { modalite: 'EMS · K-01', endikasyon: 'İdrar Kaçırma', sonuc: '%95 sızıntı azalması', kaynak: 'Stania M. et al. 2022 RCT', tag: 'RCT' },
  { modalite: 'Manyetik · K-03', endikasyon: 'Prolapsus', sonuc: '%100 POP-Q evre iyileşmesi (20 seans)', kaynak: 'Xu J. et al. 2023 RCT', tag: 'RCT' },
  { modalite: 'EMS · K-04', endikasyon: 'Dismenore', sonuc: '-%93 analjezik; %74 rahatlama', kaynak: 'Han S. Cochrane 2024 (20 RCT)', tag: 'Cochrane' },
  { modalite: 'EMS · E-03', endikasyon: 'Erektil Disfonksiyon', sonuc: 'İntrakavernal basınç artışı (RCT)', kaynak: 'Capogrosso et al. 2018', tag: 'RCT' },
];

const DEFAULT_DIFFS = [
  { title: 'Non-invazif Perineal Yerleşim', desc: 'Vücut dışında, iç çamaşırı gibi kullanım. Vajinal veya rektal prob gerektirmez.' },
  { title: 'Üç Bölgeli Hidrojel Yapısı', desc: 'Dört ayrı hidrojel bölgesi, anatomik alanlara optimum enerji iletimi sağlar.' },
];

const tagColors = {
  RCT: 'bg-teal-100 text-teal-700',
  Cochrane: 'bg-blue-100 text-blue-700',
  Klinik: 'bg-purple-100 text-purple-700',
  'Meta-Analiz': 'bg-amber-100 text-amber-700',
};

export default function SciencePage() {
  const { get, getJson } = useCms();
  const heroTitle = get('science_hero_title', 'Bilimsel Kanıtlar');
  const heroSubtitle = get('science_hero_subtitle', 'PelviCare\'in etkinliği 50\'den fazla randomize kontrollü klinik çalışma ile desteklenmektedir.');
  const clinicalStudies = getJson('science_studies', DEFAULT_STUDIES);
  const differentiators = getJson('science_differentiators', DEFAULT_DIFFS);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl text-blue-200 leading-relaxed mb-8">
            {heroSubtitle}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '50+', label: 'Klinik Araştırma' },
              { value: '%95', label: 'İnkontinansta İyileşme' },
              { value: '%100', label: 'Prolapsus POP-Q' },
              { value: '%74', label: 'Dismenore Rahatlaması' },
            ].map((stat) => (
              <div key={stat.value} className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-bold text-teal-400">{stat.value}</div>
                <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Devrimci Teknoloji</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">PelviCare'i diğer cihazlardan ayıran dört temel patentli özellik</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/30 transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#0d9488' }}>
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{d.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalities Science */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Modalitelerin Bilimsel Temeli</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {modalities.map((m) => (
              <div key={m.name} className={`rounded-2xl border-2 p-6 bg-white ${m.border}`}>
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${m.color}`}>{m.name} — {m.fullName}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Studies Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Klinik Çalışma Özeti</h2>
            <p className="text-gray-500">Seçilmiş RCT, meta-analiz ve Cochrane derleme sonuçları</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#1e3a5f' }}>
                <tr>
                  <th className="text-left py-4 px-5 text-white font-semibold">Modalite</th>
                  <th className="text-left py-4 px-5 text-white font-semibold">Endikasyon</th>
                  <th className="text-left py-4 px-5 text-white font-semibold">Klinik Sonuç</th>
                  <th className="text-left py-4 px-5 text-white font-semibold">Kaynak</th>
                  <th className="text-left py-4 px-5 text-white font-semibold">Tür</th>
                </tr>
              </thead>
              <tbody>
                {clinicalStudies.map((study, i) => (
                  <tr key={study.kaynak} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3.5 px-5 font-medium text-gray-700">{study.modalite}</td>
                    <td className="py-3.5 px-5 text-gray-600">{study.endikasyon}</td>
                    <td className="py-3.5 px-5 font-semibold text-teal-700">{study.sonuc}</td>
                    <td className="py-3.5 px-5 text-gray-500 italic text-xs">{study.kaynak}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColors[study.tag]}`}>
                        {study.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Clinical Results Cards */}
      <section className="py-16" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Öne Çıkan Sonuçlar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinicalResults.map((r) => (
              <div key={r.value} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/10">
                <div className="text-4xl font-bold text-teal-400 mb-2">{r.value}</div>
                <div className="text-sm font-semibold text-white mb-1">{r.label}</div>
                <div className="text-xs text-blue-300 mb-2">{r.detail}</div>
                <div className="text-xs text-blue-400 italic">{r.source}</div>
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
            <p className="text-gray-500">Tam programlanabilir klinik düzey parametreler</p>
          </div>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {techSpecs.map((spec, i) => (
              <div key={spec.param} className={`flex justify-between items-center px-6 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <span className="text-sm font-medium text-gray-700">{spec.param}</span>
                <span className="text-sm font-semibold" style={{ color: '#0d9488' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#1e3a5f' }}>Sertifikalar ve Uyumluluk</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'CE Belgesi', desc: 'Avrupa Tıbbi Cihaz Yönetmeliği MDR 2017/745 uyumlu' },
              { title: 'ISO 13485:2016', desc: 'Tıbbi cihaz kalite yönetim sistemi sertifikası' },
              { title: 'ISO 10993', desc: 'Biyouyumluluk testi — tüm temas yüzeyleri' },
              { title: 'IEC 60601', desc: 'Tıbbi elektrikli cihaz güvenlik standardı' },
            ].map((cert) => (
              <div key={cert.title} className="bg-white rounded-2xl p-5 border border-gray-200 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#ccfbf1' }}>
                  <span className="text-teal-600 font-bold text-lg">✓</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{cert.title}</h3>
                <p className="text-xs text-gray-500">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
