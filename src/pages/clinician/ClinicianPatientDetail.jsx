import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Activity, Smartphone, Copy, Check, RefreshCw, Unlink, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../api/client';

const PROTOCOLS = [
  { group: 'Kadın', items: ['K-01 — İdrar Kaçırma', 'K-02 — Aşırı Aktif Mesane', 'K-03 — Pelvik Organ Sarkması', 'K-04 — Dismenore', 'K-05 — Vajinismus', 'K-06 — Orgazm Bozukluğu', 'K-07 — Cinsel Uyarılma Bozukluğu', 'K-08 — Postpartum Cinsel Disfonksiyon', 'K-09 — Postpartum Pelvik Hipotonisi', 'K-10 — Menopoz Sonrası Hipotonisi'] },
  { group: 'Erkek', items: ['E-01 — İdrar Kaçırma', 'E-02 — Aşırı Aktif Mesane', 'E-03 — Erektil Disfonksiyon', 'E-04 — Erken Boşalma', 'E-05 — Gecikmiş Boşalma', 'E-06 — Prostatik Pelvik Ağrı', 'E-07 — Pelvik Taban Hipotonisi'] },
];

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

// ── Add session modal ──────────────────────────────────────────────────────────
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
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Manuel Seans Ekle</h2>
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

// ── Device link section ────────────────────────────────────────────────────────
function DeviceLinkSection({ patientId, stats, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  const generateCode = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/clinician/patients/${patientId}/link-code`);
      if (res.success) onRefresh();
    } finally {
      setGenerating(false);
    }
  };

  const unlinkDevice = async () => {
    if (!confirm('Cihaz bağlantısını kesmek istediğinizden emin misiniz?')) return;
    setUnlinking(true);
    try {
      await api.delete(`/clinician/patients/${patientId}/device-token`);
      onRefresh();
    } finally {
      setUnlinking(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(stats.linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExpired = stats.linkExpiresAt && new Date(stats.linkExpiresAt) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <Smartphone size={18} className="text-teal-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Mobil Uygulama Bağlantısı</h2>
          <p className="text-xs text-gray-400">Hastanın cihazını portalınıza bağlayın</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {stats.isLinked ? (
            <span className="flex items-center gap-1 text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              <Wifi size={12} /> Bağlı
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              <WifiOff size={12} /> Bağlı Değil
            </span>
          )}
        </div>
      </div>

      {stats.isLinked ? (
        /* Device is linked */
        <div className="flex items-center justify-between bg-teal-50 rounded-xl px-4 py-3">
          <div className="text-sm text-teal-700">
            Cihaz bağlı. Son aktif:{' '}
            <span className="font-semibold">
              {stats.lastActive ? new Date(stats.lastActive).toLocaleDateString('tr-TR') : '—'}
            </span>
          </div>
          <button onClick={unlinkDevice} disabled={unlinking}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors ml-4 flex-shrink-0">
            <Unlink size={14} />
            {unlinking ? 'Kesiliyor...' : 'Bağlantıyı Kes'}
          </button>
        </div>
      ) : stats.linkCode && !codeExpired ? (
        /* Active link code waiting */
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Hasta bu kodu PelviQ mobil uygulamasına girsin. Kod{' '}
            <span className="font-semibold text-orange-600">
              {Math.ceil((new Date(stats.linkExpiresAt) - new Date()) / 86400000)} gün
            </span>{' '}
            geçerli.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">
              <span className="text-2xl font-bold tracking-[0.3em] text-gray-800">{stats.linkCode}</span>
              <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
                {copied ? <Check size={16} className="text-teal-600" /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={generateCode} disabled={generating}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 flex-shrink-0">
              <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      ) : (
        /* No code or expired */
        <div>
          {codeExpired && <p className="text-sm text-orange-500 mb-3">Önceki kodun süresi doldu. Yeni bir kod oluşturun.</p>}
          {!stats.linkCode && !stats.isLinked && <p className="text-sm text-gray-500 mb-3">Hastanın cihazını bağlamak için bağlantı kodu oluşturun.</p>}
          <button onClick={generateCode} disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition"
            style={{ backgroundColor: '#0d9488' }}>
            <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Oluşturuluyor...' : 'Bağlantı Kodu Oluştur'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Usage stats + chart ────────────────────────────────────────────────────────
function DeviceUsageSection({ deviceData }) {
  const { stats, sessions, dailyUsage } = deviceData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-sm">
          <div className="text-gray-500">{new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</div>
          <div className="font-bold text-teal-600">{payload[0].value} seans</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 mb-5">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Cihaz Kullanım Takibi</h2>
        <p className="text-xs text-gray-400 mt-0.5">Mobil uygulamadan gelen gerçek veriler</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Bugün', value: stats.today, unit: 'seans' },
          { label: 'Bu Hafta', value: stats.thisWeek, unit: 'seans' },
          { label: 'Toplam', value: stats.total, unit: 'seans' },
          { label: 'Seri', value: stats.streak, unit: 'gün' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="px-4 sm:px-6 py-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label} <span className="text-gray-300">/ {unit}</span></div>
          </div>
        ))}
      </div>

      {/* Bar chart — last 30 days */}
      <div className="px-4 sm:px-6 pt-5 pb-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Son 30 Gün</div>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">Henüz mobil uygulama verisi yok.</div>
        ) : (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={dailyUsage} barSize={8} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdfa' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {dailyUsage.map((entry) => (
                  <Cell key={entry.date} fill={entry.count > 0 ? '#0d9488' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent device sessions */}
      {sessions.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Son Kullanımlar</div>
          <div className="divide-y divide-gray-50">
            {sessions.slice(0, 10).map(s => (
              <div key={s.id} className="px-4 sm:px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Activity size={14} className="text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{s.protocol}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(s.startedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{s.duration} dk
                    {' · '}Yoğunluk {s.intensity}/10
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  {s.completedFully ? (
                    <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Tamamlandı</span>
                  ) : (
                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Yarıda Bırakıldı</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ClinicianPatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    const [patientRes, deviceRes] = await Promise.all([
      api.get(`/clinician/patients/${id}`),
      api.get(`/clinician/patients/${id}/device-sessions`),
    ]);
    if (patientRes.success) setPatient(patientRes.data);
    if (deviceRes.success) setDeviceData(deviceRes.data);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Bu seansı silmek istediğinizden emin misiniz?')) return;
    const res = await api.delete(`/clinician/patients/${id}/sessions/${sessionId}`);
    if (res.success) setPatient(p => ({ ...p, sessions: p.sessions.filter(s => s.id !== sessionId) }));
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Yükleniyor...</div>;
  if (!patient) return <div className="p-10 text-center text-gray-400">Hasta bulunamadı.</div>;

  return (
    <div className="p-4 sm:p-8">
      <Link to="/klinisyen/hastalar" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft size={16} /> Hastalara Dön
      </Link>

      {/* Patient Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 mr-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{patient.name}</h1>
            {patient.email && <div className="text-sm text-gray-400 truncate">{patient.email}</div>}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1.5 rounded-xl flex-shrink-0">
            <Activity size={14} />
            {patient.sessions?.length || 0} manuel seans
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
          {[
            { label: 'Cinsiyet', value: patient.gender || '—' },
            { label: 'Doğum Yılı', value: patient.birthYear || '—' },
            { label: 'Tanı', value: patient.diagnosis || '—' },
            { label: 'Eklenme', value: new Date(patient.createdAt).toLocaleDateString('tr-TR') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 sm:p-0 sm:bg-transparent">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-gray-900 font-medium sm:font-normal">{value}</div>
            </div>
          ))}
        </div>
        {patient.notes && <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">{patient.notes}</div>}
      </div>

      {/* Mobile device link */}
      {deviceData && (
        <DeviceLinkSection
          patientId={id}
          stats={deviceData.stats}
          onRefresh={fetchData}
        />
      )}

      {/* Device usage from mobile app */}
      {deviceData && (
        <DeviceUsageSection deviceData={deviceData} />
      )}

      {/* Manual sessions */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Manuel Seans Kayıtları</h2>
            <p className="text-xs text-gray-400 mt-0.5">Klinisyen tarafından eklenen seanslar</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: '#0d9488' }}>
            <Plus size={16} />
            <span className="hidden sm:inline">Seans Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>

        {!patient.sessions?.length ? (
          <div className="p-10 text-center text-gray-400">Henüz manuel seans kaydedilmemiş.</div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
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

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {patient.sessions.map(s => (
                <div key={s.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">{s.protocol}</span>
                    <button onClick={() => handleDeleteSession(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-2 flex-shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{new Date(s.date).toLocaleDateString('tr-TR')}</span>
                    <span>·</span>
                    <span>{s.duration} dk</span>
                    {s.notes && <><span>·</span><span className="truncate">{s.notes}</span></>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <AddSessionModal
          patientId={id}
          onClose={() => setShowModal(false)}
          onAdded={(s) => { setPatient(p => ({ ...p, sessions: [s, ...p.sessions] })); setShowModal(false); }}
        />
      )}
    </div>
  );
}
