import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviews } from '../data/product';

const extendedReviews = [
  ...reviews,
  { name: 'Selin A.', location: 'Eskişehir', rating: 5, date: 'Mart 2026', text: 'Aşırı aktif mesane için kullandım. 4 haftada gece kalkmalarım ikiden bire düştü. Mobil uygulama takibi çok motivasyonumu artırdı.', verified: true },
  { name: 'Gül Y.', location: 'Adana', rating: 5, date: 'Şubat 2026', text: 'Postpartum rehabilitasyon için mükemmel. Fizyoterapiste her hafta gitmek yerine evde yapabilmek büyük avantaj. 6 haftada belirgin iyileşme.', verified: true },
  { name: 'Ahmet K.', location: 'Gaziantep', rating: 4, date: 'Ocak 2026', text: 'Erken boşalma için 8 hafta kullandım. Sonuçlar tatmin edici. Gizlilikle evde kullanabilmek psikolojik baskıyı da azalttı.', verified: true },
  { name: 'Meral T.', location: 'Samsun', rating: 5, date: 'Nisan 2026', text: 'Dismenore için kullanıyorum. Artık her adet döneminde ağrı kesici almak zorunda kalmıyorum. Gerçekten işe yarıyor.', verified: true },
  { name: 'Leyla B.', location: 'Trabzon', rating: 5, date: 'Ocak 2026', text: 'Menopoz sonrası inkontinans için başladım. 3 haftada fark ettim. Artık dışarı çıkarken endişelenmiyorum.', verified: true },
  { name: 'Osman S.', location: 'Diyarbakır', rating: 5, date: 'Şubat 2026', text: 'Prostatektomi sonrası 6. haftada başladım. 3 ay sonra pad kullanmıyorum. Ürolog da sonuçlardan çok memnun.', verified: true },
];

const topics = [
  { label: 'Tümü', filter: null },
  { label: 'İdrar Kaçırma', filter: 'idrar' },
  { label: 'Dismenore', filter: 'dismenore' },
  { label: 'Erkek', filter: 'erkek' },
  { label: 'Postpartum', filter: 'postpartum' },
];

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-gray-600">{stars}</span>
      <Star size={12} className="fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#0d9488' }}></div>
      </div>
      <span className="w-6 text-gray-500">{count}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState(null);
  const total = extendedReviews.length;
  const avg = (extendedReviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);

  return (
    <div>
      {/* Hero */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Kullanıcı Yorumları</h1>
          <p className="text-blue-200 text-lg">Gerçek kullanıcılar, gerçek sonuçlar.</p>
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-3">
            <StarRating rating={5} size={20} />
            <span className="text-2xl font-bold">{avg}/5</span>
            <span className="text-blue-300">· {total} değerlendirme</span>
          </div>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-8 items-center">
            <div className="text-center">
              <div className="text-6xl font-bold" style={{ color: '#1e3a5f' }}>{avg}</div>
              <StarRating rating={5} size={18} />
              <div className="text-sm text-gray-500 mt-1">{total} değerlendirme</div>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = extendedReviews.filter((r) => r.rating === s).length;
                return <RatingBar key={s} stars={s} count={count} total={total} />;
              })}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">%{Math.round((extendedReviews.filter(r=>r.rating>=4).length/total)*100)}</div>
              <div className="text-sm text-gray-500">4+ yıldız</div>
              <div className="mt-3 text-3xl font-bold" style={{ color: '#1e3a5f' }}>60 Gün</div>
              <div className="text-sm text-gray-500">Para İade Garantisi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Filters */}
      <section className="py-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.label}
                onClick={() => setActiveFilter(t.filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === t.filter
                    ? 'text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'
                }`}
                style={activeFilter === t.filter ? { backgroundColor: '#0d9488' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedReviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ Doğrulanmış
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-400">🇹🇷 {review.location} · {review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🛡</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a5f' }}>60 Gün Para İade Garantisi</h3>
          <p className="text-gray-500 text-sm">Memnun kalmazsanız, hiçbir soru sormadan tam iade yapıyoruz. Risk yok.</p>
        </div>
      </section>
    </div>
  );
}
