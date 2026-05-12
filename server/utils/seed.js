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
    { key: 'hero_title', value: 'Pelvik Taban Rehabilitasyonunda Yeni Nesil Teknoloji', type: 'text', label: 'Ana Sayfa - Hero Başlık' },
    { key: 'hero_subtitle', value: 'PelvicAir Pro ile EMS, Elektromanyetik ve Vibrasyon teknolojilerini bir arada kullanın. Evde, kolayca, bilimsel olarak kanıtlanmış yöntemlerle.', type: 'text', label: 'Ana Sayfa - Hero Alt Başlık' },
    { key: 'hero_cta', value: 'Hemen Keşfet', type: 'text', label: 'Ana Sayfa - Hero Buton' },
    { key: 'hero_image', value: '', type: 'image', label: 'Ana Sayfa - Hero Görsel' },
    { key: 'about_title', value: 'PelvicAir Hakkında', type: 'text', label: 'Hakkımızda - Başlık' },
    { key: 'about_content', value: '<p>PelvicAir, pelvik taban rehabilitasyonunu herkes için erişilebilir kılmak amacıyla kurulmuştur. Fizyoterapistler, ürologlar ve biyomedikal mühendislerden oluşan ekibimiz, klinik araştırmalarla desteklenen çözümler geliştirmektedir.</p>', type: 'html', label: 'Hakkımızda - İçerik' },
    { key: 'footer_address', value: 'Maslak Mah. AOS 55. Sok. 42 Maslak Residence, No: 4/B Sarıyer / İstanbul', type: 'text', label: 'Footer - Adres' },
    { key: 'footer_phone', value: '+90 212 000 00 00', type: 'text', label: 'Footer - Telefon' },
    { key: 'footer_email', value: 'info@pelvicair.com', type: 'text', label: 'Footer - E-posta' },
    { key: 'contact_title', value: 'Bize Ulaşın', type: 'text', label: 'İletişim - Başlık' },
    { key: 'contact_subtitle', value: 'Sorularınız için uzman ekibimiz size yardımcı olmaktan memnuniyet duyar.', type: 'text', label: 'İletişim - Alt Başlık' },
    { key: 'announcement_bar', value: '', type: 'text', label: 'Duyuru Çubuğu' },
    { key: 'logo_url', value: '', type: 'image', label: 'Logo Görseli' },
    { key: 'clinician_title', value: 'Klinisyenler İçin', type: 'text', label: 'Klinisyenler - Başlık' },
    { key: 'clinician_content', value: '<p>PelvicAir, klinik ortamlarda kullanım için özel toplu satış ve reçete programları sunmaktadır. Hastalarınıza en iyi bakımı sağlamak için bizimle iletişime geçin.</p>', type: 'html', label: 'Klinisyenler - İçerik' },
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
  ];

  for (const item of cmsItems) {
    await prisma.cmsContent.upsert({ where: { key: item.key }, update: { value: item.value }, create: item });
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
