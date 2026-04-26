'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import Link from 'next/link';

interface StoreProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  coverImageUrl?: string;
  status: string;
}

interface StoreData {
  store: { id: string; name: string; slug: string; currency?: string; description?: string; logoUrl?: string };
  products: StoreProduct[];
}

export default function StorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/commerce/public/stores/${slug}`)
      .then(res => {
        const d = res.data?.data || res.data;
        setData(d);
      })
      .catch(() => setError('Store not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !data?.store) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">🏪</p>
          <p className="text-xl font-bold text-white mb-2">Store not found</p>
          <p className="text-slate-400 text-sm mb-6">This store doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const { store, products } = data;
  const published = products.filter(p => p.status === 'PUBLISHED');
  const currency = store.currency || 'INR';

  return (
    <div className="min-h-screen hero-bg">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
        {store.logoUrl ? (
          <img src={store.logoUrl} alt={store.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-purple-500/30" />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {store.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{store.name}</h1>
        {store.description && <p className="text-slate-400 max-w-lg mx-auto">{store.description}</p>}
        <div className="mt-4 text-sm text-slate-500">{published.length} product{published.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Products Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {published.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-slate-400">This store has no products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map(product => (
              <div key={product.id} className="card card-hover overflow-hidden">
                {/* Cover */}
                <div className="h-44 bg-white/5 relative">
                  {product.coverImageUrl ? (
                    <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-30">📦</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white mb-1 truncate">{product.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">{formatMoneyFromMinor(product.price, product.currency || currency)}</span>
                    <Link href={`/checkout/${product.id}`}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
