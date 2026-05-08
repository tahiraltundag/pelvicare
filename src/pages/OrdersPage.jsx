import { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/client';

const STATUS = {
  beklemede: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  onaylandi: { label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
  kargoda: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800' },
  teslim_edildi: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  iptal: { label: 'İptal', color: 'bg-red-100 text-red-800' },
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[order.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 flex-shrink-0">
          <Package size={18} className="text-gray-400" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="font-bold text-gray-900">Sipariş #{order.id.slice(-8).toUpperCase()}</div>
          <div className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('tr-TR')} · {order.items?.length} ürün</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="font-bold" style={{ color: '#1e3a5f' }}>{order.total.toLocaleString('tr-TR')} ₺</div>
          <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s?.color || 'bg-gray-100 text-gray-600'}`}>
            {s?.label || order.status}
          </span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="sm:hidden mb-3">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s?.color || 'bg-gray-100 text-gray-600'}`}>
              {s?.label || order.status}
            </span>
          </div>
          <div className="space-y-2">
            {order.items?.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    {item.variant && <div className="text-xs text-gray-400">{item.variant}</div>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium text-gray-700">{item.quantity} × {item.price.toLocaleString('tr-TR')} ₺</div>
                  <div className="text-xs text-gray-400">{(item.quantity * item.price).toLocaleString('tr-TR')} ₺</div>
                </div>
              </div>
            ))}
          </div>
          {order.address?.address && (
            <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Teslimat: </span>
              {order.address.address}, {order.address.district} / {order.address.city}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(res => {
      if (res.success) setOrders(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Siparişlerim</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} sipariş</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={48} className="mb-4 opacity-30" />
            <p className="font-medium">Henüz sipariş vermediniz</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
