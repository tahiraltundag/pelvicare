import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'En az 8 karakter', ok: password.length >= 8 },
    { label: 'Büyük harf', ok: /[A-Z]/.test(password) },
    { label: 'Küçük harf', ok: /[a-z]/.test(password) },
    { label: 'Rakam', ok: /[0-9]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 grid grid-cols-2 gap-1">
      {checks.map(c => (
        <div key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? 'text-teal-600' : 'text-gray-400'}`}>
          <Check size={10} className={c.ok ? 'opacity-100' : 'opacity-30'} />
          {c.label}
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Şifreler eşleşmiyor'); return; }
    if (form.password.length < 8) { setError('Şifre en az 8 karakter olmalı'); return; }
    if (!/[A-Z]/.test(form.password)) { setError('Şifre en az bir büyük harf içermeli'); return; }
    if (!/[a-z]/.test(form.password)) { setError('Şifre en az bir küçük harf içermeli'); return; }
    if (!/[0-9]/.test(form.password)) { setError('Şifre en az bir rakam içermeli'); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
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
              Pelvic<span style={{ color: '#0d9488' }}>Air</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h1>
          <p className="text-gray-500 mt-1 text-sm">PelvicAir'e ücretsiz kayıt olun</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Soyad</label>
              <input type="text" className={inp} placeholder="Ahmet Yılmaz" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoComplete="name" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">E-posta</label>
              <input type="email" className={inp} placeholder="ornek@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoComplete="email" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={inp + ' pr-10'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre Tekrar</label>
              <input type="password" className={inp} placeholder="••••••••" value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required autoComplete="new-password" />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-red-500 text-xs mt-1">Şifreler eşleşmiyor</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
              style={{ backgroundColor: '#0d9488' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} />Kayıt Ol</>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link to="/giris" className="font-semibold hover:underline" style={{ color: '#0d9488' }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
