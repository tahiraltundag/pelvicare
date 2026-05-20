import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { PelvicAirIcon } from './PelvicAirLogo';
import { useCms } from '../hooks/useCms';

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const footerLinks = {
  Ürünler: [
    { label: 'PelviQ Cihazı', path: '/urun/pelvicair' },
    { label: 'Kadın Modları', path: '/kadin' },
    { label: 'Erkek Modları', path: '/erkek' },
    { label: 'Elektrod Padler', path: '/urun/elektrod-pad' },
  ],
  'Hasta Kaynakları': [
    { label: 'Hakkımızda', path: '/hakkimizda' },
    { label: 'Yorumlar', path: '/yorumlar' },
    { label: 'SSS', path: '/sss' },
    { label: 'Kaynaklar & Makaleler', path: '/kaynaklar' },
    { label: 'İletişim', path: '/iletisim' },
  ],
  'Sağlık Profesyonelleri': [
    { label: 'Klinisyenler', path: '/klinisyenler' },
    { label: 'Nasıl Çalışır', path: '/nasil-calisir' },
    { label: 'Klinik Kanıt', path: '/klinik-kanit' },
  ],
  Şirket: [
    { label: 'Gizlilik Politikası', path: '/gizlilik' },
    { label: 'Kullanım Koşulları', path: '/kosullar' },
    { label: 'İade Politikası', path: '/iade' },
  ],
};

export default function Footer() {
  const { get } = useCms();
  const phone = get('footer_phone', '0850 123 45 67');
  const email = get('footer_email', 'info@pelvicair.com');

  return (
    <footer style={{ backgroundColor: '#1e3a5f' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <PelvicAirIcon size={36} />
              <span className="text-xl font-extrabold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                Pelvi<span className="text-teal-400">Q</span>
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-4">
              Akıllı Hibrit Pelvik Taban Rehabilitasyon Sistemi. Üç güç. Bir cihaz. Sonsuz özgürlük.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-blue-300 hover:text-teal-400 transition-colors"><IconInstagram /></a>
              <a href="#" className="text-blue-300 hover:text-teal-400 transition-colors"><IconYoutube /></a>
              <a href="#" className="text-blue-300 hover:text-teal-400 transition-colors"><IconFacebook /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-blue-200 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact + Bottom */}
        <div className="mt-12 pt-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-blue-300">
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                <Mail size={14} />
                {email}
              </a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                <Phone size={14} />
                {phone}
              </a>
            </div>
            <p className="text-xs text-blue-400">
              © 2026 PelviQ. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
