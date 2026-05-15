import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../api/client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Geçersiz Bağlantı</h2>
          <p className="text-gray-500 text-sm mb-6">Bu şifre sıfırlama bağlantısı geçersiz veya eksik.</p>
          <Link to="/sifremi-unuttum" className="text-teal-600 font-semibold hover:underline">
            Yeni bağlantı talep et
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      if (!res.success) throw new Error(res.error);
      setDone(true);
      setTimeout(() => navigate('/giris'), 3000);
    } catch (err) {
      setError(err.message || 'Şifre sıfırlanamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>
              Pelvi<span style={{ color: '#0d9488' }}>Care</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Şifre Belirle</h1>
          <p className="text-gray-500 mt-1 text-sm">En az 8 karakter, büyük harf ve rakam içermelidir.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Şifreniz Güncellendi</h3>
              <p className="text-gray-500 text-sm">Giriş sayfasına yönlendiriliyorsunuz…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Yeni Şifre</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
                    placeholder="En az 8 karakter"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre Tekrar</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
                    placeholder="Şifrenizi tekrar girin"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#0d9488' }}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Şifremi Güncelle'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/giris" className="text-sm font-medium" style={{ color: '#0d9488' }}>
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
