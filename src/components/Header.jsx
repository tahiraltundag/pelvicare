import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navItems = [
  { label: 'Nasıl Çalışır', path: '/nasil-calisir' },
  { label: 'SSS', path: '/sss' },
  { label: 'Yorumlar', path: '/yorumlar' },
  { label: 'Klinisyenler', path: '/klinisyenler' },
  { label: 'Kaynaklar', path: '/kaynaklar' },
  {
    label: 'Ürünler',
    children: [
      { label: 'PelviCare Cihazı', path: '/urun/pelvicare' },
      { label: 'Kadın Modları', path: '/kadin' },
      { label: 'Erkek Modları', path: '/erkek' },
      { label: 'Elektrod Padler', path: '/urun/elektrod-pad' },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { count, setSidebarOpen } = useCart();
  const navigate = useNavigate();
  const goToPrice = () => {
    setMobileOpen(false);
    navigate('/urun/pelvicare');
    setTimeout(() => document.getElementById('paketler')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-navy-800" style={{ color: '#1e3a5f' }}>
              Pelvi<span style={{ color: '#0d9488' }}>Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-md hover:bg-teal-50">
                    {item.label}
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Cart */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative p-2 text-gray-500 hover:text-teal-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#0d9488' }}>
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={goToPrice}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#0d9488' }}
            >
              Fiyatı Gör
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className="block pl-6 pr-3 py-2 text-sm text-gray-700 hover:text-teal-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 rounded-md"
                >
                  {item.label}
                </Link>
              )
            )}
            <button
              onClick={goToPrice}
              className="mt-3 px-4 py-2 text-sm font-semibold text-white text-center rounded-lg w-full hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: '#0d9488' }}
            >
              Fiyatı Gör
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
