import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, CalendarCheck, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ClinicianDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clinician/patients').then(res => {
      if (res.success) setPatients(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalSessions = patients.reduce((sum, p) => sum + (p._count?.sessions || 0), 0);
  const recent = patients.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hoş geldiniz, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Klinisyen portalınıza genel bakış</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { icon: Users, label: 'Toplam Hasta', value: loading ? '—' : patients.length, color: 'teal' },
          { icon: Activity, label: 'Toplam Seans', value: loading ? '—' : totalSessions, color: 'blue' },
          { icon: CalendarCheck, label: 'Bu Ay', value: loading ? '—' : patients.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 86400000)).length + ' yeni hasta', color: 'indigo' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
              <Icon size={20} className={`text-${color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Hastalar</h2>
          <Link to="/klinisyen/hastalar" className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
            Tümü <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Henüz hasta eklenmemiş.{' '}
            <Link to="/klinisyen/hastalar" className="text-teal-600 hover:underline">Hasta ekle</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(p => (
              <Link key={p.id} to={`/klinisyen/hastalar/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-400">{p.diagnosis || 'Tanı girilmedi'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-teal-600">{p._count?.sessions || 0} seans</div>
                  <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
