import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { useCms } from '../hooks/useCms';

const DEFAULT_PRESCRIBE_STEPS = [
  { step: '1', title: 'Hastayı Değerlendirin', desc: 'Pelvik taban bozukluğunu tanımlayın ve PelvicAir kontrendikasyonlarını dışlayın.' },
  { step: '2', title: 'Protokol Seçin', desc: 'Mobil uygulamadan veya PelvicAir Klinisyen Portalı\'ndan uygun hastalık modunu (K-01 ila E-07) önerin.' },
  { step: '3', title: 'Hastayı Yönlendirin', desc: 'Reçete veya öneri mektubu yazın. Hasta web sitesinden veya yetkili satıcıdan temin edebilir.' },
];

const DEFAULT_CLINICAL_EVIDENCE = [
  { title: '%25 Hatalı Kegel', desc: 'Kadınların %25\'i Kegel egzersizini hatalı yapıyor — etki sıfır. PelvicAir pasif Kegel ile bu sorunu ortadan kaldırır.', source: 'Bø K. et al. 2012' },
  { title: '%13 PT Tamamlama', desc: 'Pelvik taban fizyoterapisi seanslarını tamamlama oranı sadece %13. Evde PelvicAir ile uyum dramatik artar.', source: 'Klotz T. et al. 2019' },
  { title: 'OAB İlaç Yan Etkileri', desc: 'Antikolinerjik ilaçların %40 bırakma oranı. PelvicAir farmakolojik olmayan bir alternatif sunar.', source: 'Chapple CR. et al. 2021' },
];

const DEFAULT_DOWNLOADS = [
  { title: 'Klinisyen Reçete Rehberi', desc: 'Hastalık modları, kontrendikasyonlar ve dozaj parametreleri', format: 'PDF' },
  { title: 'Klinik Kanıt Özeti', desc: '50+ çalışmanın özeti — RCT, meta-analiz, Cochrane', format: 'PDF' },
  { title: 'Hasta Bilgi Broşürü', desc: 'Hastanıza verebileceğiniz Türkçe ürün tanıtım broşürü', format: 'PDF' },
  { title: 'Toplu Satış Başvurusu', desc: 'Klinik ve hastane alımları için başvuru formu', format: 'FORM' },
];

