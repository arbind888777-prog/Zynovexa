'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, commerceApi } from '@/lib/api';
import Link from 'next/link';

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api');

interface OrderDetails {
  id: string;
  status: string;
  totalAmount: number;
  items?: Array<{
    product?: { id: string; title: string };
    course?: { id: string; title: string };
  }>;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/commerce/buyer/orders/${orderId}`)
      .then(res => {
        const d = res.data?.data || res.data;
        setOrder(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleDownload = async (productId: string) => {
    try {
      const res = await commerceApi.downloadProduct(productId);
      const data = res.data?.data || res.data;
      if (data?.downloadUrl || data?.url) {
        window.open(data.downloadUrl || data.url, '_blank');
      }
    } catch {
      // Fallback: direct download endpoint
      window.open(`${PUBLIC_API_BASE}/commerce/buyer/products/${productId}/download`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="card p-8">
          {/* Success Animation */}
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            ✅
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">Payment Successful!</h1>
          <p className="text-slate-400 text-sm mb-6">
            {order ? 'Your order has been confirmed. You can now download your product.' : 'Thank you for your purchase!'}
          </p>

          {/* Order Details */}
          {order && (
            <div className="rounded-xl bg-white/5 p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Order ID</span>
                <span className="text-white font-mono text-xs">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Amount</span>
                <span className="text-emerald-400 font-bold">${((order.totalAmount || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Date</span>
                <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Download Buttons */}
          {order?.items?.map((item, i) => {
            const product = item.product;
            if (!product) return null;
            return (
              <button
                key={i}
                onClick={() => handleDownload(product.id)}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-opacity mb-3"
              >
                📥 Download {product.title}
              </button>
            );
          })}

          <div className="flex gap-3 mt-4">
            <Link href="/products"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 text-center transition-colors">
              My Products
            </Link>
            <Link href="/dashboard"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 text-center transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Powered by <Link href="/" className="text-purple-400 hover:text-purple-300">Zynovexa</Link>
        </p>
      </div>
    </div>
  );
}
