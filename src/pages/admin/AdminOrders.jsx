import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Package, Building2 } from 'lucide-react';
import api from '../../api/client';

const STATUS_OPTIONS = [
  { value: 'beklemede', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'onaylandi', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'kargoda', label: 'Kargoda', color: 'bg-purple-100 text-purple-800' },
  { value: 'teslim_edildi', label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'iptal', label: 'İptal', color: 'bg-red-100 text-red-800' },
];

const BULK_STATUS_OPTIONS = [
  { value: 'beklemede', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'gorusuldu', label: 'Görüşüldü', color: 'bg-blue-100 text-blue-800' },
  { value: 'tamamlandi', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
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

function BulkOrderRow({ order, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const statusOpt = BULK_STATUS_OPTIONS.find(s => s.value === order.status);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    const res = await api.patch(`/admin/bulk-orders/${order.id}`, { status: newStatus });
    if (res.success) onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setOpen(o => !o)}>
        <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(-8).toUpperCase()}</td>
        <td className="px-4 py-3 max-w-[160px]">
          <div className="font-medium text-gray-900 truncate">{order.name}</div>
          <div className="text-xs text-gray-400 truncate">{order.email}</div>
        </td>
        <td className="hidden sm:table-cell px-4 py-3 text-gray-700 truncate max-w-[140px]">{order.institution}</td>
        <td className="hidden sm:table-cell px-4 py-3 font-bold text-gray-900 text-center">{order.quantity}</td>
        <td className="px-4 py-3">
          <select
            value={order.status}
            onClick={e => e.stopPropagation()}
            onChange={e => handleStatus(e.target.value)}
            disabled={updating}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 outline-none cursor-pointer ${statusOpt?.color || 'bg-gray-100 text-gray-600'}`}
          >
            {BULK_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </td>
        <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
        <td className="px-4 py-3 text-gray-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/50">
          <td colSpan={7} className="px-4 pb-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 text-gray-600">
                <div><span className="font-semibold text-gray-700">Ad Soyad:</span> {order.name}</div>
                <div><span className="font-semibold text-gray-700">E-posta:</span> {order.email}</div>
                <div><span className="font-semibold text-gray-700">Kurum:</span> {order.institution}</div>
                {order.phone && <div><span className="font-semibold text-gray-700">Telefon:</span> {order.phone}</div>}
                <div><span className="font-semibold text-gray-700">Adet:</span> {order.quantity}</div>
              </div>
              {order.message && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Mesaj</div>
                  <p className="text-gray-600 text-sm bg-white border border-gray-100 rounded-lg px-3 py-2">{order.message}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrders() {
  const [tab, setTab] = useState('orders');

  // Regular orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  // Bulk orders state
  const [bulkOrders, setBulkOrders] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(true);
  const [bulkStatusFilter, setBulkStatusFilter] = useState('');
  const [bulkPage, setBulkPage] = useState(1);
  const [bulkMeta, setBulkMeta] = useState({});

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    const params = { page, limit: 20, ...(statusFilter && { status: statusFilter }) };
    const res = await api.get('/admin/orders', params);
    if (res.success) { setOrders(res.data); setMeta(res.meta || {}); }
    setOrdersLoading(false);
  }, [page, statusFilter]);

  const loadBulkOrders = useCallback(async () => {
    setBulkLoading(true);
    const params = { page: bulkPage, limit: 20, ...(bulkStatusFilter && { status: bulkStatusFilter }) };
    const res = await api.get('/admin/bulk-orders', params);
    if (res.success) { setBulkOrders(res.data); setBulkMeta(res.meta || {}); }
    setBulkLoading(false);
  }, [bulkPage, bulkStatusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => { loadBulkOrders(); }, [loadBulkOrders]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleBulkStatusChange = (id, newStatus) => {
    setBulkOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {tab === 'orders' ? `${meta.total || 0} sipariş` : `${bulkMeta.total || 0} toplu sipariş başvurusu`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'orders' ? (
            <select
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">Tüm Durumlar</option>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          ) : (
            <select
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500"
              value={bulkStatusFilter}
              onChange={e => { setBulkStatusFilter(e.target.value); setBulkPage(1); }}
            >
              <option value="">Tüm Durumlar</option>
              {BULK_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package size={15} />
          Siparişler
          {(meta.total > 0) && (
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{meta.total}</span>
          )}
        </button>
        <button
          onClick={() => setTab('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'bulk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building2 size={15} />
          Klinisyen Başvuruları
          {(bulkMeta.total > 0) && (
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{bulkMeta.total}</span>
          )}
        </button>
      </div>

      {/* Regular orders table */}
      {tab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {ordersLoading ? (
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
      )}

      {/* Bulk orders table */}
      {tab === 'bulk' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {bulkLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bulkOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Building2 size={32} className="mb-2 opacity-30" />
              <p className="text-sm">Toplu sipariş başvurusu bulunamadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ref No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Klinisyen</th>
                    <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Kurum</th>
                    <th className="hidden sm:table-cell text-center px-4 py-3 font-semibold text-gray-600">Adet</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Durum</th>
                    <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Tarih</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {bulkOrders.map(order => (
                    <BulkOrderRow key={order.id} order={order} onStatusChange={handleBulkStatusChange} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {bulkMeta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <button disabled={bulkPage <= 1} onClick={() => setBulkPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
                Önceki
              </button>
              <span className="text-sm text-gray-500">{bulkPage} / {bulkMeta.totalPages}</span>
              <button disabled={bulkPage >= bulkMeta.totalPages} onClick={() => setBulkPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
                Sonraki
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