export default function ClinicianPage() {
  const { user, isClinician } = useAuth();
  const navigate = useNavigate();
  const { get, getJson } = useCms();
  const heroTitle = get('clinician_title', 'Hastanız İçin Yeni Bir Seçenek');
  const heroTitleFs = get('clinician_title_fs', '');
  const heroSubtitle = get('clinician_subtitle', 'PelvicAir, klinik fizyoterapiye ek veya monoterapi olarak reçete edebileceğiniz, CE belgeli, klinik kanıtlı non-invazif bir cihaz.');
  const heroSubtitleFs = get('clinician_subtitle_fs', '');
  const prescribeSteps = getJson('clinician_prescribe_steps', DEFAULT_PRESCRIBE_STEPS);
  const clinicalEvidence = getJson('clinician_evidence', DEFAULT_CLINICAL_EVIDENCE);
  const downloads = getJson('clinician_downloads', DEFAULT_DOWNLOADS);
  return (
    <div>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-teal-300 text-sm font-medium">Sağlık Profesyonelleri</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={heroTitleFs ? { fontSize: `${heroTitleFs}px` } : {}}>{heroTitle}</h1>
              <p className="text-xl text-blue-200 leading-relaxed mb-6" style={heroSubtitleFs ? { fontSize: `${heroSubtitleFs}px` } : {}}>
                {heroSubtitle}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { val: 'CE', label: 'Belgeli' },
                  { val: '50+', label: 'Klinik Çalışma' },
                  { val: '17', label: 'Tanı Modu' },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-white/10 rounded-xl p-3">
                    <div className="text-xl font-bold text-teal-400">{s.val}</div>
                    <div className="text-xs text-blue-200">{s.label}</div>
                  </div>
                ))}
              </div>
              <a
                href="#iletisim"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
                style={{ backgroundColor: '#0d9488' }}
              >
                Bilgi Talep Et <ArrowRight size={16} />
              </a>
            </div>
            <div className="flex justify-center">
              <div className="rounded-3xl bg-white/10 backdrop-blur border border-white/20 p-8 text-center text-white">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <div className="text-lg font-bold text-teal-300 mb-2">Klinisyen Portalı</div>
                <p className="text-sm text-blue-200 mb-4">Hastalarınızın seans takibini yapın, protokol önerin, ilerlemeyi izleyin.</p>
                {isClinician ? (
                  <button onClick={() => navigate('/klinisyen/panel')} className="px-5 py-2 text-sm font-semibold text-white rounded-lg border border-white/40 hover:bg-white/10 transition-all">
                    Panele Git
                  </button>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => navigate('/klinisyen/kayit')} className="px-5 py-2 text-sm font-semibold text-white rounded-lg border border-white/40 hover:bg-white/10 transition-all">
                      Kayıt Ol
                    </button>
                    <button onClick={() => navigate('/giris')} className="px-5 py-2 text-sm font-semibold rounded-lg transition-all" style={{ backgroundColor: '#0d9488', color: 'white' }}>
                      Giriş Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PelvicAir */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Neden PelvicAir'i Önerin?</h2>
            <p className="text-gray-500">Mevcut tedavi seçeneklerinin sınırlılıklarına karşı kanıtlanmış bir alternatif</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {clinicalEvidence.map((e) => (
              <div key={e.title} className="rounded-2xl p-6 bg-gray-50 border border-gray-200">
                <div className="text-2xl font-bold mb-2" style={{ color: '#0d9488' }}>{e.title}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{e.desc}</p>
                <div className="text-xs text-gray-400 italic">{e.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prescribing Steps */}
      <section className="py-16" style={{ backgroundColor: '#f0fdfa' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Reçete / Öneri Süreci</h2>
            <p className="text-gray-500">3 adımda hastanıza PelvicAir'i önerin</p>
          </div>
          <div className="space-y-6">
            {prescribeSteps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start bg-white rounded-2xl p-6 border border-teal-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Modes Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>17 Bilimsel Protokol</h2>
            <p className="text-gray-500">Kadın ve erkek pelvik taban bozuklukları için kapsamlı kapsam</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1e3a5f' }}>♀ Kadın Modları (10)</h3>
              <div className="space-y-2">
                {[
                  'K-01 — İdrar Kaçırma (Üriner İnkontinans)',
                  'K-02 — Aşırı Aktif Mesane (OAB)',
                  'K-03 — Pelvik Organ Sarkması (Prolapsus)',
                  'K-04 — Dismenore (Ağrılı Adet)',
                  'K-05 — Vajinismus',
                  'K-06 — Orgazm Bozukluğu',
                  'K-07 — Cinsel Uyarılma Bozukluğu',
                  'K-08 — Postpartum Cinsel Disfonksiyon',
                  'K-09 — Postpartum Pelvik Hipotonisi',
                  'K-10 — Menopoz Sonrası Hipotonisi',
                ].map((mode) => (
                  <div key={mode} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-teal-500 flex-shrink-0" />
                    {mode}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1e3a5f' }}>♂ Erkek Modları (7)</h3>
              <div className="space-y-2">
                {[
                  'E-01 — İdrar Kaçırma (Üriner İnkontinans)',
                  'E-02 — Aşırı Aktif Mesane',
                  'E-03 — Erektil Disfonksiyon',
                  'E-04 — Erken Boşalma (Prematür Ejakülasyon)',
                  'E-05 — Gecikmiş Boşalma',
                  'E-06 — Prostatik Pelvik Ağrı (CPPS)',
                  'E-07 — Pelvik Taban Hipotonisi',
                ].map((mode) => (
                  <div key={mode} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
                    {mode}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="text-sm font-semibold text-blue-800 mb-1">Prostatektomi Sonrası</div>
                <div className="text-xs text-blue-600">E-01 + E-03 kombine protokolü ile hızlı sfinkter güçlendirme ve ereksiyon rehabilitasyonu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e3a5f' }}>Profesyonel Kaynaklar</h2>
            <p className="text-gray-500">Klinisyenlere özel belgeler ve başvuru formları</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {downloads.map((d) => (
              <div key={d.title} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
                  <Download size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm mb-0.5">{d.title}</div>
                  <div className="text-xs text-gray-500">{d.desc}</div>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg flex-shrink-0">{d.format}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="iletisim" className="py-16" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Klinisyen Desteği</h2>
          <p className="text-blue-300 mb-8">Medikal ekibimiz klinik sorularınızı yanıtlamak için burada.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              İletişime Geç <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:klinisyen@pelvicair.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white rounded-xl border border-white/30 hover:bg-white/10 transition-all"
            >
              klinisyen@pelvicair.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
