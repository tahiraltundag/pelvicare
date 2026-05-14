require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Admin users
  const adminPass = await bcrypt.hash('Admin123!', 12);
  const superPass = await bcrypt.hash('Super123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@pelvicair.com' },
    update: {},
    create: { email: 'admin@pelvicair.com', password: adminPass, name: 'Admin', role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@pelvicair.com' },
    update: {},
    create: { email: 'superadmin@pelvicair.com', password: superPass, name: 'Süper Admin', role: 'superadmin' },
  });

  console.log('Admin users created.');

  // Categories
  const cats = [
    { name: 'Cihazlar', slug: 'cihazlar' },
    { name: 'Aksesuarlar', slug: 'aksesuarlar' },
    { name: 'Elektrod Padler', slug: 'elektrod-padler' },
  ];

  const createdCats = {};
  for (const cat of cats) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    createdCats[cat.slug] = c;
  }

  console.log('Categories created.');

  // Remove legacy PelviCare-branded products
  await prisma.product.deleteMany({
    where: { slug: { in: ['pelvicare-pro-cihaz', 'pelvicare-baslangic-paketi', 'pelvicare-elektrod-pad'] } },
  });

  // Products
  const products = [
    {
      name: 'PelvicAir Pro Cihaz',
      slug: 'pelvicair-pro-cihaz',
      description: '<p>PelvicAir Pro, pelvik taban rehabilitasyonu için geliştirilmiş 3-modaliteli (EMS + Elektromanyetik + Vibrasyon) ev cihazıdır. 17 bilimsel protokol, mobil uygulama desteği ve 2 yıl garanti.</p>',
      price: 4990,
      comparePrice: 6490,
      categoryId: createdCats['cihazlar'].id,
      tags: JSON.stringify(['EMS', 'Elektromanyetik', 'Vibrasyon', 'Pelvik Taban', 'Rehabilitasyon']),
      images: JSON.stringify([]),
      stock: 50,
      lowStockThreshold: 5,
      variants: JSON.stringify([
        { name: 'Renk', options: ['Beyaz', 'Gri'] }
      ]),
      status: 'aktif',
    },
    {
      name: 'Elektrod Pad (3\'lü Paket)',
      slug: 'elektrod-pad-3-lu-paket',
      description: '<p>PelvicAir cihazı ile uyumlu hidrojel elektrod padler. Her pad 3-5 seans kullanıma uygundur. Resealable poşette saklanır.</p>',
      price: 299,
      comparePrice: 399,
      categoryId: createdCats['elektrod-padler'].id,
      tags: JSON.stringify(['Elektrod', 'Pad', 'Aksesuar', 'Hidrojel']),
      images: JSON.stringify([]),
      stock: 200,
      lowStockThreshold: 20,
      variants: JSON.stringify([]),
      status: 'aktif',
    },
    {
      name: 'PelvicAir Başlangıç Paketi',
      slug: 'pelvicair-baslangic-paketi',
      description: '<p>PelvicAir Pro cihaz + 2 paket elektrod pad + taşıma çantası. Yeni kullanıcılar için en uygun başlangıç seti.</p>',
      price: 5490,
      comparePrice: 7290,
      categoryId: createdCats['cihazlar'].id,
      tags: JSON.stringify(['Paket', 'Başlangıç', 'Cihaz', 'Pad']),
      images: JSON.stringify([]),
      stock: 30,
      lowStockThreshold: 5,
      variants: JSON.stringify([]),
      status: 'aktif',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({ where: { slug: product.slug }, update: {}, create: product });
  }

  console.log('Products created.');

  // CMS content
  const cmsItems = [
    { key: 'hero_title', value: 'Pelvik Taban Terapisi. Müdahalesiz. Kolay.', type: 'text', label: 'Ana Sayfa - Hero Başlık' },
    { key: 'hero_subtitle', value: 'EMS + Elektromanyetik Enerji + Vibrasyon. Üç güç, bir cihaz. 17 hastalık modunda klinik düzey rehabilitasyon artık evinizde.', type: 'text', label: 'Ana Sayfa - Hero Alt Başlık' },
    { key: 'hero_cta', value: 'Fiyatı Gör', type: 'text', label: 'Ana Sayfa - Hero Buton' },
    { key: 'hero_image', value: '', type: 'image', label: 'Ana Sayfa - Hero Görsel' },
    { key: 'about_title', value: 'Hakkımızda', type: 'text', label: 'Hakkımızda - Başlık' },
    { key: 'about_content', value: '<p>Dünya genelinde 500 milyondan fazla insan pelvik taban bozukluğuyla yaşıyor. Bunların %68\'i utanç, bilinçsizlik veya erişim engeli nedeniyle hiç tedavi aramıyor. PelvicAir bu boşluğu kapatmak için kuruldu: Klinik etkinliği, ev erişilebilirliği ve hem kadın hem erkek kapsamıyla birleştiren, giyilebilir, non-invazif bir platform.</p>', type: 'html', label: 'Hakkımızda - İçerik' },
    { key: 'footer_address', value: 'Teknokent Binası, Blok A No:12 Ankara / Türkiye', type: 'text', label: 'Footer - Adres' },
    { key: 'footer_phone', value: '0850 123 45 67', type: 'text', label: 'Footer - Telefon' },
    { key: 'footer_email', value: 'info@pelvicair.com', type: 'text', label: 'Footer - E-posta' },
    { key: 'contact_title', value: 'İletişim', type: 'text', label: 'İletişim - Başlık' },
    { key: 'contact_subtitle', value: 'Size nasıl yardımcı olabileceğimizi öğrenmek isteriz.', type: 'text', label: 'İletişim - Alt Başlık' },
    { key: 'announcement_bar', value: '', type: 'text', label: 'Duyuru Çubuğu' },
    { key: 'logo_url', value: '', type: 'image', label: 'Logo Görseli' },
    { key: 'clinician_title', value: 'Hastanız İçin Yeni Bir Seçenek', type: 'text', label: 'Klinisyenler - Başlık' },
    { key: 'clinician_subtitle', value: 'PelvicAir, klinik fizyoterapiye ek veya monoterapi olarak reçete edebileceğiniz, CE belgeli, klinik kanıtlı non-invazif bir cihaz.', type: 'text', label: 'Klinisyenler - Alt Başlık' },
    { key: 'clinician_content', value: '<p>PelvicAir, klinik ortamlarda kullanım için özel toplu satış ve reçete programları sunmaktadır. Hastalarınıza en iyi bakımı sağlamak için bizimle iletişime geçin.</p>', type: 'html', label: 'Klinisyenler - İçerik' },
    { key: 'product_hero_badge', value: 'CE Belgeli · Tıbbi Sınıf', type: 'text', label: 'Ürün - CE Rozeti' },
    { key: 'product_hero_title', value: 'PelvicAir', type: 'text', label: 'Ürün - Başlık' },
    { key: 'product_hero_subtitle', value: 'Akıllı Hibrit Pelvik Taban Rehabilitasyon Sistemi', type: 'text', label: 'Ürün - Alt Başlık' },
    { key: 'product_hero_tagline', value: '"Üç güç. Bir cihaz. Sonsuz özgürlük."', type: 'text', label: 'Ürün - Slogan' },
    { key: 'product_packages', type: 'json', label: 'Ürün - Paketler', value: JSON.stringify([
      { id: 'pkg-starter', name: 'Başlangıç Paketi', icon: '🩺', variant: 'PelvicAir Cihazı + 2 Pad', price: 4990, displayPrice: '₺4.990', oldPrice: null, badge: null, features: ['PelvicAir Ana Cihaz', '2 Adet Elektrod Pad (10 seans)', 'Mobil Uygulama Erişimi', 'Türkçe Kullanım Kılavuzu', '1 Yıl Garanti'], cta: 'Sepete Ekle', highlighted: false },
      { id: 'pkg-premium', name: 'Premium Paket', icon: '⭐', variant: 'PelvicAir Cihazı + 4 Pad + Şarj', price: 6490, displayPrice: '₺6.490', oldPrice: '₺7.990', badge: 'En Popüler', features: ['PelvicAir Ana Cihaz', '4 Adet Elektrod Pad (20 seans)', 'Mobil Uygulama Erişimi (Premium)', 'Türkçe Kullanım Kılavuzu', '2 Yıl Garanti', 'Öncelikli Destek', 'Şarj Ünitesi'], cta: 'Sepete Ekle', highlighted: true },
      { id: 'pkg-pro', name: 'Profesyonel Paket', icon: '🏥', variant: 'Klinisyen — 2 Cihaz + 10 Pad', price: 8990, displayPrice: '₺8.990', oldPrice: null, badge: 'Klinisyen İçin', features: ['PelvicAir Ana Cihaz (x2)', '10 Adet Elektrod Pad (50 seans)', 'Klinisyen Yönetim Paneli', 'Hasta Takip Sistemi', 'Teknik Destek Hattı', '3 Yıl Garanti', 'Eğitim Materyalleri'], cta: 'Bilgi Al', highlighted: false },
    ]) },
    // SSS
    { key: 'faq_hero_title', value: 'Sık Sorulan Sorular', type: 'text', label: 'SSS - Başlık' },
    { key: 'faq_hero_subtitle', value: 'PelvicAir hakkında merak ettiklerinizin yanıtları', type: 'text', label: 'SSS - Alt Başlık' },
    { key: 'faq_categories', type: 'json', label: 'SSS - Kategoriler', value: JSON.stringify([
      { category: 'Cihaz Kullanımı', questions: [
        { q: 'PelvicAir nasıl kullanılır?', a: 'Elektrod pedi iç çamaşırınızın üzerine perineal bölgeye yerleştiriyorsunuz. Mobil uygulama üzerinden hastalık modunuzu seçiyorsunuz ve 20 dakikalık seanslara başlıyorsunuz. Cihaz Bluetooth ile telefonunuza bağlı olarak çalışır.' },
        { q: 'Seans süresi ne kadar?', a: 'Standart seans süresi 20 dakikadır. Günde 1-2 seans önerilir. Tedavi fazına göre (F1: Fortifikasyon, F2: Güçlendirme, F3: İdame) uygulama otomatik ilerler.' },
        { q: 'Cihaz ağrı verir mi?', a: 'Hayır. PelvicAir non-invazif tasarımıyla ağrısız çalışır. EMS sırasında hafif titreşim veya kasılma hissedilebilir; bu normaldir ve şiddet mobil uygulama üzerinden ayarlanabilir.' },
        { q: 'Elektrod pad ne kadar dayanır?', a: 'Her elektrod pad 3-5 seans kullanıma uygundur. Hidrojel yüzey kuru kalmadığı sürece iletkenliği korunur. Resealable poşette saklanmalıdır.' },
      ]},
      { category: 'PelvicAir Bana Uygun mu?', questions: [
        { q: 'Hangi durumlarda kullanmamalıyım?', a: 'Kalp pili (pacemaker) veya aktif implant kullananlar, hamileler, aktif enfeksiyonu olanlar, ameliyat bölgesinde açık yara olanlar ve epilepsi hastaları cihazı kullanmamalıdır.' },
        { q: 'Erkekler de kullanabilir mi?', a: 'Evet. PelvicAir hem kadın hem erkek anatomisine özel tasarlanmıştır. Erkeklere özel 7 protokol (E-01 ila E-07) erektil disfonksiyon, erken boşalma, prostatik ağrı ve idrar kaçırma gibi durumları kapsar.' },
        { q: 'Doğum sonrası ne zaman başlayabilirim?', a: 'Normal doğum sonrası genellikle 6-8 hafta, sezaryen sonrası ise 12 hafta beklenmesi önerilir. Başlamadan önce mutlaka doktorunuza danışın.' },
        { q: 'Kaç haftada sonuç alırım?', a: 'İdrar kaçırma için klinik çalışmalar 6 haftada %95 iyileşme bildirmektedir. Dismenore için sonuç 20 dakika içinde hissedilebilir. Bireysel sonuçlar hastalığın şiddetine ve düzenli kullanıma göre değişir.' },
      ]},
      { category: 'Satın Alma', questions: [
        { q: 'Sipariş nasıl verilir?', a: 'Web sitemiz üzerinden online sipariş verebilir veya yetkili satıcılarımızdan temin edebilirsiniz. Klinisyenler için toplu satış ve reçete programları mevcuttur.' },
        { q: 'İade politikası nedir?', a: '60 gün içinde memnun kalmazsanız tam iade garantisi sunuyoruz. Kullanılmış ürünler hijyen nedeniyle iade kabul edilmez; yalnızca elektrod pad dışındaki aksesuarlar iade edilebilir.' },
        { q: 'SGK veya özel sigorta kapsamında mı?', a: 'Henüz SGK kapsamında değildir. Ancak bazı özel sigorta şirketleri tıbbi gereklilik belgesiyle karşılayabilir. Fatura kesilmektedir.' },
      ]},
      { category: 'Teknik Sorular', questions: [
        { q: 'Uygulama hangi işletim sistemleriyle uyumlu?', a: 'PelvicAir uygulaması iOS 14+ ve Android 8.0+ ile tam uyumludur. App Store ve Google Play\'den ücretsiz indirilebilir.' },
        { q: 'Cihazın pil ömrü ne kadar?', a: 'Tam şarjda 5–7 seans (yaklaşık 100–140 dakika) kullanım sağlar. USB-C ile şarj edilir ve 90 dakikada tam şarj olur.' },
        { q: 'Cihazı temizlemek için ne kullanmalıyım?', a: 'Nemli bez ile silin. Sıvı solventler, alkol veya su ile temizlemeyin. Elektrod pad bağlantı noktalarına nem girmesinden kaçının.' },
        { q: 'Bluetooth menzili ne kadar?', a: 'Bluetooth 5.0 ile 10 metreye kadar kararlı bağlantı sağlar. Seans sırasında telefonunuzun yakında olması önerilir.' },
      ]},
    ]) },
    // Nasıl Çalışır
    { key: 'how_hero_title', value: 'Nasıl Çalışır?', type: 'text', label: 'Nasıl Çalışır - Başlık' },
    { key: 'how_hero_subtitle', value: 'PelvicAir, üç tedavi modalitesini tek bir giyilebilir cihazda birleştirerek klinik düzey pelvik taban rehabilitasyonunu evinize taşır.', type: 'text', label: 'Nasıl Çalışır - Alt Başlık' },
    { key: 'how_phases', type: 'json', label: 'Nasıl Çalışır - Tedavi Fazları', value: JSON.stringify([
      { code: 'F1', name: 'Fortifikasyon', duration: '1–2 Hafta', desc: 'Düşük yoğunlukta kas aktivasyonu ve nöromusküler bağlantı kurma. Vücut cihaza adapte olur.' },
      { code: 'F2', name: 'Güçlendirme', duration: '3–6 Hafta', desc: 'Artan şiddet ve frekansla klinik etkinlik bölgesine geçiş. Kas kuvveti ve dayanıklılık artar.' },
      { code: 'F3', name: 'İdame', duration: 'Sürekli', desc: 'Kazanılan terapötik kazanımları koruma. Haftada 3 seans ile uzun vadeli sağlık sürdürülür.' },
    ]) },
    { key: 'how_app_features', type: 'json', label: 'Nasıl Çalışır - Uygulama Özellikleri', value: JSON.stringify([
      { icon: 'Activity', title: 'Hazır Modlar', desc: '17 tanıya tek dokunuşla başlatma. Kadın / Erkek profil seçimi. Mod açıklaması ve bilgi ekranı.' },
      { icon: 'Zap', title: 'Manuel Kontrol', desc: 'EMS, Manyetik, Vibrasyon ayrı ayrı ayarlama. Frekans, şiddet, süre, duty cycle kontrolü.' },
      { icon: 'Waves', title: 'Takip & Rehberlik', desc: 'Faz bazlı otomatik ilerleme F1→F2→F3. Seans geçmişi ve ilerleme grafiği. Hatırlatıcı desteği.' },
      { icon: 'Smartphone', title: 'Bluetooth Bağlantı', desc: 'iOS ve Android uyumlu. Firmware güncelleme desteği. Cihaz durumu anlık izleme.' },
    ]) },
    // Kadın Sağlığı
    { key: 'women_hero_title', value: 'Kadın Pelvik Sağlığı', type: 'text', label: 'Kadın - Başlık' },
    { key: 'women_hero_subtitle', value: '10 bilimsel protokol. İdrar kaçırmadan vajinismusa, dismenorenin anından menopoza kapsamlı kadın pelvik rehabilitasyonu.', type: 'text', label: 'Kadın - Alt Başlık' },
    { key: 'women_profiles', type: 'json', label: 'Kadın - Hedef Profiller', value: JSON.stringify([
      { icon: '🤱', title: 'Yeni Anne', modes: 'K-08 · K-09', desc: 'Doğum sonrası pelvik rehabilitasyon; levator ani hasarı ve pudendal nöropraksi.' },
      { icon: '🌿', title: 'Menopoz Dönemi', modes: 'K-01 · K-10', desc: 'Östrojen düşüşüyle artan inkontinans, pelvik atrofi ve cinsel isteksizlik.' },
      { icon: '🛡', title: 'Vajinismus / Ağrı', modes: 'K-05', desc: 'Kademeli kas spazmı çözme ve desensitizasyon protokolü.' },
      { icon: '✨', title: 'Orgazm Güçlüğü', modes: 'K-06 · K-07', desc: 'Pelvik kapasite artışı ve sensitizasyon restorasyonu.' },
    ]) },
    // Erkek Sağlığı
    { key: 'men_hero_title', value: 'Erkek Pelvik Sağlığı', type: 'text', label: 'Erkek - Başlık' },
    { key: 'men_hero_subtitle', value: '7 bilimsel protokol. Erektil disfonksiyondan prostatik ağrıya, erken boşalmadan idrar kaçırmaya kapsamlı erkek pelvik rehabilitasyonu.', type: 'text', label: 'Erkek - Alt Başlık' },
    { key: 'men_profiles', type: 'json', label: 'Erkek - Hedef Profiller', value: JSON.stringify([
      { icon: '🔷', title: 'Erektil Disfonksiyon', modes: 'E-03', desc: 'İskiokavernozus güçlendirme ve intrakavernal basınç artışı.' },
      { icon: '⏱', title: 'Erken Boşalma', modes: 'E-04', desc: 'Nöromodülasyon ile IELT uzatma ve ejakülasyon eşik yükseltme.' },
      { icon: '💧', title: 'İdrar Kaçırma', modes: 'E-01', desc: 'Prostatektomi sonrası sfinkter güçlendirme ve erken iyileşme.' },
      { icon: '🛡', title: 'Prostatik Ağrı', modes: 'E-06', desc: 'Kombine protokol ile ağrı inhibisyonu ve miyofasyal gevşeme.' },
    ]) },
    // Bilim
    { key: 'science_hero_title', value: 'Bilimsel Kanıtlar', type: 'text', label: 'Bilim - Başlık' },
    { key: 'science_hero_subtitle', value: 'PelvicAir\'in etkinliği 50\'den fazla randomize kontrollü klinik çalışma ile desteklenmektedir.', type: 'text', label: 'Bilim - Alt Başlık' },
    { key: 'science_studies', type: 'json', label: 'Bilim - Klinik Çalışmalar', value: JSON.stringify([
      { modalite: 'EMS · K-01', endikasyon: 'İdrar Kaçırma', sonuc: '%95 sızıntı azalması', kaynak: 'Stania M. et al. 2022 RCT', tag: 'RCT' },
      { modalite: 'Manyetik · K-03', endikasyon: 'Prolapsus', sonuc: '%100 POP-Q evre iyileşmesi (20 seans)', kaynak: 'Xu J. et al. 2023 RCT', tag: 'RCT' },
      { modalite: 'EMS · K-04', endikasyon: 'Dismenore', sonuc: '-%93 analjezik; %74 rahatlama', kaynak: 'Han S. Cochrane 2024 (20 RCT)', tag: 'Cochrane' },
      { modalite: 'EMS · E-03', endikasyon: 'Erektil Disfonksiyon', sonuc: 'İntrakavernal basınç artışı (RCT)', kaynak: 'Capogrosso et al. 2018', tag: 'RCT' },
      { modalite: 'Manyetik · E-06', endikasyon: 'Prostatik Ağrı', sonuc: '24 hafta NIH-CPSI iyileşmesi', kaynak: 'Kim TH. et al. 2013', tag: 'Klinik' },
      { modalite: 'EMS · K-05', endikasyon: 'Vajinismus', sonuc: 'Botulinum toksin ile kıyaslanabilir etkinlik', kaynak: 'Yaraghi M. et al. 2019 RCT', tag: 'RCT' },
      { modalite: 'EMS · E-04', endikasyon: 'Erken Boşalma', sonuc: 'IELT anlamlı uzama (50+ hasta)', kaynak: 'Tahmasbi F. et al. 2025', tag: 'Meta-Analiz' },
    ]) },
    { key: 'science_differentiators', type: 'json', label: 'Bilim - Farklılaştırıcılar', value: JSON.stringify([
      { title: 'Non-invazif Perineal Yerleşim', desc: 'Vücut dışında, iç çamaşırı gibi kullanım. Vajinal veya rektal prob gerektirmez. Biyouyumlu hidrojel elektrodu ile deri üzerinden etkili stimülasyon.' },
      { title: 'Üç Bölgeli Hidrojel Yapısı', desc: 'Dört ayrı hidrojel bölgesi, anatomik alanlara optimum enerji iletimi sağlar. Her bölge farklı modalite için optimize edilmiştir.' },
      { title: 'Pre-Modüle Dalga Formu', desc: 'Sinir ve kas liflerine özel pre-modüle edilmiş dalga formları ile hem Tip I (tonik) hem Tip II (fazik) lifleri etkili biçimde aktive eder.' },
      { title: 'Sinerjik Modalite Kombinasyonu', desc: 'EMS + Elektromanyetik + Vibrasyon aynı anda veya sırayla uygulanabilir. Kombinasyon tedavisi tek modaliteye kıyasla %66 daha iyi etkinlik gösterir.' },
    ]) },
    // Yorumlar
    { key: 'reviews_hero_title', value: 'Kullanıcı Yorumları', type: 'text', label: 'Yorumlar - Başlık' },
    { key: 'reviews_items', type: 'json', label: 'Yorumlar - Liste', value: JSON.stringify([
      { name: 'Ayşe K.', location: 'İstanbul', rating: 5, date: 'Ocak 2026', text: '3 haftada fark ettim! 2 yıldır yaşadığım idrar kaçırma sorunu büyük ölçüde geçti. Giysi altında göründüğü belli olmuyor, rahatça kullanıyorum.', verified: true },
      { name: 'Fatma D.', location: 'Ankara', rating: 5, date: 'Şubat 2026', text: 'Dismenore için kullandım. İlk seansta dahi %50 ağrı azalması hissettim. Artık ağrı kesici almıyorum. Kesinlikle tavsiye ederim.', verified: true },
      { name: 'Zeynep M.', location: 'İzmir', rating: 5, date: 'Mart 2026', text: 'Doğum sonrası 8 ayda başladım. 6 haftada belirgin fark. Pelvik taban kaslarım çok daha güçlü, inkontinans tamamen geçti.', verified: true },
      { name: 'Elif S.', location: 'Bursa', rating: 4, date: 'Nisan 2026', text: 'Vajinismus tedavisi için kullanıyorum. Yavaş ama emin adımlarla ilerliyorum. Mobil uygulama rehberliği çok yardımcı oluyor.', verified: true },
      { name: 'Mehmet A.', location: 'Antalya', rating: 5, date: 'Ocak 2026', text: 'Prostatektomi sonrası başladım. 8 haftada idrar kontrolüm büyük ölçüde geri geldi. Ürologum da sonuçlardan memnun.', verified: true },
      { name: 'Hasan T.', location: 'Konya', rating: 5, date: 'Şubat 2026', text: 'Erektil disfonksiyon için denedim, beklentimin ötesinde sonuç aldım. Evde gizlilikle uygulayabilmek büyük avantaj.', verified: true },
      { name: 'Selin A.', location: 'Eskişehir', rating: 5, date: 'Mart 2026', text: 'Aşırı aktif mesane için kullandım. 4 haftada gece kalkmalarım ikiden bire düştü. Mobil uygulama takibi çok motivasyonumu artırdı.', verified: true },
      { name: 'Gül Y.', location: 'Adana', rating: 5, date: 'Şubat 2026', text: 'Postpartum rehabilitasyon için mükemmel. Fizyoterapiste her hafta gitmek yerine evde yapabilmek büyük avantaj. 6 haftada belirgin iyileşme.', verified: true },
      { name: 'Ahmet K.', location: 'Gaziantep', rating: 4, date: 'Ocak 2026', text: 'Erken boşalma için 8 hafta kullandım. Sonuçlar tatmin edici. Gizlilikle evde kullanabilmek psikolojik baskıyı da azalttı.', verified: true },
      { name: 'Meral T.', location: 'Samsun', rating: 5, date: 'Nisan 2026', text: 'Dismenore için kullanıyorum. Artık her adet döneminde ağrı kesici almak zorunda kalmıyorum. Gerçekten işe yarıyor.', verified: true },
      { name: 'Leyla B.', location: 'Trabzon', rating: 5, date: 'Ocak 2026', text: 'Menopoz sonrası inkontinans için başladım. 3 haftada fark ettim. Artık dışarı çıkarken endişelenmiyorum.', verified: true },
      { name: 'Osman S.', location: 'Diyarbakır', rating: 5, date: 'Şubat 2026', text: 'Prostatektomi sonrası 6. haftada başladım. 3 ay sonra pad kullanmıyorum. Ürolog da sonuçlardan çok memnun.', verified: true },
    ]) },
    // Kaynaklar
    { key: 'resources_hero_title', value: 'Kaynaklar', type: 'text', label: 'Kaynaklar - Başlık' },
    { key: 'resources_downloads', type: 'json', label: 'Kaynaklar - İndirilebilir Belgeler', value: JSON.stringify([
      { icon: '📄', title: 'Doktorunuz İçin Bilgi', desc: 'Hekim ziyaretinizde kullanabileceğiniz ürün tanıtım ve reçete talep formu', format: 'PDF' },
      { icon: '📋', title: 'Ürün Broşürü (TR)', desc: 'Türkçe tam ürün tanıtım broşürü — özellikler, protokoller ve fiyatlar', format: 'PDF' },
      { icon: '📊', title: 'Günlük Seans Takip Formu', desc: 'İlerlemenizi kağıt üzerinde takip etmek için yazdırılabilir form', format: 'PDF' },
      { icon: '🏥', title: 'SGK / Özel Sigorta Mektubu', desc: 'Geri ödeme başvurusu için tıbbi gereklilik belgesi taslağı', format: 'PDF' },
    ]) },
    { key: 'resources_articles', type: 'json', label: 'Kaynaklar - Makaleler', value: JSON.stringify([
      { category: 'İdrar Kaçırma & Stres İnkontinans', items: [
        { title: 'Stres İnkontinansı Nedir ve Nasıl Tedavi Edilir?', date: 'Ocak 2026', desc: 'Öksürme, hapşırma ve koşma sırasında idrar kaçırmanın nedenleri ve modern tedavi seçenekleri.' },
        { title: 'EMS vs. Kegel: Hangisi Daha Etkili?', date: 'Şubat 2026', desc: 'Elektromusküler stimülasyon ile geleneksel Kegel egzersizinin karşılaştırmalı klinik analizi.' },
        { title: 'Pelvik Taban Neden Zayıflar?', date: 'Mart 2026', desc: 'Doğum, menopoz, obezite ve sedanter yaşam tarzının pelvik taban üzerine etkileri.' },
      ]},
      { category: 'OAB, Sıkışma & Noktüri', items: [
        { title: 'Aşırı Aktif Mesane (OAB) Nedir?', date: 'Ocak 2026', desc: 'Ani sıkışma hissi ve sık idrara çıkma sorununu anlamak ve yönetmek.' },
        { title: 'Noktüri: Gece İdrara Kalkmanın Çözümü', date: 'Şubat 2026', desc: 'Gece idrara kalkmanın altında yatan nedenler ve non-farmakolojik yaklaşımlar.' },
        { title: 'OAB İlaç Tedavisinin Alternatifleri', date: 'Mart 2026', desc: 'Antikolinerjik ilaçların yan etkileri ve elektrostimülasyon ile nöromodülasyon alternatifleri.' },
      ]},
      { category: 'Diğer Pelvik Taban Bozuklukları', items: [
        { title: 'Vajinismus: Tanı, Neden ve Tedavi', date: 'Şubat 2026', desc: 'İstem dışı vajinal kas spazmının güncel tedavi protokolleri ve EMS\'in rolü.' },
        { title: 'Pelvik Organ Sarkması (Prolapsus)', date: 'Ocak 2026', desc: 'Prolapsusun evreleri ve konservatif tedavi seçenekleri.' },
        { title: 'Erkekte Pelvik Taban Sağlığı', date: 'Mart 2026', desc: 'Erkek pelvik taban bozukluklarının göz ardı edilen boyutu ve modern rehabilitasyon.' },
      ]},
      { category: 'Dismenore & Ağrı', items: [
        { title: 'Dismenore İçin EMS: 20 Dakikada Ağrı Rahatlaması', date: 'Ocak 2026', desc: 'Cochrane 2024 meta-analizi ışığında EMS\'in dismenore tedavisindeki etkinliği.' },
        { title: 'Kronik Pelvik Ağrı Yönetimi', date: 'Şubat 2026', desc: 'Kronik pelvik ağrının multidisipliner yaklaşımı ve elektrostimülasyonun yeri.' },
      ]},
    ]) },
    // Ana Sayfa - dinamik içerikler
    { key: 'home_stats', type: 'json', label: 'Ana Sayfa - İstatistikler', value: JSON.stringify([
      { value: '500M+', label: 'Küresel Hasta', desc: 'Pelvik taban bozukluğu yaşayan birey' },
      { value: '%95', label: 'İyileşme Oranı', desc: 'İdrar kaçırmada 6 haftada iyileşme' },
      { value: '50+', label: 'Klinik Araştırma', desc: 'RCT, meta-analiz ve Cochrane derlemeleri' },
      { value: '17', label: 'Tanı Modu', desc: '10 Kadın + 7 Erkek bilimsel protokol' },
    ]) },
    { key: 'home_modalities', type: 'json', label: 'Ana Sayfa - Tedavi Modaliteleri', value: JSON.stringify([
      { icon: '⚡', name: 'EMS', fullName: 'Elektromüsküler Stimülasyon', desc: '2–100 Hz geniş frekans aralığıyla Tip I Tonik ve Tip II Fazik lifleri hedefler. Pasif Kegel etkisi — kullanıcı çaba harcamadan motor sinir ve kas liflerini doğrudan aktive eder.', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
      { icon: '🧲', name: 'Elektromanyetik', fullName: 'Derin Penetrasyonlu Manyetik Alan', desc: 'S2–S4 sakral sinir köklerini uyarır. EMS\'in ulaşamadığı derin pelvik kasları hedefler. Non-invazif, deri ve giysi üzerinden etki eder. Klinik HIFEM\'in ev ortamındaki eşdeğeri.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
      { icon: '📳', name: 'Vibrasyon', fullName: 'Proprioseptif Rehabilitasyon', desc: 'Mekanoreseptörler ile propriosepsiyon artışı sağlar. Vajinismus kademeli desensitizasyonu ve erken boşalma eşik yükseltme. EMS ve Manyetik\'in nöroplastisite boyutu.', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    ]) },
    { key: 'home_clinical_results', type: 'json', label: 'Ana Sayfa - Klinik Sonuçlar', value: JSON.stringify([
      { value: '%95', label: 'İdrar Kaçırmada İyileşme', detail: '6 Hafta RCT', source: 'Stania M. et al. 2022' },
      { value: '%100', label: 'Prolapsus POP-Q Evre İyileşmesi', detail: '20 Seans', source: 'Xu J. et al. 2023' },
      { value: '%74', label: 'Dismenore Ağrı Rahatlaması', detail: '20 Dakika İçinde', source: 'Han S. Cochrane 2024' },
      { value: '-%93', label: 'Analjezik Kullanımı Azalması', detail: 'Dismenore Tedavisinde', source: 'Han S. Cochrane 2024' },
    ]) },
    { key: 'home_steps', type: 'json', label: 'Ana Sayfa - 4 Adım', value: JSON.stringify([
      { step: '01', title: 'Elektrod Pedi Takın', desc: 'İç çamaşırı konforu ile perineal bölgeye yerleştirin. Prob yok, girişim yok.' },
      { step: '02', title: 'Modu Seçin', desc: 'Mobil uygulamadan 17 hastalık modundan birini seçin. Kadın ve erkek profilleri ayrı.' },
      { step: '03', title: 'Seanı Başlatın', desc: '20 dakikalık bilimsel protokol otomatik çalışır. Günlük hayatınıza devam edin.' },
      { step: '04', title: 'İlerlemenizi Takip Edin', desc: 'Uygulama seans geçmişinizi ve iyileşme grafiğinizi gösterir. F1→F2→F3 faz ilerlemesi.' },
    ]) },
    { key: 'home_comparison', type: 'json', label: 'Ana Sayfa - Karşılaştırma Tablosu', value: JSON.stringify([
      { feature: 'Non-invazif', pelvicair: true, internal: false, surgery: false, pt: true, pads: true },
      { feature: 'Evde kullanım', pelvicair: true, internal: true, surgery: false, pt: false, pads: true },
      { feature: 'Erkek & kadın', pelvicair: true, internal: false, surgery: true, pt: true, pads: true },
      { feature: 'Klinik etkinlik', pelvicair: true, internal: true, surgery: true, pt: true, pads: false },
      { feature: 'Mobil kontrol', pelvicair: true, internal: false, surgery: false, pt: false, pads: false },
      { feature: '3 modalite', pelvicair: true, internal: false, surgery: false, pt: false, pads: false },
      { feature: 'Uygun maliyet', pelvicair: true, internal: false, surgery: false, pt: false, pads: true },
    ]) },
    { key: 'home_trust_badges', type: 'json', label: 'Ana Sayfa - Güven Rozetleri', value: JSON.stringify([
      { icon: 'Shield', label: 'CE Belgeli', sub: 'Tıbbi Cihaz' },
      { icon: 'Activity', label: '50+ Klinik Araştırma', sub: 'RCT Destekli' },
      { icon: 'Star', label: '4.8/5 Puan', sub: '500+ Değerlendirme' },
      { icon: 'CheckCircle', label: '60 Gün', sub: 'Para İade Garantisi' },
    ]) },
    // Tedavi modları
    { key: 'female_modes', type: 'json', label: 'Kadın - Tedavi Modları', value: JSON.stringify([
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
    ]) },
    { key: 'male_modes', type: 'json', label: 'Erkek - Tedavi Modları', value: JSON.stringify([
      { code: 'E-01', icon: '💧', name: 'İdrar Kaçırma', desc: 'Üriner İnkontinans', freq: '35–50 Hz sfinkter güçlendirme', result: 'Prostatektomi sonrası hızlı iyileşme', source: 'İlgili RCT verileri' },
      { code: 'E-02', icon: '⚡', name: 'Aşırı Aktif Mesane', desc: 'Overactive Bladder', freq: '10 Hz nöromodülasyon', result: 'Mesane kapasitesi artışı', source: 'İlgili klinik veriler' },
      { code: 'E-03', icon: '🔷', name: 'Erektil Disfonksiyon', desc: 'Sertleşme Bozukluğu', freq: '50 Hz (periüretral) + 80 Hz (iskiokavernozus)', result: 'İntrakavernal basınç anlamlı artış; kavernöz sinir yenilenmesi', source: 'Capogrosso P. et al. 2018 RCT' },
      { code: 'E-04', icon: '⏱', name: 'Erken Boşalma', desc: 'Prematür Ejakülasyon', freq: '20 Hz nöromodülasyon + Vibrasyon 80–100 Hz', result: 'IELT istatistiksel olarak anlamlı uzama (50+ hasta)', source: 'Tahmasbi F. et al. 2025' },
      { code: 'E-05', icon: '🔄', name: 'Gecikmiş Boşalma', desc: 'Gecikmiş Ejakülasyon', freq: 'Kombine protokol', result: 'Ejakülasyon eşik normalizasyonu', source: 'İlgili klinik veriler' },
      { code: 'E-06', icon: '🛡', name: 'Prostatik Pelvik Ağrı', desc: 'Kronik Prostatit / CPPS', freq: '10 Hz (ağrı inhibisyonu) → 50 Hz (kas modülasyonu)', result: 'NIH-CPSI 24 haftaya kadar anlamlı düzelme (12 seans)', source: 'Kim TH. et al. Urology 2013' },
      { code: 'E-07', icon: '💪', name: 'Pelvik Taban Hipotonisi', desc: 'Pelvik Taban Kas Zayıflığı', freq: '50–80 Hz faz tabanlı güçlendirme', result: 'Kas kuvveti ve koordinasyon artışı', source: 'İlgili RCT verileri' },
    ]) },
    { key: 'tech_specs', type: 'json', label: 'Teknik Parametreler', value: JSON.stringify([
      { param: 'EMS Frekans', value: '2–100 Hz (tam programlanabilir)' },
      { param: 'EMS Puls Genişliği', value: '100–500 µs' },
      { param: 'EMS Şiddet', value: '2–22 mA' },
      { param: 'Manyetik Frekans', value: '1–50 Hz' },
      { param: 'Manyetik Şiddet', value: '%25–85 maks tolerans' },
      { param: 'Vibrasyon Frekansı', value: '10–100 Hz' },
    ]) },
    // Nasıl Çalışır - kullanım adımları ve kontrendikasyonlar
    { key: 'how_steps', type: 'json', label: 'Nasıl Çalışır - Kullanım Adımları', value: JSON.stringify([
      { num: '01', title: 'Elektrod Pedi Hazırlayın', desc: 'Resealable poşetten çıkarın. Hidrojel yüzeyinin nemliliğini kontrol edin. Her pad 3–5 seans kullanıma uygundur.' },
      { num: '02', title: 'Pedi Yerleştirin', desc: 'İç çamaşırı konforu ile perineal bölgeye yerleştirin. Prob yok, girişim yok. Giysi altında tamamen görünmez.' },
      { num: '03', title: 'Uygulamayı Açın', desc: 'Bluetooth ile cihaza bağlanın. Kadın veya erkek profilinizi seçin. Hastalık modunuzu belirleyin ve seanı başlatın.' },
      { num: '04', title: 'Seanı Tamamlayın', desc: '20 dakikalık protokol otomatik çalışır. Günlük aktivitelerinize devam edebilirsiniz. Uygulama ilerlemenizi kaydeder.' },
    ]) },
    { key: 'how_contraindications', type: 'json', label: 'Nasıl Çalışır - Kontrendikasyonlar', value: JSON.stringify([
      'Kalp pili (pacemaker) veya aktif implant',
      'Gebelik',
      'Aktif enfeksiyon veya açık yara',
      'Epilepsi',
      'Deri bütünlüğü bozuk bölge',
      'İmplante edilmiş metalik cihaz (pelvik bölge)',
      'Aktif kanser tedavisi',
      'Kalp ritim bozukluğu',
    ]) },
    // Hakkımızda
    { key: 'about_values', type: 'json', label: 'Hakkımızda - Temel Değerler', value: JSON.stringify([
      { icon: '❤️', title: 'Empati', desc: 'Pelvik sağlık sorunları utanç değil, tıbbi bir gerçekliktir. Her hasta saygı ve anlayışla karşılanır.' },
      { icon: '🔬', title: 'İnovasyon', desc: 'Klinik etkinliği ev erişilebilirliğiyle birleştiren teknolojiyi geliştiriyoruz. Durmaksızın.' },
      { icon: '🛡', title: 'Güven', desc: 'CE belgeli, klinik kanıtlı, şeffaf. Müşterilerimiz her adımda bilgilendirilir.' },
      { icon: '🌿', title: 'Özgürlük', desc: 'Pelvik sağlık sorunu yaşayan her birey, utanmadan, konforla iyileşme hakkına sahiptir.' },
    ]) },
    { key: 'about_certifications', type: 'json', label: 'Hakkımızda - Sertifikalar', value: JSON.stringify([
      { title: 'CE Belgesi', detail: 'MDR 2017/745 uyumlu tıbbi cihaz' },
      { title: 'ISO 13485:2016', detail: 'Tıbbi cihaz kalite yönetim sistemi' },
      { title: 'ISO 10993', detail: 'Biyouyumluluk test sertifikası' },
      { title: '5 Patent', detail: 'Türk Patent Enstitüsü tescilli' },
    ]) },
    { key: 'about_team', type: 'json', label: 'Hakkımızda - Ekip', value: JSON.stringify([
      { name: 'Dr. Elif Yıldız', role: 'Kurucu & CEO', bg: '#0d9488' },
      { name: 'Mhd. Tarık Demir', role: 'CTO / Ar-Ge', bg: '#1e3a5f' },
      { name: 'Fzt. Ayşe Kılıç', role: 'Klinik Direktör', bg: '#0d9488' },
      { name: 'Ahmet Şahin', role: 'Medikal İşler', bg: '#b87333' },
      { name: 'Dr. Mehmet Can', role: 'Üroloji Danışmanı', bg: '#1e3a5f' },
      { name: 'Selin Arslan', role: 'Ürün Yönetimi', bg: '#0d9488' },
    ]) },
    // Klinisyenler
    { key: 'clinician_prescribe_steps', type: 'json', label: 'Klinisyenler - Reçete Adımları', value: JSON.stringify([
      { step: '1', title: 'Hastayı Değerlendirin', desc: 'Pelvik taban bozukluğunu tanımlayın ve PelvicAir kontrendikasyonlarını dışlayın.' },
      { step: '2', title: 'Protokol Seçin', desc: 'Mobil uygulamadan veya PelvicAir Klinisyen Portalı\'ndan uygun hastalık modunu (K-01 ila E-07) önerin.' },
      { step: '3', title: 'Hastayı Yönlendirin', desc: 'Reçete veya öneri mektubu yazın. Hasta web sitesinden veya yetkili satıcıdan temin edebilir.' },
    ]) },
    { key: 'clinician_evidence', type: 'json', label: 'Klinisyenler - Klinik Kanıt Kartları', value: JSON.stringify([
      { title: '%25 Hatalı Kegel', desc: 'Kadınların %25\'i Kegel egzersizini hatalı yapıyor — etki sıfır. PelvicAir pasif Kegel ile bu sorunu ortadan kaldırır.', source: 'Bø K. et al. 2012' },
      { title: '%13 PT Tamamlama', desc: 'Pelvik taban fizyoterapisi seanslarını tamamlama oranı sadece %13. Evde PelvicAir ile uyum dramatik artar.', source: 'Klotz T. et al. 2019' },
      { title: 'OAB İlaç Yan Etkileri', desc: 'Antikolinerjik ilaçların %40 bırakma oranı. PelvicAir farmakolojik olmayan bir alternatif sunar.', source: 'Chapple CR. et al. 2021' },
    ]) },
    { key: 'clinician_downloads', type: 'json', label: 'Klinisyenler - Profesyonel Kaynaklar', value: JSON.stringify([
      { title: 'Klinisyen Reçete Rehberi', desc: 'Hastalık modları, kontrendikasyonlar ve dozaj parametreleri', format: 'PDF' },
      { title: 'Klinik Kanıt Özeti', desc: '50+ çalışmanın özeti — RCT, meta-analiz, Cochrane', format: 'PDF' },
      { title: 'Hasta Bilgi Broşürü', desc: 'Hastanıza verebileceğiniz Türkçe ürün tanıtım broşürü', format: 'PDF' },
      { title: 'Toplu Satış Başvurusu', desc: 'Klinik ve hastane alımları için başvuru formu', format: 'FORM' },
    ]) },
  ];

  for (const item of cmsItems) {
    await prisma.cmsContent.upsert({ where: { key: item.key }, update: {}, create: item });
  }

  console.log('CMS content created.');
  console.log('');
  console.log('=== Seed tamamlandı ===');
  console.log('Admin giriş: admin@pelvicair.com / Admin123!');
  console.log('Süper Admin: superadmin@pelvicair.com / Super123!');
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
