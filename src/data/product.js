export const stats = [
  { value: '500M+', label: 'Küresel Hasta', desc: 'Pelvik taban bozukluğu yaşayan birey' },
  { value: '%95', label: 'İyileşme Oranı', desc: 'İdrar kaçırmada 6 haftada iyileşme' },
  { value: '50+', label: 'Klinik Araştırma', desc: 'RCT, meta-analiz ve Cochrane derlemeleri' },
  { value: '17', label: 'Tanı Modu', desc: '10 Kadın + 7 Erkek bilimsel protokol' },
];

export const modalities = [
  {
    icon: '⚡',
    name: 'EMS',
    fullName: 'Elektromüsküler Stimülasyon',
    desc: '2–100 Hz geniş frekans aralığıyla Tip I Tonik ve Tip II Fazik lifleri hedefler. Pasif Kegel etkisi — kullanıcı çaba harcamadan motor sinir ve kas liflerini doğrudan aktive eder.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    icon: '🧲',
    name: 'Elektromanyetik',
    fullName: 'Derin Penetrasyonlu Manyetik Alan',
    desc: 'S2–S4 sakral sinir köklerini uyarır. EMS\'in ulaşamadığı derin pelvik kasları hedefler. Non-invazif, deri ve giysi üzerinden etki eder. Klinik HIFEM\'in ev ortamındaki eşdeğeri.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: '📳',
    name: 'Vibrasyon',
    fullName: 'Proprioseptif Rehabilitasyon',
    desc: 'Mekanoreseptörler ile propriosepsiyon artışı sağlar. Vajinismus kademeli desensitizasyonu ve erken boşalma eşik yükseltme. EMS ve Manyetik\'in nöroplastisite boyutu.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
];

export const femaleModes = [
  { code: 'K-01', icon: '💧', name: 'İdrar Kaçırma', desc: 'Üriner İnkontinans', freq: '35–50 Hz (Stres) | 10 Hz (Urge)', result: '%95 olguda sızıntı azalması (6 hafta RCT)', source: 'Stania M. et al. 2022' },
  { code: 'K-02', icon: '⚡', name: 'Aşırı Aktif Mesane', desc: 'Overactive Bladder (OAB)', freq: '10 Hz (nöromodülasyon)', result: 'Mesane aktivitesinde anlamlı azalma', source: 'Cochrane 2023' },
  { code: 'K-03', icon: '🌸', name: 'Pelvik Organ Sarkması', desc: 'Prolapsus (POP)', freq: '50 Hz güçlendirme + Manyetik', result: '%100 POP-Q evre iyileşmesi (20 seans)', source: 'Xu J. et al. 2023 RCT' },
  { code: 'K-04', icon: '🔻', name: 'Dismenore', desc: 'Ağrılı Adet', freq: '80–100 Hz (akut) | 2–4 Hz (endorfin)', result: '%74 olguda 20 dk içinde ağrı rahatlaması', source: 'Han S. et al. Cochrane 2024' },
  { code: 'K-05', icon: '🛡', name: 'Vajinismus', desc: 'İstem Dışı Vajinal Kas Spazmı', freq: '2–10 Hz + Vibrasyon', result: 'Botulinum toksin ile kıyaslanabilir etkinlik', source: 'Yaraghi M. et al. 2019 RCT' },
  { code: 'K-06', icon: '✨', name: 'Orgazm Bozukluğu', desc: 'Anorgazmi', freq: '80–100 Hz sensitizasyon', result: 'Pelvik kapasite artışı ve orgazmik yanıt', source: 'İlgili RCT verileri' },
  { code: 'K-07', icon: '💫', name: 'Cinsel Uyarılma Bozukluğu', desc: 'Sexual Arousal Disorder', freq: 'Kombine modalite', result: 'Kan akışı ve duysal yanıt artışı', source: 'İlgili klinik veriler' },
  { code: 'K-08', icon: '🤱', name: 'Postpartum Cinsel Disfonksiyon', desc: 'Doğum Sonrası Cinsel İlişkide Zorlanma', freq: '35–50 Hz güçlendirme', result: 'Pelvik taban kas tonusunun restorasyonu', source: 'İlgili RCT verileri' },
  { code: 'K-09', icon: '🔄', name: 'Postpartum Pelvik Hipotonisi', desc: 'Doğum Sonrası Pelvik Kas Zayıflığı', freq: '50–80 Hz faz tabanlı', result: 'Levator ani ve pudendal nöropraksi rehabilitasyonu', source: 'İlgili klinik veriler' },
  { code: 'K-10', icon: '🌿', name: 'Menopoz Sonrası Hipotonisi', desc: 'Pelvik Kas Zayıflığı', freq: '35–50 Hz idame', result: 'Östrojen düşüşüne bağlı pelvik atrofi yönetimi', source: 'İlgili meta-analizler' },
];

export const maleModes = [
  { code: 'E-01', icon: '💧', name: 'İdrar Kaçırma', desc: 'Üriner İnkontinans', freq: '35–50 Hz sfinkter güçlendirme', result: 'Prostatektomi sonrası hızlı iyileşme', source: 'İlgili RCT verileri' },
  { code: 'E-02', icon: '⚡', name: 'Aşırı Aktif Mesane', desc: 'Overactive Bladder', freq: '10 Hz nöromodülasyon', result: 'Mesane kapasitesi artışı', source: 'İlgili klinik veriler' },
  { code: 'E-03', icon: '🔷', name: 'Erektil Disfonksiyon', desc: 'Sertleşme Bozukluğu', freq: '50 Hz (periüretral) + 80 Hz (iskiokavernozus)', result: 'İntrakavernal basınç anlamlı artış; kavernöz sinir yenilenmesi', source: 'Capogrosso P. et al. 2018 RCT' },
  { code: 'E-04', icon: '⏱', name: 'Erken Boşalma', desc: 'Prematür Ejakülasyon', freq: '20 Hz nöromodülasyon + Vibrasyon 80–100 Hz', result: 'IELT istatistiksel olarak anlamlı uzama (50+ hasta)', source: 'Tahmasbi F. et al. 2025' },
  { code: 'E-05', icon: '🔄', name: 'Gecikmiş Boşalma', desc: 'Gecikmiş Ejakülasyon', freq: 'Kombine protokol', result: 'Ejakülasyon eşik normalizasyonu', source: 'İlgili klinik veriler' },
  { code: 'E-06', icon: '🛡', name: 'Prostatik Pelvik Ağrı', desc: 'Kronik Prostatit / CPPS', freq: '10 Hz (ağrı inhibisyonu) → 50 Hz (kas modülasyonu)', result: 'NIH-CPSI 24 haftaya kadar anlamlı düzelme (12 seans)', source: 'Kim TH. et al. Urology 2013' },
  { code: 'E-07', icon: '💪', name: 'Pelvik Taban Hipotonisi', desc: 'Pelvik Taban Kas Zayıflığı', freq: '50–80 Hz faz tabanlı güçlendirme', result: 'Kas kuvveti ve koordinasyon artışı', source: 'İlgili RCT verileri' },
];

export const clinicalResults = [
  { value: '%95', label: 'İdrar Kaçırmada İyileşme', detail: '6 Hafta RCT', source: 'Stania M. et al. 2022' },
  { value: '%100', label: 'Prolapsus POP-Q Evre İyileşmesi', detail: '20 Seans', source: 'Xu J. et al. 2023' },
  { value: '%74', label: 'Dismenore Ağrı Rahatlaması', detail: '20 Dakika İçinde', source: 'Han S. Cochrane 2024' },
  { value: '-%93', label: 'Analjezik Kullanımı Azalması', detail: 'Dismenore Tedavisinde', source: 'Han S. Cochrane 2024' },
];

export const techSpecs = [
  { param: 'EMS Frekans', value: '2–100 Hz (tam programlanabilir)' },
  { param: 'EMS Puls Genişliği', value: '100–500 µs' },
  { param: 'EMS Şiddet', value: '2–22 mA' },
  { param: 'Manyetik Frekans', value: '1–50 Hz' },
  { param: 'Manyetik Şiddet', value: '%25–85 maks tolerans' },
  { param: 'Vibrasyon Frekansı', value: '10–100 Hz' },
];

export const faqItems = [
  {
    category: 'Cihaz Kullanımı',
    questions: [
      { q: 'PelviCare nasıl kullanılır?', a: 'Elektrod pedi iç çamaşırınızın üzerine perineal bölgeye yerleştiriyorsunuz. Mobil uygulama üzerinden hastalık modunuzu seçiyorsunuz ve 20 dakikalık seanslara başlıyorsunuz. Cihaz Bluetooth ile telefonunuza bağlı olarak çalışır.' },
      { q: 'Seans süresi ne kadar?', a: 'Standart seans süresi 20 dakikadır. Günde 1-2 seans önerilir. Tedavi fazına göre (F1: Fortifikasyon, F2: Güçlendirme, F3: İdame) uygulama otomatik ilerler.' },
      { q: 'Cihaz ağrı verir mi?', a: 'Hayır. PelviCare non-invazif tasarımıyla ağrısız çalışır. EMS sırasında hafif titreşim veya kasılma hissedilebilir; bu normaldir ve şiddet mobil uygulama üzerinden ayarlanabilir.' },
      { q: 'Elektrod pad ne kadar dayanır?', a: 'Her elektrod pad 3-5 seans kullanıma uygundur. Hidrojel yüzey kuru kalmadığı sürece iletkenliği korunur. Resealable poşette saklanmalıdır.' },
    ],
  },
  {
    category: 'PelviCare Bana Uygun mu?',
    questions: [
      { q: 'Hangi durumlarda kullanmamalıyım?', a: 'Kalp pili (pacemaker) veya aktif implant kullananlar, hamileler, aktif enfeksiyonu olanlar, ameliyat bölgesinde açık yara olanlar ve epilepsi hastaları cihazı kullanmamalıdır. Ayrıntılı kontrendikasyon listesi için hekiminize danışın.' },
      { q: 'Erkekler de kullanabilir mi?', a: 'Evet. PelviCare hem kadın hem erkek anatomisine özel tasarlanmıştır. Erkeklere özel 7 protokol (E-01 ila E-07) erektil disfonksiyon, erken boşalma, prostatik ağrı ve idrar kaçırma gibi durumları kapsar.' },
      { q: 'Doğum sonrası ne zaman başlayabilirim?', a: 'Normal doğum sonrası genellikle 6-8 hafta, sezaryen sonrası ise 12 hafta beklenmesi önerilir. Başlamadan önce mutlaka doktorunuza danışın.' },
      { q: 'Kaç haftada sonuç alırım?', a: 'İdrar kaçırma için klinik çalışmalar 6 haftada %95 iyileşme bildirmektedir. Dismenore için sonuç 20 dakika içinde hissedilebilir. Bireysel sonuçlar hastalığın şiddetine ve düzenli kullanıma göre değişir.' },
    ],
  },
  {
    category: 'Satın Alma',
    questions: [
      { q: 'Sipariş nasıl verilir?', a: 'Web sitemiz üzerinden online sipariş verebilir veya yetkili satıcılarımızdan temin edebilirsiniz. Klinisyenler için toplu satış ve reçete programları mevcuttur.' },
      { q: 'İade politikası nedir?', a: '60 gün içinde memnun kalmazsanız tam iade garantisi sunuyoruz. Kullanılmış ürünler hijyen nedeniyle iade kabul edilmez; yalnızca elektrode pad dışındaki aksesuarlar iade edilebilir.' },
      { q: 'SGK veya özel sigorta kapsamında mı?', a: 'Henüz SGK kapsamında değildir. Ancak bazı özel sigorta şirketleri tıbbi gereklilik belgesiyle karşılayabilir. Fatura kesilmektedir; SGK geri ödeme başvurusu için hekiminizden reçete alabilirsiniz.' },
    ],
  },
];

export const reviews = [
  { name: 'Ayşe K.', location: 'İstanbul', rating: 5, date: 'Ocak 2026', text: '3 haftada fark ettim! 2 yıldır yaşadığım idrar kaçırma sorunu büyük ölçüde geçti. Giysi altında göründüğü belli olmuyor, rahatça kullanıyorum.', verified: true },
  { name: 'Fatma D.', location: 'Ankara', rating: 5, date: 'Şubat 2026', text: 'Dismenore için kullandım. İlk seansta dahi %50 ağrı azalması hissettim. Artık ağrı kesici almıyorum. Kesinlikle tavsiye ederim.', verified: true },
  { name: 'Zeynep M.', location: 'İzmir', rating: 5, date: 'Mart 2026', text: 'Doğum sonrası 8 ayda başladım. 6 haftada belirgin fark. Pelvik taban kaslarım çok daha güçlü, inkontinans tamamen geçti.', verified: true },
  { name: 'Elif S.', location: 'Bursa', rating: 4, date: 'Nisan 2026', text: 'Vajinismus tedavisi için kullanıyorum. Yavaş ama emin adımlarla ilerliyorum. Mobil uygulama rehberliği çok yardımcı oluyor.', verified: true },
  { name: 'Mehmet A.', location: 'Antalya', rating: 5, date: 'Ocak 2026', text: 'Prostatektomi sonrası başladım. 8 haftada idrar kontrolüm büyük ölçüde geri geldi. Ürologum da sonuçlardan memnun.', verified: true },
  { name: 'Hasan T.', location: 'Konya', rating: 5, date: 'Şubat 2026', text: 'Erektil disfonksiyon için denedim, beklentimin ötesinde sonuç aldım. Evde gizlilikle uygulayabilmek büyük avantaj.', verified: true },
];
