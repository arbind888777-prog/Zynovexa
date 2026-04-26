'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

const TYPE_BADGES: Record<string, string> = {
  DIGITAL: '📁 Digital Download',
  COURSE: '🎓 Online Course',
  TEMPLATE: '📋 Template',
  EBOOK: '📖 Ebook',
  COACHING: '🎯 Coaching',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;
  const productId = params.productId as string;
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get(`/commerce/public/product/${productId}`)
      .then(res => {
        const d = res.data?.data || res.data;
        setProduct(d);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/${handle}/${productId}`);
      return;
    }

    router.push(`/checkout/${product.id}${product.type === 'COURSE' ? '?type=COURSE' : ''}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">Product not found</p>
          <Link href={`/${handle}`} className="text-purple-400 hover:text-purple-300 text-sm">← Back to Store</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const currency = product.currency || 'INR';

  return (
    <div className="min-h-screen hero-bg">
      {/* Top Bar */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${handle}`} className="text-sm text-slate-400 hover:text-white transition-colors">
            ← {product.creator?.name || handle}&apos;s Store
          </Link>
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
                <Link href="/signup" className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600">Sign Up</Link>
              </>
            ) : (
              <Link href="/purchases" className="text-sm text-slate-400 hover:text-white transition-colors">My Purchases</Link>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cover */}
          <div className="rounded-2xl overflow-hidden bg-white/5 aspect-[4/3]">
            {product.coverImageUrl ? (
              <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-7xl opacity-30">📦</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.type && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-3">
                {TYPE_BADGES[product.type] || product.type}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">{product.title}</h1>

            {product.creator && (
              <p className="text-sm text-slate-400 mb-4">
                by <span className="text-white font-medium">{product.creator.name}</span>
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">{formatMoneyFromMinor(product.price, currency)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-slate-500 line-through">{formatMoneyFromMinor(product.originalPrice, currency)}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs text-slate-400 bg-white/5">{tag}</span>
                ))}
              </div>
            )}

            {/* Buy Button */}
            <button onClick={handleBuyNow}
              className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50">
              Continue to Checkout
            </button>

            <p className="text-xs text-slate-500 text-center mt-3">
              Secure payment, promo code support, and instant access after purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-slate-500">
          Powered by <Link href="/" className="text-purple-400 hover:text-purple-300">Zynovexa</Link>
        </p>
      </div>
    </div>
  );
}
