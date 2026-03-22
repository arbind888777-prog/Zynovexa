'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PUBLISHED: { bg: '#10b98120', color: '#10b981', label: '✅ Live' },
  DRAFT:     { bg: '#6b728020', color: '#6b7280', label: '📝 Draft' },
  ARCHIVED:  { bg: '#f59e0b20', color: '#f59e0b', label: '📦 Archived' },
};

export default function ProductsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => commerceApi.getCreatorProducts().then(unwrapApiResponse),
  });

  const { data: revenue } = useQuery({
    queryKey: ['commerce-revenue'],
    queryFn: () => commerceApi.getRevenue(30).then(unwrapApiResponse),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => commerceApi.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const list = (Array.isArray(products) ? products : (products as any)?.products || []) as any[];
  const filtered = filter ? list.filter((p: any) => p.status === filter) : list;

  const totalRevenue = (revenue as any)?.totalRevenue || 0;
  const totalSales = (revenue as any)?.totalSales || 0;

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🛍️ My Products</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your digital products and track sales</p>
        </div>
        <Link href="/products/create"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity whitespace-nowrap">
          + Create Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-white">{list.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Published</div>
          <div className="text-2xl font-bold text-emerald-400">{list.filter((p: any) => p.status === 'PUBLISHED').length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Revenue (30d)</div>
          <div className="text-2xl font-bold text-purple-400">${(totalRevenue / 100).toFixed(2)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Sales (30d)</div>
          <div className="text-2xl font-bold text-pink-400">{totalSales}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['' , 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={{ background: filter === s ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)', border: '1px solid var(--border)' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-semibold text-white mb-2">No products yet</p>
          <p className="text-slate-400 text-sm mb-6">Create your first digital product and start selling in under 2 minutes.</p>
          <Link href="/products/create"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            🚀 Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product: any) => {
            const style = STATUS_STYLES[product.status] || STATUS_STYLES.DRAFT;
            return (
              <div key={product.id} className="card card-hover p-5">
                {/* Cover */}
                {product.coverImageUrl && (
                  <div className="h-32 rounded-lg mb-4 overflow-hidden bg-white/5">
                    <img src={product.coverImageUrl} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Status + Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: style.bg, color: style.color }}>
                    {style.label}
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                </div>

                {/* Title + Description */}
                <h3 className="text-sm font-semibold text-white truncate mb-1">{product.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{product.description}</p>

                {/* Sales Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                  <span>📦 {product._count?.purchases || product.salesCount || 0} sales</span>
                  <span>💰 ${((product.revenueTotal || 0) / 100).toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/products/${product.id}/edit`}
                    className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-white/10 transition-colors"
                    style={{ border: '1px solid var(--border)' }}>
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Delete this product?')) deleteMutation.mutate(product.id);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    style={{ border: '1px solid var(--border)' }}>
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
