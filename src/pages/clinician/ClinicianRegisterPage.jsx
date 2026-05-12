import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PelvicAirLogotype } from '../../components/PelvicAirLogo';

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

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

export default function ClinicianRegisterPage() {
  const { registerClinician } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', specialty: '', license: '', institution: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

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
      await registerClinician(form);
      navigate('/giris', { state: { message: 'Hesabınız oluşturuldu. Giriş yapabilirsiniz.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6"><PelvicAirLogotype iconSize={32} /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Klinisyen Hesabı Oluştur</h1>
          <p className="text-gray-500 mt-1 text-sm">Sağlık profesyonelleri için ücretsiz portal erişimi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Soyad *</label>
                <input type="text" className={inp} placeholder="Dr. Ayşe Yılmaz" value={form.name} onChange={set('name')} required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">E-posta *</label>
                <input type="email" className={inp} placeholder="doktor@klinik.com" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={inp + ' pr-10'} placeholder="••••••••" value={form.password} onChange={set('password')} required />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Şifre Tekrar *</label>
                <input type="password" className={inp} placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
                {form.confirm && form.password !== form.confirm && <p className="text-red-500 text-xs mt-1">Şifreler eşleşmiyor</p>}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Profesyonel Bilgiler</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Uzmanlık Alanı</label>
                  <input type="text" className={inp} placeholder="Ürojinekoloji" value={form.specialty} onChange={set('specialty')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Diploma / Lisans No</label>
                  <input type="text" className={inp} placeholder="123456" value={form.license} onChange={set('license')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Kurum / Klinik</label>
                  <input type="text" className={inp} placeholder="Ankara Üniversitesi" value={form.institution} onChange={set('institution')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Telefon</label>
                  <input type="tel" className={inp} placeholder="0532 000 00 00" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
              style={{ backgroundColor: '#0d9488' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} />Klinisyen Hesabı Oluştur</>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link to="/giris" className="font-semibold hover:underline" style={{ color: '#0d9488' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
