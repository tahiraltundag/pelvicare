import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password, form.rememberMe);
      await mergeGuestCart();
      if (user.role === 'clinician') navigate('/klinisyen/panel', { replace: true });
      else navigate(user.role === 'user' ? from : '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

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
          <h1 className="text-2xl font-bold text-gray-900">Giriş Yapın</h1>
          <p className="text-gray-500 mt-1 text-sm">Hesabınıza erişmek için giriş yapın</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">E-posta</label>
              <input
                type="email"
                className={inp}
                placeholder="ornek@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={inp + ' pr-10'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-teal-600"
                  checked={form.rememberMe} onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))} />
                <span className="text-sm text-gray-600">Beni hatırla</span>
              </label>
              <Link to="/sifremi-unuttum" className="text-sm font-medium" style={{ color: '#0d9488' }}>
                Şifremi Unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
              style={{ backgroundColor: '#0d9488' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Giriş Yap
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabınız yok mu?{' '}
          <Link to="/kayit" className="font-semibold hover:underline" style={{ color: '#0d9488' }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
