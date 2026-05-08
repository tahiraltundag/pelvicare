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
    where: { email: 'admin@pelvicare.com' },
    update: {},
    create: { email: 'admin@pelvicare.com', password: adminPass, name: 'Admin', role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@pelvicare.com' },
    update: {},
    create: { email: 'superadmin@pelvicare.com', password: superPass, name: 'Süper Admin', role: 'superadmin' },
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

  // Products
  const products = [
    {
      name: 'PelviCare Pro Cihaz',
      slug: 'pelvicare-pro-cihaz',
      description: '<p>PelviCare Pro, pelvik taban rehabilitasyonu için geliştirilmiş 3-modaliteli (EMS + Elektromanyetik + Vibrasyon) ev cihazıdır. 17 bilimsel protokol, mobil uygulama desteği ve 2 yıl garanti.</p>',
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
      description: '<p>PelviCare cihazı ile uyumlu hidrojel elektrod padler. Her pad 3-5 seans kullanıma uygundur. Resealable poşette saklanır.</p>',
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
      name: 'PelviCare Başlangıç Paketi',
      slug: 'pelvicare-baslangic-paketi',
      description: '<p>PelviCare Pro cihaz + 2 paket elektrod pad + taşıma çantası. Yeni kullanıcılar için en uygun başlangıç seti.</p>',
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
    { key: 'hero_subtitle', value: 'PelviCare Pro ile EMS, Elektromanyetik ve Vibrasyon teknolojilerini bir arada kullanın. Evde, kolayca, bilimsel olarak kanıtlanmış yöntemlerle.', type: 'text', label: 'Ana Sayfa - Hero Alt Başlık' },
    { key: 'hero_cta', value: 'Hemen Keşfet', type: 'text', label: 'Ana Sayfa - Hero Buton' },
    { key: 'hero_image', value: '', type: 'image', label: 'Ana Sayfa - Hero Görsel' },
    { key: 'about_title', value: 'PelviCare Hakkında', type: 'text', label: 'Hakkımızda - Başlık' },
    { key: 'about_content', value: '<p>PelviCare, pelvik taban rehabilitasyonunu herkes için erişilebilir kılmak amacıyla kurulmuştur. Fizyoterapistler, ürologlar ve biyomedikal mühendislerden oluşan ekibimiz, klinik araştırmalarla desteklenen çözümler geliştirmektedir.</p>', type: 'html', label: 'Hakkımızda - İçerik' },
    { key: 'footer_address', value: 'Maslak Mah. AOS 55. Sok. 42 Maslak Residence, No: 4/B Sarıyer / İstanbul', type: 'text', label: 'Footer - Adres' },
    { key: 'footer_phone', value: '+90 212 000 00 00', type: 'text', label: 'Footer - Telefon' },
    { key: 'footer_email', value: 'info@pelvicare.com', type: 'text', label: 'Footer - E-posta' },
    { key: 'contact_title', value: 'Bize Ulaşın', type: 'text', label: 'İletişim - Başlık' },
    { key: 'contact_subtitle', value: 'Sorularınız için uzman ekibimiz size yardımcı olmaktan memnuniyet duyar.', type: 'text', label: 'İletişim - Alt Başlık' },
    { key: 'announcement_bar', value: '', type: 'text', label: 'Duyuru Çubuğu' },
    { key: 'logo_url', value: '', type: 'image', label: 'Logo Görseli' },
    { key: 'clinician_title', value: 'Klinisyenler İçin', type: 'text', label: 'Klinisyenler - Başlık' },
    { key: 'clinician_content', value: '<p>PelviCare, klinik ortamlarda kullanım için özel toplu satış ve reçete programları sunmaktadır. Hastalarınıza en iyi bakımı sağlamak için bizimle iletişime geçin.</p>', type: 'html', label: 'Klinisyenler - İçerik' },
  ];

  for (const item of cmsItems) {
    await prisma.cmsContent.upsert({ where: { key: item.key }, update: {}, create: item });
  }

  console.log('CMS content created.');
  console.log('');
  console.log('=== Seed tamamlandı ===');
  console.log('Admin giriş: admin@pelvicare.com / Admin123!');
  console.log('Süper Admin: superadmin@pelvicare.com / Super123!');
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
