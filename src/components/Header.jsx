import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown, User, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Nasıl Çalışır', path: '/nasil-calisir' },
  { label: 'Mağaza', path: '/magaza' },
  { label: 'SSS', path: '/sss' },
  { label: 'Yorumlar', path: '/yorumlar' },
  { label: 'Klinisyenler', path: '/klinisyenler' },
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

function UserMenu({ user, logout, isAdmin }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-teal-50 hover:text-teal-600 transition-colors text-sm font-medium text-gray-700">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0d9488' }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        {user.name?.split(' ')[0]}
        <ChevronDown size={12} />
      </button>
      <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
        <div className="w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </div>
          <Link to="/siparislerim" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
            <Package size={15} />Siparişlerim
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
              <Settings size={15} />Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={15} />Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { count, setSidebarOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
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
            <span className="text-xl font-bold" style={{ color: '#1e3a5f' }}>
              Pelvi<span style={{ color: '#0d9488' }}>Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-md hover:bg-teal-50">
                    {item.label}<ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-50">
                    <div className="w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.path} to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.path) ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Cart + Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="relative p-2 text-gray-500 hover:text-teal-600 transition-colors">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#0d9488' }}>
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <UserMenu user={user} logout={logout} isAdmin={isAdmin} />
            ) : (
              <>
                <Link to="/giris" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50">
                  Giriş
                </Link>
                <Link to="/kayit" className="px-4 py-1.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-all" style={{ backgroundColor: '#0d9488' }}>
                  Kayıt Ol
                </Link>
              </>
            )}

            <button onClick={goToPrice}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-95 ml-1"
              style={{ backgroundColor: '#1e3a5f' }}>
              Fiyatı Gör
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="relative p-2 text-gray-500">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#0d9488' }}>
                  {count}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.label}</div>
                  {item.children.map((child) => (
                    <Link key={child.path} to={child.path} onClick={() => setMobileOpen(false)}
                      className="block pl-6 pr-3 py-2 text-sm text-gray-700 hover:text-teal-600">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 rounded-md">
                  {item.label}
                </Link>
              )
            )}

            <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  <Link to="/siparislerim" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 rounded-md">
                    Siparişlerim
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 rounded-md">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 rounded-md">
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/giris" onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-sm font-semibold text-center text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    Giriş
                  </Link>
                  <Link to="/kayit" onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-sm font-semibold text-center text-white rounded-xl hover:opacity-90 transition"
                    style={{ backgroundColor: '#0d9488' }}>
                    Kayıt Ol
                  </Link>
                </div>
              )}
              <button onClick={goToPrice}
                className="w-full py-2 text-sm font-semibold text-white text-center rounded-xl hover:opacity-90 transition"
                style={{ backgroundColor: '#1e3a5f' }}>
                Fiyatı Gör
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
