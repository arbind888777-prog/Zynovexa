'use client';

import { useEffect, useState } from 'react';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';

interface BuyerPurchase {
  id: string;
  buyerName: string;
  items: { titleSnapshot: string; priceSnapshot: number; itemType: string }[];
  totalAmount: number;
  platformFee: number;
  sellerAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function BuyersPage() {
  const [purchases, setPurchases] = useState<BuyerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBuyers = async (p: number) => {
    setLoading(true);
    try {
      const res = await commerceApi.getCreatorBuyers(p);
      const data = res.data?.data || res.data;
      setPurchases(data.purchases || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch {
      toast.error('Failed to load buyer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuyers(1); }, []);

  const totalRevenue = purchases.reduce((s, p) => s + p.sellerAmount, 0);
  const totalFees = purchases.reduce((s, p) => s + p.platformFee, 0);

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">👥 Buyers & Sales</h1>
        <p className="text-slate-400 text-sm mt-1">Track all purchases made on your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-purple-400">{total}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Gross Revenue</div>
          <div className="text-2xl font-bold text-emerald-400">₹{(purchases.reduce((s, p) => s + p.totalAmount, 0) / 100).toFixed(0)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Net Earnings</div>
          <div className="text-2xl font-bold text-blue-400">₹{(totalRevenue / 100).toFixed(0)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-400 mb-1">Platform Fees</div>
          <div className="text-2xl font-bold text-orange-400">₹{(totalFees / 100).toFixed(0)}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">💰</p>
          <p className="text-lg font-semibold text-white mb-2">No sales yet</p>
          <p className="text-slate-400 text-sm">Start selling products and courses to see purchases here.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Buyer</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fee</th>
                    <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Net</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(purchase => (
                    <tr key={purchase.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="p-4 text-sm text-white font-medium">{purchase.buyerName}</td>
                      <td className="p-4 text-sm text-slate-300">{purchase.items[0]?.titleSnapshot || '—'}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          purchase.items[0]?.itemType === 'COURSE'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {purchase.items[0]?.itemType === 'COURSE' ? '🎓 Course' : '📦 Product'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white text-right">₹{(purchase.totalAmount / 100).toFixed(0)}</td>
                      <td className="p-4 text-sm text-orange-400 text-right">₹{(purchase.platformFee / 100).toFixed(0)}</td>
                      <td className="p-4 text-sm text-emerald-400 text-right font-medium">₹{(purchase.sellerAmount / 100).toFixed(0)}</td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(purchase.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => fetchBuyers(page - 1)} disabled={page <= 1}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                ← Previous
              </button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <button onClick={() => fetchBuyers(page + 1)} disabled={page >= totalPages}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Privacy Note */}
      <div className="mt-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
        <p className="text-xs text-yellow-400/80">
          🔒 Privacy: Buyer email and phone are not displayed to protect buyer privacy (GDPR compliance).
          Only buyer name and purchase info is shown.
        </p>
      </div>
    </div>
  );
}
