import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/client';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null;
  const img = product.images?.[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-200" />
          </div>
        )}
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Stok Tükendi</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <div className="text-xs text-teal-600 font-medium mb-1">{product.category.name}</div>
        )}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold" style={{ color: '#1e3a5f' }}>{product.price.toLocaleString('tr-TR')} ₺</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">{product.comparePrice.toLocaleString('tr-TR')} ₺</span>
          )}
        </div>
        <button
          disabled={product.stock <= 0}
          onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, icon: '📦', variant: '', path: product.slug ? `/urun/${product.slug}` : '/magaza' })}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0d9488' }}
        >
          <ShoppingCart size={15} />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', sort: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 12, ...filters, ...(debouncedSearch && { search: debouncedSearch }) };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    const res = await api.get('/products', params);
    if (res.success) { setProducts(res.data); setMeta(res.meta || {}); }
    setLoading(false);
  }, [page, filters, debouncedSearch]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get('/categories').then(res => { if (res.success) setCategories(res.data); });
  }, []);

  useEffect(() => { setPage(1); }, [debouncedSearch, filters]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const clearFilters = () => { setFilters({ category: '', minPrice: '', maxPrice: '', sort: 'createdAt', order: 'desc' }); setSearch(''); };
  const activeFiltersCount = [filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  const inp = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>Ürünler</h1>
          <p className="text-gray-500 mt-1">{meta.total || 0} ürün bulundu</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Filtreler</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-teal-600 font-medium hover:underline">
                    Temizle ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Kategori</label>
                  <select className={inp} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                    <option value="">Tümü</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Fiyat Aralığı (₺)</label>
                  <div className="flex gap-2">
                    <input className={inp} type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                    <input className={inp} type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Sıralama</label>
                  <select className={inp} value={`${filters.sort}_${filters.order}`} onChange={e => { const [s, o] = e.target.value.split('_'); setFilter('sort', s); setFilter('order', o); }}>
                    <option value="createdAt_desc">En Yeni</option>
                    <option value="createdAt_asc">En Eski</option>
                    <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                    <option value="name_asc">İsim: A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Search + mobile filters */}
            <div className="flex gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors bg-white shadow-sm"
                  placeholder="Ürün ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button onClick={() => setFiltersOpen(o => !o)} className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={16} />
                Filtrele
                {activeFiltersCount > 0 && <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#0d9488' }}>{activeFiltersCount}</span>}
              </button>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">Filtreler</span>
                  <button onClick={() => setFiltersOpen(false)}><X size={18} className="text-gray-400" /></button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <select className={inp} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                    <option value="">Tüm Kategoriler</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input className={inp} type="number" placeholder="Min fiyat" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                  <input className={inp} type="number" placeholder="Max fiyat" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
                </div>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-teal-600 font-medium">Filtreleri Temizle</button>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-9 bg-gray-100 rounded-xl mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Package size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">Ürün bulunamadı</p>
                <p className="text-sm mt-1">Farklı filtreler deneyin</p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="mt-4 text-sm font-semibold" style={{ color: '#0d9488' }}>Filtreleri Temizle</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition shadow-sm">
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium shadow-sm">
                  {page} / {meta.totalPages}
                </span>
                <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
