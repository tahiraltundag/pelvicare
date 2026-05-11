import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import api from '../../api/client';

const STATUS_OPTIONS = [
  { value: 'beklemede', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'onaylandi', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'kargoda', label: 'Kargoda', color: 'bg-purple-100 text-purple-800' },
  { value: 'teslim_edildi', label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'iptal', label: 'İptal', color: 'bg-red-100 text-red-800' },
];

function OrderRow({ order, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const statusOpt = STATUS_OPTIONS.find(s => s.value === order.status);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    const res = await api.patch(`/orders/${order.id}/status`, { status: newStatus });
    if (res.success) onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  const addr = order.address || {};

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setOpen(o => !o)}>
        <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(-8).toUpperCase()}</td>
        <td className="px-4 py-3 max-w-[140px]">
          <div className="font-medium text-gray-900 truncate">{order.user?.name || `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Misafir'}</div>
          <div className="text-xs text-gray-400 truncate">{order.user?.email || addr.email || ''}</div>
        </td>
        <td className="hidden sm:table-cell px-4 py-3 font-bold text-gray-900">{order.total.toLocaleString('tr-TR')} ₺</td>
        <td className="px-4 py-3">
          <select
            value={order.status}
            onClick={e => e.stopPropagation()}
            onChange={e => handleStatus(e.target.value)}
            disabled={updating}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 outline-none cursor-pointer ${statusOpt?.color || 'bg-gray-100 text-gray-600'}`}
          >
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </td>
        <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
        <td className="px-4 py-3 text-gray-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/50">
          <td colSpan={6} className="px-4 pb-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-2">Teslimat Adresi</div>
                {addr.firstName ? (
                  <div className="text-gray-600 space-y-0.5">
                    <div>{addr.firstName} {addr.lastName}</div>
                    <div>{addr.address}</div>
                    <div>{addr.district} / {addr.city}</div>
                    <div>{addr.phone}</div>
                    <div>{addr.email}</div>
                  </div>
                ) : <div className="text-gray-400">Adres bilgisi yok</div>}
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-2">Ürünler ({order.items?.length})</div>
                <div className="space-y-1">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span>{item.name} {item.variant ? `(${item.variant})` : ''} × {item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {order.notes && <div className="mt-3 text-sm text-gray-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2"><span className="font-medium">Not: </span>{order.notes}</div>}
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 20, ...(statusFilter && { status: statusFilter }) };
    const res = await api.get('/admin/orders', params);
    if (res.success) { setOrders(res.data); setMeta(res.meta || {}); }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{meta.total || 0} sipariş</p>
        </div>
        <select
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tüm Durumlar</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Package size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Sipariş bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Sipariş No</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Müşteri</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Tutar</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Durum</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Tarih</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
              Önceki
            </button>
            <span className="text-sm text-gray-500">{page} / {meta.totalPages}</span>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
