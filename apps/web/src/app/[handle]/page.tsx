'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  type: string;
  price: number;
  originalPrice?: number;
  coverImageUrl?: string;
  tags: string[];
  totalSales: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  coverImageUrl?: string;
  _count: { lessons: number; enrollments: number };
}

interface Creator {
  name: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  isVerified: boolean;
}

interface StoreData {
  creator: Creator;
  store: { id: string; name: string; slug: string; description?: string; logoUrl?: string; bannerUrl?: string };
  products: Product[];
  courses: Course[];
}

const TYPE_BADGES: Record<string, string> = {
  DIGITAL: '📁 Digital',
  COURSE: '🎓 Course',
  TEMPLATE: '📋 Template',
  EBOOK: '📖 Ebook',
  COACHING: '🎯 Coaching',
};

export default function CreatorStorePage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'products' | 'courses'>('products');

  useEffect(() => {
    api.get(`/commerce/public/handle/${handle}`)
      .then(res => {
        const d = res.data?.data || res.data;
        setData(d);
      })
      .catch(() => setError('not_found'))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">Creator not found</p>
          <p className="text-slate-400 text-sm mb-6">This page doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const { creator, store, products, courses } = data;

  return (
    <div className="min-h-screen hero-bg">
      {/* Top Bar */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">zynovexa.com/{creator.handle}</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Banner */}
      {store.bannerUrl && (
        <div className="h-48 md:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${store.bannerUrl})` }}>
          <div className="w-full h-full bg-black/40" />
        </div>
      )}

      {/* Creator Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 text-center">
        <div className={store.bannerUrl ? '-mt-20 relative z-10' : ''}>
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} alt={creator.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-purple-500/40 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {creator.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{creator.name}</h1>
            {creator.isVerified && <span className="text-blue-400 text-lg" title="Verified Creator">✓</span>}
          </div>
          <p className="text-sm text-slate-500 mb-2">@{creator.handle}</p>
          {creator.bio && <p className="text-slate-400 max-w-lg mx-auto text-sm mb-4">{creator.bio}</p>}

          {/* Social Links */}
          {creator.socialLinks && Object.keys(creator.socialLinks).length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-4">
              {Object.entries(creator.socialLinks).map(([platform, url]) => (
                url && <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 text-sm capitalize transition-colors">
                  {platform}
                </a>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>{products.length + courses.length} Products</span>
            <span>{products.reduce((s, p) => s + p.totalSales, 0)} Sales</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {courses.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl mx-auto w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <button onClick={() => setTab('products')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'products' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Products ({products.length})
            </button>
            <button onClick={() => setTab('courses')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'courses' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              Courses ({courses.length})
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {tab === 'products' && (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-slate-400">No products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="card card-hover overflow-hidden group">
                  <div className="h-44 bg-white/5 relative">
                    {product.coverImageUrl ? (
                      <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">📦</span>
                      </div>
                    )}
                    {product.type && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                        {TYPE_BADGES[product.type] || product.type}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{product.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{product.shortDescription || product.description}</p>
                    {product.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-white/5">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">₹{(product.price / 100).toFixed(0)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-slate-500 line-through">₹{(product.originalPrice / 100).toFixed(0)}</span>
                        )}
                      </div>
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
      )}

      {/* Courses Grid */}
      {tab === 'courses' && (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎓</p>
              <p className="text-slate-400">No courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="card card-hover overflow-hidden">
                  <div className="h-44 bg-white/5 relative">
                    {course.coverImageUrl ? (
                      <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">🎓</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                      🎓 Course
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{course.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{course.shortDescription || course.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>📚 {course._count.lessons} lessons</span>
                      <span>👥 {course._count.enrollments} enrolled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">₹{(course.price / 100).toFixed(0)}</span>
                      <Link href={`/checkout/${course.id}?type=COURSE`}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buyer Login Box */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="card p-8 text-center max-w-md mx-auto">
          <p className="text-lg font-semibold text-white mb-2">Already purchased?</p>
          <p className="text-sm text-slate-400 mb-4">Login to access your downloads and courses</p>
          <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            Login to Access
          </Link>
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
