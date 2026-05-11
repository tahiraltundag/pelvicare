import { useEffect, useState } from 'react';
import { ShoppingCart, Users, Package, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import api from '../../api/client';

const STATUS_LABELS = { beklemede: 'Beklemede', onaylandi: 'Onaylandı', kargoda: 'Kargoda', teslim_edildi: 'Teslim Edildi', iptal: 'İptal' };
const STATUS_COLORS = { beklemede: 'bg-yellow-100 text-yellow-800', onaylandi: 'bg-blue-100 text-blue-800', kargoda: 'bg-purple-100 text-purple-800', teslim_edildi: 'bg-green-100 text-green-800', iptal: 'bg-red-100 text-red-800' };

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      if (res.success) setData(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-red-500">Veriler yüklenemedi.</div>;

  const { stats, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Genel bakış</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Toplam Sipariş" value={stats.totalOrders} color="bg-teal-50 text-teal-600" />
        <StatCard icon={TrendingUp} label="Toplam Gelir" value={`${stats.totalRevenue.toLocaleString('tr-TR')} ₺`} color="bg-green-50 text-green-600" />
        <StatCard icon={Users} label="Kullanıcı" value={stats.totalUsers} color="bg-blue-50 text-blue-600" />
        <StatCard icon={Package} label="Aktif Ürün" value={stats.totalProducts} color="bg-purple-50 text-purple-600" />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3 text-yellow-800 font-semibold">
            <AlertTriangle size={18} />
            Düşük Stok Uyarısı ({lowStockProducts.length} ürün)
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="bg-white rounded-xl px-3 py-2 text-sm flex justify-between items-center">
                <span className="font-medium text-gray-800 truncate">{p.name}</span>
                <span className="text-red-600 font-bold ml-2">{p.stock} adet</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Clock size={18} className="text-gray-400" />
          <h2 className="font-bold text-gray-900">Son Siparişler</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">Henüz sipariş yok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Sipariş</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Müşteri</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Tutar</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Durum</th>
                  <th className="hidden sm:table-cell text-left px-5 py-3 font-semibold text-gray-600">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-800">{order.user?.name || order.address?.firstName + ' ' + order.address?.lastName || 'Misafir'}</div>
                      <div className="text-xs text-gray-400">{order.user?.email || order.address?.email || ''}</div>
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">{order.total.toLocaleString('tr-TR')} ₺</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
