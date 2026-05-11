import { useEffect, useState, useCallback } from 'react';
import { Search, Shield, ShieldAlert, UserX, UserCheck } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'user', label: 'Kullanıcı', color: 'bg-gray-100 text-gray-600' },
  { value: 'admin', label: 'Admin', color: 'bg-blue-100 text-blue-700' },
  { value: 'superadmin', label: 'Süper Admin', color: 'bg-purple-100 text-purple-700' },
];

export default function AdminUsers() {
  const { user: me, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 20, ...(search && { search }), ...(roleFilter && { role: roleFilter }) };
    const res = await api.get('/admin/users', params);
    if (res.success) { setUsers(res.data); setMeta(res.meta || {}); }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const updateUser = async (id, data) => {
    const res = await api.patch(`/admin/users/${id}`, data);
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...res.data } : u));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        <p className="text-gray-500 text-sm mt-0.5">{meta.total || 0} kullanıcı</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
              placeholder="Ad veya e-posta ara..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">Tüm Roller</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-sm">Kullanıcı bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Kullanıcı</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rol</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Siparişler</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Durum</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-600">Kayıt Tarihi</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const role = ROLES.find(r => r.value === u.role);
                  const isMe = u.id === me?.id;
                  return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">{u.name} {isMe && <span className="text-xs text-gray-400">(siz)</span>}</div>
                            <div className="text-xs text-gray-400 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${role?.color || 'bg-gray-100 text-gray-600'}`}>
                          {role?.label || u.role}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-gray-600">{u._count?.orders || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {u.isActive ? 'Aktif' : 'Askıya Alındı'}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="px-4 py-3">
                        {!isMe && (
                          <div className="flex items-center gap-1 justify-end">
                            {isSuperAdmin && (
                              <select
                                value={u.role}
                                onChange={e => updateUser(u.id, { role: e.target.value })}
                                className="text-xs px-2 py-1 rounded-lg border border-gray-200 outline-none focus:border-teal-500"
                              >
                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                              </select>
                            )}
                            <button
                              onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                              className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                              title={u.isActive ? 'Askıya Al' : 'Aktif Et'}
                            >
                              {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
