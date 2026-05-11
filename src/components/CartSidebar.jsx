import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const STATIC_PATHS = {
  'pkg-starter': '/urun/pkg-starter',
  'pkg-premium': '/urun/pkg-premium',
  'pkg-pro': '/urun/pkg-pro',
  'pad-5pack': '/urun/pad-5pack',
};

function getItemPath(item) {
  if (STATIC_PATHS[item.id]) return STATIC_PATHS[item.id];
  if (item.slug) return `/urun/${item.slug}`;
  if (item.path) return item.path;
  return `/urun/${item.id}`;
}

export default function CartSidebar() {
  const { items, sidebarOpen, setSidebarOpen, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    setSidebarOpen(false);
    navigate('/odeme');
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ backgroundColor: '#1e3a5f' }}>
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag size={18} />
            <span className="font-bold">Sepetim</span>
            {items.length > 0 && (
              <span className="text-xs bg-teal-500 text-white rounded-full px-2 py-0.5">{items.length}</span>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <ShoppingBag size={48} className="mb-3 text-gray-200" />
              <p className="font-medium text-gray-500">Sepetiniz boş</p>
              <p className="text-sm mt-1">Ürün eklemek için alışverişe devam edin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id + item.variant}
                  className="flex gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => { setSidebarOpen(false); navigate(getItemPath(item)); }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#f0fdfa' }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{item.variant}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(item.id, item.variant, item.qty - 1); }}
                          className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 hover:border-teal-500 text-gray-600 hover:text-teal-600 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(item.id, item.variant, item.qty + 1); }}
                          className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 hover:border-teal-500 text-gray-600 hover:text-teal-600 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>
                          {(item.price * item.qty).toLocaleString('tr-TR')} ₺
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id, item.variant); }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Toplam</span>
              <span className="text-xl font-bold" style={{ color: '#1e3a5f' }}>
                {total.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <button
              onClick={goToCheckout}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 mb-2"
              style={{ backgroundColor: '#0d9488' }}
            >
              Ödemeye Geç
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Alışverişe Devam Et
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Güvenli ödeme · 60 gün iade garantisi
            </p>
          </div>
        )}
      </div>
    </>
  );
}
