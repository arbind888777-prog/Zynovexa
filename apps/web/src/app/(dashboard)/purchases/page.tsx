'use client';

import { useQuery } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BuyerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['buyer-dashboard'],
    queryFn: () => commerceApi.getBuyerDashboard().then(unwrapApiResponse),
  });

  const dashboard = data as any || {};
  const productAccesses = dashboard.products || dashboard.productAccesses || [];
  const courseEnrollments = dashboard.courses || dashboard.courseEnrollments || [];
  const recentPurchases = dashboard.recentPurchases || [];

  const handleDownload = async (productId: string) => {
    try {
      const res = await commerceApi.downloadProduct(productId);
      const d = res.data?.data || res.data;
      if (d?.assetUrl || d?.downloadUrl || d?.url) {
        window.open(d.assetUrl || d.downloadUrl || d.url, '_blank');
        if (d.downloadsRemaining !== undefined) {
          toast.success(`Download started. ${d.downloadsRemaining} downloads remaining.`);
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Download failed. Try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">📥 My Purchases</h1>
        <p className="text-slate-400 text-sm mt-1">Your purchased products and enrolled courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Products Owned</div>
          <div className="text-2xl font-bold text-purple-400">{productAccesses.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Courses Enrolled</div>
          <div className="text-2xl font-bold text-blue-400">{courseEnrollments.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Purchases</div>
          <div className="text-2xl font-bold text-emerald-400">{recentPurchases.length}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}
        </div>
      ) : productAccesses.length === 0 && courseEnrollments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg font-semibold text-white mb-2">No purchases yet</p>
          <p className="text-slate-400 text-sm">Explore creator stores to find digital products and courses.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Owned Products */}
          {productAccesses.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">📦 Owned Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productAccesses.map((access: any) => {
                  const product = access.product;
                  if (!product) return null;
                  return (
                    <div key={access.id} className="card p-5">
                      {product.coverImageUrl && (
                        <div className="h-28 rounded-lg mb-3 overflow-hidden bg-white/5">
                          <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="text-sm font-semibold text-white truncate mb-1">{product.title}</h3>
                      <p className="text-xs text-slate-400 mb-1">by {product.store?.name || product.creator?.name || 'Creator'}</p>
                      <button
                        onClick={() => handleDownload(product.id)}
                        className="w-full mt-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-opacity"
                      >
                        📥 Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enrolled Courses */}
          {courseEnrollments.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">📚 Enrolled Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseEnrollments.map((enrollment: any) => {
                  const course = enrollment.course;
                  if (!course) return null;
                  return (
                    <div key={enrollment.id} className="card p-5">
                      {course.coverImageUrl && (
                        <div className="h-28 rounded-lg mb-3 overflow-hidden bg-white/5">
                          <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="text-sm font-semibold text-white truncate mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-400 mb-1">by {course.store?.name || course.creator?.name || 'Creator'}</p>
                      <div className="mt-2 w-full h-2 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${enrollment.progressPercent || 0}%` }} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{enrollment.progressPercent || 0}% complete</p>
                      <Link
                        href={`/learn/${course.id}`}
                        className="w-full mt-3 py-2 rounded-lg text-sm font-semibold text-white text-center block"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        {enrollment.progressPercent > 0 ? '▶ Continue Learning' : '▶ Start Learning'}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
