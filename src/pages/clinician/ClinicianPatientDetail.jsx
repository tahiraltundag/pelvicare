import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Activity } from 'lucide-react';
import api from '../../api/client';

const PROTOCOLS = [
  { group: 'Kadın', items: ['K-01 — İdrar Kaçırma', 'K-02 — Aşırı Aktif Mesane', 'K-03 — Pelvik Organ Sarkması', 'K-04 — Dismenore', 'K-05 — Vajinismus', 'K-06 — Orgazm Bozukluğu', 'K-07 — Cinsel Uyarılma Bozukluğu', 'K-08 — Postpartum Cinsel Disfonksiyon', 'K-09 — Postpartum Pelvik Hipotonisi', 'K-10 — Menopoz Sonrası Hipotonisi'] },
  { group: 'Erkek', items: ['E-01 — İdrar Kaçırma', 'E-02 — Aşırı Aktif Mesane', 'E-03 — Erektil Disfonksiyon', 'E-04 — Erken Boşalma', 'E-05 — Gecikmiş Boşalma', 'E-06 — Prostatik Pelvik Ağrı', 'E-07 — Pelvik Taban Hipotonisi'] },
];

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

function AddSessionModal({ patientId, onClose, onAdded }) {
  const [form, setForm] = useState({ protocol: '', date: new Date().toISOString().slice(0, 10), duration: 20, notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.protocol) { setError('Protokol seçiniz'); return; }
    setLoading(true);
    try {
      const res = await api.post(`/clinician/patients/${patientId}/sessions`, form);
      if (!res.success) throw new Error(res.error);
      onAdded(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Seans Ekle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Protokol *</label>
            <select className={inp} value={form.protocol} onChange={set('protocol')} required>
              <option value="">Protokol seçin</option>
              {PROTOCOLS.map(g => (
                <optgroup key={g.group} label={g.group === 'Kadın' ? '♀ Kadın Modları' : '♂ Erkek Modları'}>
                  {g.items.map(item => <option key={item} value={item}>{item}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tarih</label>
              <input type="date" className={inp} value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Süre (dk)</label>
              <input type="number" className={inp} value={form.duration} onChange={set('duration')} min="1" max="120" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notlar</label>
            <textarea className={inp} rows={2} value={form.notes} onChange={set('notes')} placeholder="Seans notları..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">İptal</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition"
              style={{ backgroundColor: '#0d9488' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClinicianPatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get(`/clinician/patients/${id}`).then(res => {
      if (res.success) setPatient(res.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Bu seansı silmek istediğinizden emin misiniz?')) return;
    const res = await api.delete(`/clinician/patients/${id}/sessions/${sessionId}`);
    if (res.success) setPatient(p => ({ ...p, sessions: p.sessions.filter(s => s.id !== sessionId) }));
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Yükleniyor...</div>;
  if (!patient) return <div className="p-10 text-center text-gray-400">Hasta bulunamadı.</div>;

  return (
    <div className="p-8">
      <Link to="/klinisyen/hastalar" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} /> Hastalara Dön
      </Link>

      {/* Patient Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
            {patient.email && <div className="text-sm text-gray-400">{patient.email}</div>}
          </div>
          <div className="flex items-center gap-2 text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1.5 rounded-xl">
            <Activity size={14} />
            {patient.sessions?.length || 0} Seans
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Cinsiyet', value: patient.gender || '—' },
            { label: 'Doğum Yılı', value: patient.birthYear || '—' },
            { label: 'Tanı', value: patient.diagnosis || '—' },
            { label: 'Eklenme', value: new Date(patient.createdAt).toLocaleDateString('tr-TR') },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-gray-900">{value}</div>
            </div>
          ))}
        </div>
        {patient.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">{patient.notes}</div>
        )}
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Seans Geçmişi</h2>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: '#0d9488' }}>
            <Plus size={16} /> Seans Ekle
          </button>
        </div>

        {!patient.sessions?.length ? (
          <div className="p-10 text-center text-gray-400">Henüz seans kaydedilmemiş.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Tarih', 'Protokol', 'Süre', 'Notlar', ''].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patient.sessions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(s.date).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">{s.protocol}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.duration} dk</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{s.notes || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteSession(s.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <AddSessionModal patientId={id} onClose={() => setShowModal(false)} onAdded={(s) => { setPatient(p => ({ ...p, sessions: [s, ...p.sessions] })); setShowModal(false); }} />}
    </div>
  );
}
