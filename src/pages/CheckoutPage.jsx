import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Lock, ChevronRight, CreditCard, Building2 } from 'lucide-react';
import api from '../api/client';

const STEPS = ['Teslimat', 'Ödeme', 'Onay'];

function OrderSummary({ items, total }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">Sipariş Özeti</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white border border-gray-100">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
              <div className="text-xs text-gray-500">{item.variant} · {item.qty} adet</div>
            </div>
            <div className="text-sm font-bold text-gray-900 flex-shrink-0">
              {(item.price * item.qty).toLocaleString('tr-TR')} ₺
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Ara Toplam</span>
          <span>{total.toLocaleString('tr-TR')} ₺</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Kargo</span>
          <span className="text-teal-600 font-medium">Ücretsiz</span>
        </div>
        <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t border-gray-200">
          <span>Toplam</span>
          <span style={{ color: '#1e3a5f' }}>{total.toLocaleString('tr-TR')} ₺</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Lock size={12} />
        <span>256-bit SSL şifrelemeli güvenli ödeme</span>
      </div>
    </div>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            i < step ? 'bg-teal-500 text-white' :
            i === step ? 'text-white' : 'bg-gray-200 text-gray-400'
          }`} style={i === step ? { backgroundColor: '#1e3a5f' } : {}}>
            {i < step ? <CheckCircle size={14} /> : i + 1}
          </div>
          <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-gray-900' : i < step ? 'text-teal-600' : 'text-gray-400'}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <ChevronRight size={14} className="text-gray-300 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function CheckoutPage() {
  const { items, total, setSidebarOpen, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [orderId, setOrderId] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const [delivery, setDelivery] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', district: '', zip: '' });
  const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg font-medium">Sepetiniz boş.</p>
        <button onClick={() => navigate('/urun/pelvicair')} className="px-6 py-2.5 rounded-xl text-white font-semibold" style={{ backgroundColor: '#0d9488' }}>
          Ürünlere Git
        </button>
      </div>
    );
  }

  const validateDelivery = () => {
    const e = {};
    if (!delivery.firstName.trim()) e.firstName = 'Ad gerekli';
    if (!delivery.lastName.trim()) e.lastName = 'Soyad gerekli';
    if (!delivery.email.includes('@')) e.email = 'Geçerli e-posta girin';
    if (delivery.phone.replace(/\D/g, '').length < 10) e.phone = 'Geçerli telefon girin';
    if (!delivery.address.trim()) e.address = 'Adres gerekli';
    if (!delivery.city.trim()) e.city = 'Şehir gerekli';
    if (!delivery.district.trim()) e.district = 'İlçe gerekli';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    if (payMethod !== 'card') return true;
    const e = {};
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Geçerli kart numarası girin';
    if (!card.holder.trim()) e.holder = 'Kart üzerindeki ad gerekli';
    if (card.expiry.length < 5) e.expiry = 'Son kullanma tarihi gerekli';
    if (card.cvv.length < 3) e.cvv = 'CVV gerekli';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDeliveryNext = () => {
    if (validateDelivery()) { setErrors({}); setStep(1); }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!validateCard()) return;
    setErrors({});
    setOrderLoading(true);
    setOrderError('');
    try {
      const mappedItems = items.map(item => ({
        productId: item.id || null,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        variant: item.variant || null,
      }));
      const res = await api.post('/orders', { items: mappedItems, address: delivery });
      if (!res.success) throw new Error(res.error);
      setOrderId(res.data.id);
      clearCart();
      setStep(2);
    } catch (err) {
      setOrderError(err.message || 'Sipariş oluşturulurken hata oluştu');
    } finally {
      setOrderLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-100 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Sipariş Tamamla</h1>
        </div>

        <StepIndicator step={step} />

        {step === 2 ? (
          /* ── ONAY ── */
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f0fdfa' }}>
              <CheckCircle size={44} style={{ color: '#0d9488' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e3a5f' }}>Siparişiniz Alındı!</h2>
            <p className="text-gray-500 mb-6">
              Sipariş numaranız: <span className="font-bold text-gray-900">#{orderId ? orderId.slice(-8).toUpperCase() : '—'}</span><br />
              Onay e-postası <span className="font-medium">{delivery.email}</span> adresine gönderildi.
            </p>
            <div className="bg-teal-50 rounded-2xl p-5 text-left mb-8 border border-teal-100">
              <div className="text-sm font-semibold text-teal-800 mb-3">Teslimat Bilgisi</div>
              <p className="text-sm text-gray-700">{delivery.firstName} {delivery.lastName}</p>
              <p className="text-sm text-gray-500">{delivery.address}, {delivery.district} / {delivery.city}</p>
              <p className="text-sm text-gray-500 mt-1">📦 Tahmini teslimat: 2-4 iş günü</p>
            </div>
            <button
              onClick={() => { setSidebarOpen(false); navigate('/'); }}
              className="px-8 py-3 rounded-xl font-bold text-white hover:opacity-90 transition"
              style={{ backgroundColor: '#0d9488' }}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── SOL: FORM ── */}
            <div className="lg:col-span-2 space-y-6">

              {step === 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold mb-5" style={{ color: '#1e3a5f' }}>Teslimat Bilgileri</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Ad *</label>
                      <input className={inputCls('firstName')} placeholder="Ahmet" value={delivery.firstName}
                        onChange={e => setDelivery(d => ({ ...d, firstName: e.target.value }))} />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Soyad *</label>
                      <input className={inputCls('lastName')} placeholder="Yılmaz" value={delivery.lastName}
                        onChange={e => setDelivery(d => ({ ...d, lastName: e.target.value }))} />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">E-posta *</label>
                      <input className={inputCls('email')} placeholder="ahmet@email.com" type="email" value={delivery.email}
                        onChange={e => setDelivery(d => ({ ...d, email: e.target.value }))} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Telefon *</label>
                      <input className={inputCls('phone')} placeholder="0532 000 00 00" type="tel" value={delivery.phone}
                        onChange={e => setDelivery(d => ({ ...d, phone: e.target.value }))} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Adres *</label>
                      <textarea className={inputCls('address') + ' resize-none'} rows={2} placeholder="Mahalle, sokak, bina no, daire"
                        value={delivery.address} onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))} />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Şehir *</label>
                      <input className={inputCls('city')} placeholder="İstanbul" value={delivery.city}
                        onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">İlçe *</label>
                      <input className={inputCls('district')} placeholder="Kadıköy" value={delivery.district}
                        onChange={e => setDelivery(d => ({ ...d, district: e.target.value }))} />
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Posta Kodu</label>
                      <input className={inputCls('zip')} placeholder="34710" value={delivery.zip}
                        onChange={e => setDelivery(d => ({ ...d, zip: e.target.value }))} />
                    </div>
                  </div>
                  <button
                    onClick={handleDeliveryNext}
                    className="mt-6 w-full py-3.5 rounded-xl font-bold text-white hover:opacity-90 active:scale-[0.98] transition"
                    style={{ backgroundColor: '#0d9488' }}
                  >
                    Ödeme Adımına Geç →
                  </button>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handlePaySubmit} className="space-y-4">
                  {/* Ödeme Yöntemi Seçimi */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-5" style={{ color: '#1e3a5f' }}>Ödeme Yöntemi</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button type="button" onClick={() => setPayMethod('card')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${payMethod === 'card' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <CreditCard size={20} className={payMethod === 'card' ? 'text-teal-600' : 'text-gray-400'} />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Kredi / Banka Kartı</div>
                          <div className="text-xs text-gray-400">Visa, Mastercard, Troy</div>
                        </div>
                      </button>
                      <button type="button" onClick={() => setPayMethod('transfer')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${payMethod === 'transfer' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <Building2 size={20} className={payMethod === 'transfer' ? 'text-teal-600' : 'text-gray-400'} />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Havale / EFT</div>
                          <div className="text-xs text-gray-400">Banka havalesi ile öde</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Kart Formu */}
                  {payMethod === 'card' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">Kart Bilgileri</h3>

                      {/* Kart Önizleme */}
                      <div className="rounded-2xl p-5 mb-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)' }}>
                        <div className="text-xs opacity-60 mb-6">PelvicAir Güvenli Ödeme</div>
                        <div className="text-lg font-mono tracking-widest mb-4">
                          {card.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="text-xs opacity-60">Kart Sahibi</div>
                            <div className="font-medium uppercase">{card.holder || 'AD SOYAD'}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-60">Son Kullanma</div>
                            <div className="font-medium">{card.expiry || 'AA/YY'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Kart Numarası *</label>
                          <input className={inputCls('number')} placeholder="0000 0000 0000 0000"
                            value={card.number}
                            onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))} />
                          {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Kart Üzerindeki Ad *</label>
                          <input className={inputCls('holder')} placeholder="AHMET YILMAZ"
                            value={card.holder}
                            onChange={e => setCard(c => ({ ...c, holder: e.target.value.toUpperCase() }))} />
                          {errors.holder && <p className="text-red-500 text-xs mt-1">{errors.holder}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Son Kullanma (AA/YY) *</label>
                            <input className={inputCls('expiry')} placeholder="12/28"
                              value={card.expiry}
                              onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} />
                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">CVV *</label>
                            <input className={inputCls('cvv')} placeholder="•••" maxLength={4} type="password"
                              value={card.cvv}
                              onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Havale Bilgileri */}
                  {payMethod === 'transfer' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">Banka Hesap Bilgileri</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          { label: 'Banka', value: 'Ziraat Bankası' },
                          { label: 'Hesap Adı', value: 'PelvicAir Medikal A.Ş.' },
                          { label: 'IBAN', value: 'TR00 0001 0001 0000 0000 0000 00' },
                          { label: 'Açıklama', value: 'Ad Soyad + Sipariş' },
                        ].map(row => (
                          <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 font-medium">{row.label}</span>
                            <span className="font-semibold text-gray-900 text-right">{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                        ⚠️ Havale açıklamasına sipariş numaranızı yazmayı unutmayın. Ödeme onaylandıktan sonra siparişiniz kargoya verilir (1-2 iş günü).
                      </p>
                    </div>
                  )}

                  {orderError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                      {orderError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(0)}
                      className="px-5 py-3.5 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition">
                      ← Geri
                    </button>
                    <button type="submit" disabled={orderLoading}
                      className="flex-1 py-3.5 rounded-xl font-bold text-white hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ backgroundColor: '#0d9488' }}>
                      {orderLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><Lock size={16} />Siparişi Tamamla · {total.toLocaleString('tr-TR')} ₺</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── SAĞ: ÖZET ── */}
            <div className="lg:col-span-1">
              <OrderSummary items={items} total={total} />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {['60 Gün\nİade', 'Ücretsiz\nKargo', '2 Yıl\nGaranti'].map(t => (
                  <div key={t} className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 whitespace-pre-line leading-tight">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
