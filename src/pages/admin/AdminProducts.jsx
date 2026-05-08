import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Search, Package, Check } from 'lucide-react';
import api from '../../api/client';

const STATUS_OPTIONS = [
  { value: 'taslak', label: 'Taslak', color: 'bg-gray-100 text-gray-600' },
  { value: 'aktif', label: 'Aktif', color: 'bg-green-100 text-green-700' },
  { value: 'pasif', label: 'Pasif', color: 'bg-red-100 text-red-600' },
];

const EMPTY_FORM = { name: '', slug: '', description: '', price: '', comparePrice: '', categoryId: '', tags: '', stock: '0', lowStockThreshold: '5', variants: '', status: 'taslak', images: [] };

function slugify(str) {
  return str.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function ImageDropzone({ images, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter(f => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)).slice(0, 5 - images.length);
    if (valid.length === 0) return;
    setUploading(true);
    try {
      const res = await api.upload('/uploads/products', valid);
      if (res.success) onChange([...images, ...res.data.urls]);
    } catch (err) {
      alert('Yükleme hatası: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragging ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'}`}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Yükleniyor...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-600">Görselleri sürükleyin veya tıklayın</span>
            <span className="text-xs text-gray-400">Max 5 adet · JPEG, PNG, WebP · 5MB</span>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product ? {
    ...product,
    tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
    variants: Array.isArray(product.variants) ? JSON.stringify(product.variants) : '',
    comparePrice: product.comparePrice || '',
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        variants: (() => { try { return JSON.parse(form.variants || '[]'); } catch { return []; } })(),
      };
      const res = product ? await api.put(`/products/${product.id}`, payload) : await api.post('/products', payload);
      if (!res.success) throw new Error(res.error);
      onSave(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors';
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Ürün Adı *</label>
                <input className={inp} value={form.name} onChange={e => { set('name', e.target.value); if (!product) set('slug', slugify(e.target.value)); }} required placeholder="PelviCare Pro" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Slug *</label>
                <input className={inp} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="pelvicare-pro" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Açıklama</label>
              <textarea className={inp + ' resize-none'} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ürün açıklaması..." />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Fiyat (₺) *</label>
                <input type="number" step="0.01" min="0" className={inp} value={form.price} onChange={e => set('price', e.target.value)} required placeholder="4990" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Karşılaştırma Fiyatı (₺)</label>
                <input type="number" step="0.01" min="0" className={inp} value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} placeholder="6490" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Stok</label>
                <input type="number" min="0" className={inp} value={form.stock} onChange={e => set('stock', e.target.value)} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Kategori</label>
                <select className={inp} value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                  <option value="">Kategori seçin</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Durum</label>
                <select className={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Etiketler (virgülle ayırın)</label>
              <input className={inp} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="EMS, Pelvik Taban, Rehabilitasyon" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Görseller</label>
              <ImageDropzone images={form.images} onChange={imgs => set('images', imgs)} />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">İptal</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 hover:opacity-90 transition disabled:opacity-60"
              style={{ backgroundColor: '#0d9488' }}>
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
              {product ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | product
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 20, ...(search && { search }), ...(statusFilter && { status: statusFilter }) };
    const res = await api.get('/products', params);
    if (res.success) { setProducts(res.data); setMeta(res.meta || {}); }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get('/categories').then(res => { if (res.success) setCategories(res.data); });
  }, []);

  const handleSave = (product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = product; return next; }
      return [product, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    const res = await api.delete(`/products/${id}`);
    if (res.success) setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-500 text-sm mt-0.5">{meta.total || 0} ürün</p>
        </div>
        <button onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition"
          style={{ backgroundColor: '#0d9488' }}>
          <Plus size={16} />
          Yeni Ürün
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 transition-colors"
              placeholder="Ürün ara..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Tüm Durumlar</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Package size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ürün</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Fiyat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Stok</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Durum</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const s = STATUS_OPTIONS.find(o => o.value === p.status);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Package size={20} className="m-auto mt-2.5 text-gray-300" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-400">{p.category?.name || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{p.price.toLocaleString('tr-TR')} ₺</div>
                        {p.comparePrice && <div className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString('tr-TR')} ₺</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={p.stock <= p.lowStockThreshold ? 'text-red-600 font-bold' : 'text-gray-700'}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s?.color || 'bg-gray-100 text-gray-600'}`}>
                          {s?.label || p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setModal(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
              Önceki
            </button>
            <span className="text-sm text-gray-500">{page} / {meta.totalPages}</span>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition">
              Sonraki
            </button>
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
