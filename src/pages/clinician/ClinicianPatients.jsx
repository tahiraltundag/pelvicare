import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, ChevronRight } from 'lucide-react';
import api from '../../api/client';

const GENDERS = ['', 'Kadın', 'Erkek', 'Diğer'];
const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

function AddPatientModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', birthYear: '', gender: '', diagnosis: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/clinician/patients', form);
      if (!res.success) throw new Error(res.error);
      onAdded(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Yeni Hasta Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Soyad *</label>
            <input className={inp} value={form.name} onChange={set('name')} required placeholder="Hasta adı" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cinsiyet</label>
              <select className={inp} value={form.gender} onChange={set('gender')}>
                {GENDERS.map(g => <option key={g} value={g}>{g || 'Seçin'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Doğum Yılı</label>
              <input type="number" className={inp} value={form.birthYear} onChange={set('birthYear')} placeholder="1985" min="1900" max="2020" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">E-posta</label>
            <input type="email" className={inp} value={form.email} onChange={set('email')} placeholder="hasta@email.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tanı / Şikayet</label>
            <input className={inp} value={form.diagnosis} onChange={set('diagnosis')} placeholder="Üriner inkontinans" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notlar</label>
            <textarea className={inp} rows={2} value={form.notes} onChange={set('notes')} placeholder="Ek notlar..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">İptal</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition"
              style={{ backgroundColor: '#0d9488' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClinicianPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/clinician/patients').then(res => {
      if (res.success) setPatients(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu hastayı silmek istediğinizden emin misiniz?')) return;
    const res = await api.delete(`/clinician/patients/${id}`);
    if (res.success) setPatients(ps => ps.filter(p => p.id !== id));
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.diagnosis || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hastalar</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{patients.length} hasta kayıtlı</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
          style={{ backgroundColor: '#0d9488' }}>
          <Plus size={18} />
          <span className="hidden sm:inline">Hasta Ekle</span>
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          placeholder="Hasta adı veya tanı ara..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            {search ? 'Arama sonucu bulunamadı.' : 'Henüz hasta eklenmemiş.'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Hasta', 'Tanı', 'Seans', 'Eklenme', ''].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/klinisyen/hastalar/${p.id}`)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    {p.email && <div className="text-xs text-gray-400">{p.email}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.diagnosis || '—'}</td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-teal-600">{p._count?.sessions || 0}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={e => { e.stopPropagation(); handleDelete(p.id); }}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      <ChevronRight size={15} className="text-gray-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search ? 'Arama sonucu bulunamadı.' : 'Henüz hasta eklenmemiş.'}
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => navigate(`/klinisyen/hastalar/${p.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 mr-2">
                <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                {p.email && <div className="text-xs text-gray-400 truncate">{p.email}</div>}
              </div>
              <span className="text-sm font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg flex-shrink-0">
                {p._count?.sessions || 0} seans
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-3">{p.diagnosis || 'Tanı girilmedi'}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</span>
              <div className="flex gap-2">
                <button onClick={e => { e.stopPropagation(); handleDelete(p.id); }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                <ChevronRight size={16} className="text-gray-400 self-center" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddPatientModal onClose={() => setShowModal(false)} onAdded={(p) => { setPatients(ps => [{ ...p, _count: { sessions: 0 } }, ...ps]); setShowModal(false); }} />}
    </div>
  );
}
