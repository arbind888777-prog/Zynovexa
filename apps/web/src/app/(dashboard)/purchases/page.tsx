'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import { toast } from 'sonner';
import Link from 'next/link';

type Tab = 'products' | 'courses';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
      />
    </div>
  );
}

function EmptyState({ type }: { type: Tab }) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">{type === 'products' ? '📦' : '🎓'}</p>
      <p className="text-lg font-semibold text-white mb-2">
        No {type === 'products' ? 'products' : 'courses'} purchased yet
      </p>
      <p className="text-slate-400 text-sm">
        Explore creator stores and buy digital products or courses.
      </p>
    </div>
  );
}

export default function PurchasesPage() {
  const [tab, setTab] = useState<Tab>('products');

  const { data, isLoading } = useQuery({
    queryKey: ['buyer-dashboard'],
    queryFn: () => commerceApi.getBuyerDashboard().then(unwrapApiResponse),
  });

  const products = (data as any)?.products || [];
  const courses = (data as any)?.courses || [];

  const handleDownload = async (productId: string, title: string) => {
    try {
      const res = await commerceApi.downloadProduct(productId);
      const payload = unwrapApiResponse<any>(res);
      if (payload?.assetUrl) {
        window.open(payload.assetUrl, '_blank');
        toast.success(`Downloading "${title}" — ${payload.downloadsRemaining} downloads remaining`);
      } else {
        toast.error('Download URL not available. Contact support.');
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Download failed';
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">📚 My Library</h1>
        <p className="text-slate-400 text-sm mt-1">All your purchased products and enrolled courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-xs text-slate-400 mb-1">Products Owned</div>
          <div className="text-2xl font-bold text-white">{products.length}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-xs text-slate-400 mb-1">Courses Enrolled</div>
          <div className="text-2xl font-bold text-purple-400">{courses.length}</div>
        </div>
        <div className="rounded-2xl p-4 col-span-2 sm:col-span-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-xs text-slate-400 mb-1">Avg Progress</div>
          <div className="text-2xl font-bold text-emerald-400">
            {courses.length
              ? Math.round(courses.reduce((s: number, c: any) => s + (c.progressPercent || 0), 0) / courses.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['products', 'courses'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={{
              background: tab === t ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--surface)',
              color: tab === t ? '#fff' : '#94a3b8',
              border: '1px solid var(--border)',
            }}
          >
            {t === 'products' ? '📦' : '🎓'} {t === 'products' ? 'Products' : 'Courses'}{' '}
            <span className="opacity-60">({t === 'products' ? products.length : courses.length})</span>
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl h-52 animate-pulse" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      )}

      {/* Products Tab */}
      {!isLoading && tab === 'products' && (
        products.length === 0 ? <EmptyState type="products" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((access: any) => {
              const product = access.product;
              if (!product) return null;
              const remaining = access.downloadLimit - access.downloadCount;
              return (
                <div
                  key={access.id}
                  className="rounded-2xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  {/* Cover */}
                  {product.coverImageUrl && (
                    <div className="h-28 rounded-xl overflow-hidden bg-white/5">
                      <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">
                      {product.store?.name} · by {product.creator?.name}
                    </p>
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">{product.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Downloads info */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>📥 {access.downloadCount} downloaded</span>
                    <span className={remaining <= 1 ? 'text-amber-400' : 'text-slate-400'}>
                      {remaining} remaining
                    </span>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(product.id, product.title)}
                    disabled={remaining <= 0}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  >
                    {remaining <= 0 ? '⛔ Limit Reached' : '⬇️ Download'}
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Courses Tab */}
      {!isLoading && tab === 'courses' && (
        courses.length === 0 ? <EmptyState type="courses" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((enrollment: any) => {
              const course = enrollment.course;
              if (!course) return null;
              const progress = enrollment.progressPercent || 0;
              const totalLessons = course.lessons?.length || 0;
              return (
                <div
                  key={enrollment.id}
                  className="rounded-2xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  {/* Cover */}
                  {course.coverImageUrl && (
                    <div className="h-28 rounded-xl overflow-hidden bg-white/5">
                      <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">
                      {course.store?.name} · by {course.creator?.name}
                    </p>
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">{course.title}</h3>
                    <p className="text-xs text-slate-400">{totalLessons} lessons</p>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-purple-400 font-semibold">{progress}%</span>
                    </div>
                    <ProgressBar percent={progress} />
                  </div>

                  {/* Button */}
                  <Link
                    href={`/learn/${course.id}`}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                    style={{ background: progress === 100 ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  >
                    {progress === 100 ? '✅ Completed' : progress > 0 ? '▶️ Continue' : '🚀 Start Course'}
                  </Link>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
