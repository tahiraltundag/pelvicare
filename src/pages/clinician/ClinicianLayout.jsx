import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PelvicAirLogotype } from '../../components/PelvicAirLogo';

const nav = [
  { to: '/klinisyen/panel', icon: LayoutDashboard, label: 'Panel' },
  { to: '/klinisyen/hastalar', icon: Users, label: 'Hastalar' },
  { to: '/klinisyen/toplu-siparis', icon: ShoppingBag, label: 'Sipariş' },
];

export default function ClinicianLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-100">
          <PelvicAirLogotype iconSize={28} />
          <div className="mt-2 text-xs text-teal-600 font-semibold">Klinisyen Portalı</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-teal-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} />Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Content column — wraps mobile header + page + mobile nav */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile top header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div>
            <PelvicAirLogotype iconSize={24} />
            <div className="text-xs text-teal-600 font-semibold mt-0.5">Klinisyen Portalı</div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
          <div className="flex">
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                    isActive ? 'text-teal-600' : 'text-gray-400'
                  }`
                }
              >
                <Icon size={22} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
