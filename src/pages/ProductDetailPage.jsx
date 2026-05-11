import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft, CheckCircle, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api, { getImageUrl } from '../api/client';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/products/${slug}`)
      .then(res => {
        if (res.success) {
          setProduct(res.data);
          const variants = res.data.variants || [];
          if (variants.length > 0) {
            const first = variants[0];
            setSelectedVariant(typeof first === 'string' ? first : first.value || first.name || '');
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Package size={64} className="text-gray-200 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Ürün Bulunamadı</h1>
      <p className="text-gray-500 mb-6">Bu ürün mevcut değil veya kaldırılmış olabilir.</p>
      <button
        onClick={() => navigate('/magaza')}
        className="px-6 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition"
        style={{ backgroundColor: '#0d9488' }}
      >
        Mağazaya Dön
      </button>
    </div>
  );

  const images = product.images || [];
  const variants = product.variants || [];
  const tags = product.tags || [];
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: images[0] ? null : '📦',
      image: images[0] ? getImageUrl(images[0]) : null,
      variant: selectedVariant,
      path: `/urun/${product.slug}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Geri Dön
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Images */}
            <div className="bg-gray-50 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 mb-3 flex items-center justify-center">
                    <img
                      src={getImageUrl(images[activeImage])}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => setActiveImage(i => (i + 1) % images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            activeImage === i ? 'border-teal-500 scale-95' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                  <Package size={80} className="text-gray-200" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 lg:p-8 flex flex-col gap-4">
              {product.category && (
                <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.comparePrice.toLocaleString('tr-TR')} ₺
                  </span>
                )}
                {discount && (
                  <span className="text-sm font-bold text-white bg-red-500 px-2.5 py-0.5 rounded-full">
                    %{discount} indirim
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Varyant</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => {
                      const val = typeof v === 'string' ? v : v.value || v.name || String(i);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(val)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                            selectedVariant === val
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <CheckCircle size={15} /> Stokta var
                    <span className="text-gray-400 font-normal">({product.stock} adet)</span>
                  </span>
                ) : (
                  <span className="text-sm text-red-500 font-medium">Stok tükendi</span>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to cart */}
              <div className="mt-auto pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    added ? 'bg-green-500' : 'hover:opacity-90 active:scale-[0.98]'
                  }`}
                  style={added ? {} : { backgroundColor: '#0d9488' }}
                >
                  <ShoppingCart size={18} />
                  {added ? 'Sepete Eklendi!' : 'Sepete Ekle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
