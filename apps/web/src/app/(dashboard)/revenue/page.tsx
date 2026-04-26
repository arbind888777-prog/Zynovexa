'use client';

import { useQuery } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { formatCompactMoneyFromMinor, formatMoneyFromMinor, formatNumber } from '@/lib/commerce';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#38bdf8', '#f59e0b'];

export default function RevenueAnalyticsPage() {
  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ['commerce-revenue', 90],
    queryFn: () => commerceApi.getRevenue(90).then(unwrapApiResponse),
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => commerceApi.getCreatorProducts().then(unwrapApiResponse),
  });

  const productList = (Array.isArray(products) ? products : (products as any)?.products || []) as any[];
  const rev = revenue as any || {};
  const currency = rev.currency || productList[0]?.currency || 'INR';
  const totalRevenue = rev.grossRevenue || 0;
  const netRevenue = rev.netRevenue || 0;
  const platformFees = rev.platformFees || 0;
  const totalSales = rev.orderCount || 0;
  const uniqueBuyerCount = rev.uniqueBuyerCount || 0;
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const recentPurchases = rev.recentSales || [];
  const revenueSeries = Array.isArray(rev.series) ? rev.series : [];
  const salesMix = [
    { name: 'Products', value: rev.productRevenue || 0 },
    { name: 'Courses', value: rev.courseRevenue || 0 },
  ].filter((entry) => entry.value > 0);
  const topRevenueProducts = [...productList]
    .filter((product: any) => (product.totalRevenue || 0) > 0)
    .sort((a: any, b: any) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 6);
  const topProducts = [...productList]
    .sort((a: any, b: any) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);
  const trendDelta = revenueSeries.length > 1
    ? revenueSeries[revenueSeries.length - 1].amount - revenueSeries[0].amount
    : 0;
  const trendLabel = trendDelta > 0 ? 'Revenue is trending up' : trendDelta < 0 ? 'Revenue is cooling down' : 'Revenue is flat';

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">💰 Revenue & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Track cash flow, product performance, and the revenue mix across your store.</p>
        </div>
        <Link href="/products"
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
          ← Products
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-2xl mb-2">💵</div>
          <div className="text-xs text-slate-400 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-400">
            {loadingRevenue ? '...' : formatMoneyFromMinor(totalRevenue, currency)}
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
            {loadingRevenue ? '...' : formatMoneyFromMinor(avgOrderValue, currency)}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-xs text-slate-400 mb-1">Unique Buyers</div>
          <div className="text-2xl font-bold text-blue-400">
            {loadingRevenue ? '...' : formatNumber(uniqueBuyerCount)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6 mb-6">
        <div className="card p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Trend</h2>
              <p className="text-sm text-slate-400 mt-1">Last 90 days of paid and fulfilled orders.</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signal</p>
              <p className={`text-sm font-semibold ${trendDelta > 0 ? 'text-emerald-400' : trendDelta < 0 ? 'text-amber-400' : 'text-slate-300'}`}>{trendLabel}</p>
            </div>
          </div>
          {loadingRevenue ? (
            <div className="h-[300px] rounded-2xl bg-white/5 animate-pulse" />
          ) : revenueSeries.length === 0 ? (
            <div className="h-[300px] rounded-2xl bg-white/5 flex items-center justify-center text-sm text-slate-400">
              No revenue yet to chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactMoneyFromMinor(value, currency)} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.96)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    borderRadius: 16,
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatMoneyFromMinor(value, currency), 'Revenue']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-bold text-white mb-4">Cashflow Snapshot</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Net Earnings</p>
              <p className="text-2xl font-bold text-emerald-300 mt-2">{formatMoneyFromMinor(netRevenue, currency)}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Platform Fees</p>
              <p className="text-2xl font-bold text-amber-300 mt-2">{formatMoneyFromMinor(platformFees, currency)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Products</p>
                <p className="text-lg font-bold text-white mt-2">{formatMoneyFromMinor(rev.productRevenue || 0, currency)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Courses</p>
                <p className="text-lg font-bold text-white mt-2">{formatMoneyFromMinor(rev.courseRevenue || 0, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6 mb-6">
        <div className="card p-5">
          <h2 className="text-lg font-bold text-white mb-4">Revenue Mix</h2>
          {loadingRevenue ? (
            <div className="h-[260px] rounded-2xl bg-white/5 animate-pulse" />
          ) : salesMix.length === 0 ? (
            <div className="h-[260px] rounded-2xl bg-white/5 flex items-center justify-center text-sm text-slate-400">
              No paid orders yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-4 items-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={salesMix} dataKey="value" nameKey="name" innerRadius={65} outerRadius={92} paddingAngle={4}>
                    {salesMix.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.96)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                      borderRadius: 16,
                      color: '#fff',
                    }}
                    formatter={(value: number) => [formatMoneyFromMinor(value, currency), 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {salesMix.map((entry, index) => (
                  <div key={entry.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                        <span className="text-sm font-medium text-white">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{Math.round((entry.value / totalRevenue) * 100) || 0}%</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-2">{formatMoneyFromMinor(entry.value, currency)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
                    <p className="text-xs text-slate-400">{product.totalSales || 0} sales</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatMoneyFromMinor(product.totalRevenue || 0, product.currency || currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
        <div className="card p-5">
          <h2 className="text-lg font-bold text-white mb-4">Product Revenue Breakdown</h2>
          {loadingProducts ? (
            <div className="h-[280px] rounded-2xl bg-white/5 animate-pulse" />
          ) : topRevenueProducts.length === 0 ? (
            <div className="h-[280px] rounded-2xl bg-white/5 flex items-center justify-center text-sm text-slate-400">
              Publish products to unlock the breakdown.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topRevenueProducts} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactMoneyFromMinor(value, currency)} />
                <YAxis type="category" dataKey="title" width={110} tick={{ fill: '#cbd5e1', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.96)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    borderRadius: 16,
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatMoneyFromMinor(value, currency), 'Revenue']}
                />
                <Bar dataKey="totalRevenue" radius={[0, 10, 10, 0]}>
                  {topRevenueProducts.map((product: any, index: number) => <Cell key={product.id} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

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
                    {formatMoneyFromMinor(purchase.totalAmount || 0, purchase.currency || currency)}
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
