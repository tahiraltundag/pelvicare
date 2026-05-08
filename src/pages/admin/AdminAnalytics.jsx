import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle, Package } from 'lucide-react';
import api from '../../api/client';

const STATUS_COLORS = {
  beklemede: '#f59e0b',
  onaylandi: '#3b82f6',
  kargoda: '#8b5cf6',
  teslim_edildi: '#10b981',
  iptal: '#ef4444',
};
const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

function PnlCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value.toLocaleString('tr-TR')} ₺</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

const CustomTooltipRevenue = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString('tr-TR')} {p.name === 'Sipariş' ? 'adet' : '₺'}
        </div>
      ))}
    </div>
  );
};

const CustomTooltipStock = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      <div className="text-teal-600">Stok: {payload[0]?.value} adet</div>
    </div>
  );
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueView, setRevenueView] = useState('gelir'); // 'gelir' | 'siparis'

  useEffect(() => {
    api.get('/admin/analytics').then(res => {
      if (res.success) setData(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-red-500 p-4">Veriler yüklenemedi.</div>;

  const { monthlyRevenue, orderStatusDist, productStock, pnl } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analitik & Raporlar</h1>
        <p className="text-gray-500 text-sm mt-0.5">Son 12 aylık satış, gelir ve stok verileri</p>
      </div>

      {/* P&L Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PnlCard
          icon={TrendingUp}
          label="Net Gelir (Aktif)"
          value={pnl.totalRevenue}
          color="bg-teal-50 text-teal-600"
          sub="İptal hariç tüm siparişler"
        />
        <PnlCard
          icon={CheckCircle}
          label="Teslim Edildi"
          value={pnl.delivered}
          color="bg-green-50 text-green-600"
          sub="Tamamlanan siparişler"
        />
        <PnlCard
          icon={Clock}
          label="İşlemde"
          value={pnl.pending}
          color="bg-blue-50 text-blue-600"
          sub="Bekleyen + Onaylanan + Kargoda"
        />
        <PnlCard
          icon={TrendingDown}
          label="İptal / Kayıp"
          value={pnl.totalCancelled}
          color="bg-red-50 text-red-600"
          sub="İptal edilen sipariş tutarı"
        />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Aylık Performans</h2>
            <p className="text-xs text-gray-400 mt-0.5">Son 12 ay</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[{ key: 'gelir', label: 'Gelir' }, { key: 'siparis', label: 'Sipariş' }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setRevenueView(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${revenueView === tab.key ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          {revenueView === 'gelir' ? (
            <BarChart data={monthlyRevenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Bar dataKey="gelir" name="Gelir" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="iptal" name="İptal" fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Line type="monotone" dataKey="siparis" name="Sipariş" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4, fill: '#0d9488' }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          {revenueView === 'gelir' ? (
            <>
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" />Gelir</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-red-200 inline-block" />İptal</span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" />Sipariş Sayısı</span>
          )}
        </div>
      </div>

      {/* Bottom row: Pie + Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-1">Sipariş Durumu Dağılımı</h2>
          <p className="text-xs text-gray-400 mb-4">Son 12 ay</p>
          {orderStatusDist.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Henüz sipariş yok</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatusDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusDist.map((entry, i) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} sipariş`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2">
                {orderStatusDist.map((entry, i) => (
                  <span key={entry.status} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.status] || PIE_COLORS[i % PIE_COLORS.length] }} />
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stock Levels */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <Package size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Stok Seviyeleri</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">Aktif ürünler (artan sıraya göre)</p>
          {productStock.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Ürün bulunamadı</div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, productStock.length * 32)}>
              <BarChart data={productStock} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltipStock />} />
                <Bar dataKey="stock" name="Stok" radius={[0, 4, 4, 0]}>
                  {productStock.map((entry, i) => (
                    <Cell key={i} fill={entry.stock <= 5 ? '#ef4444' : entry.stock <= 15 ? '#f59e0b' : '#0d9488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />Normal</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Düşük (≤15)</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Kritik (≤5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
