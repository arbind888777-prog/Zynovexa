'use client';

import { useQuery } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import Link from 'next/link';

export default function RevenueAnalyticsPage() {
  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ['commerce-revenue', 90],
    queryFn: () => commerceApi.getRevenue(90).then(unwrapApiResponse),
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => commerceApi.getCreatorProducts().then(unwrapApiResponse),
  });

  const rev = revenue as any || {};
  const totalRevenue = rev.totalRevenue || 0;
  const totalSales = rev.totalSales || 0;
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const recentPurchases = rev.recentPurchases || [];
  const productList = (Array.isArray(products) ? products : (products as any)?.products || []) as any[];

  // Sort products by revenue
  const topProducts = [...productList]
    .sort((a: any, b: any) => (b.revenueTotal || 0) - (a.revenueTotal || 0))
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">💰 Revenue & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Track your product sales, revenue, and performance</p>
        </div>
        <Link href="/products"
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
          ← Products
        </Link>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-2xl mb-2">💵</div>
          <div className="text-xs text-slate-400 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-400">
            {loadingRevenue ? '...' : `$${(totalRevenue / 100).toFixed(2)}`}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-xs text-slate-400 mb-1">Total Sales</div>
          <div className="text-2xl font-bold text-purple-400">
            {loadingRevenue ? '...' : totalSales}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-xs text-slate-400 mb-1">Avg Order Value</div>
          <div className="text-2xl font-bold text-pink-400">
            {loadingRevenue ? '...' : `$${(avgOrderValue / 100).toFixed(2)}`}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-xs text-slate-400 mb-1">Active Products</div>
          <div className="text-2xl font-bold text-blue-400">
            {loadingProducts ? '...' : productList.filter((p: any) => p.status === 'PUBLISHED').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-white mb-4">🏆 Top Products</h2>
          {loadingProducts ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <div key={i} className="h-12 rounded-lg animate-pulse bg-white/5" />)}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No products yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product: any, i: number) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <span className="text-lg font-bold text-slate-500 w-6">#{i + 1}</span>
                  {product.coverImageUrl ? (
                    <img src={product.coverImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">📦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.title}</p>
                    <p className="text-xs text-slate-400">{product._count?.purchases || product.salesCount || 0} sales</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    ${((product.revenueTotal || 0) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-white mb-4">🧾 Recent Purchases</h2>
          {loadingRevenue ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <div key={i} className="h-12 rounded-lg animate-pulse bg-white/5" />)}
            </div>
          ) : recentPurchases.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No purchases yet — promote your products!</p>
          ) : (
            <div className="space-y-3">
              {recentPurchases.slice(0, 10).map((purchase: any) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{purchase.buyer?.name || 'Buyer'}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    ${((purchase.totalAmount || 0) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
