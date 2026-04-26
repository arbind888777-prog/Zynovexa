'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { commerceApi, unwrapApiResponse } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import { getPublicApiBaseUrl } from '@/lib/public-env';
import Link from 'next/link';

const PUBLIC_API_BASE = getPublicApiBaseUrl();

interface OrderDetails {
  id: string;
  status: string;
  totalAmount: number;
  platformFee?: number;
  sellerAmount?: number;
  currency?: string;
  creator?: { name?: string; handle?: string };
  store?: { name?: string; slug?: string };
  items?: Array<{
    id: string;
    itemType: 'PRODUCT' | 'COURSE';
    titleSnapshot: string;
    priceSnapshot: number;
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
  const whatsappSupportNumber = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || '';

  useEffect(() => {
    commerceApi.getBuyerOrder(orderId)
      .then((res) => setOrder(unwrapApiResponse(res)))
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

  const isReady = order?.status === 'PAID' || order?.status === 'FULFILLED';
  const hasAccessCta = order?.items?.some((item) => item.product?.id || item.course?.id);
  const whatsappHref = whatsappSupportNumber && order
    ? `https://wa.me/${whatsappSupportNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, please confirm my Zynovexa order ${order.id}.`)}`
    : '';

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="card p-8">
          {/* Success Animation */}
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            ✅
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">{isReady ? 'Payment Successful!' : 'Order Received!'}</h1>
          <p className="text-slate-400 text-sm mb-6">
            {order
              ? isReady
                ? 'Your order has been confirmed. Access is unlocked below.'
                : 'Payment is being verified. Access will appear in My Purchases once confirmation completes.'
              : 'Thank you for your purchase!'}
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
                <span className="text-emerald-400 font-bold">{formatMoneyFromMinor(order.totalAmount || 0, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Date</span>
                <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="text-white">{order.status}</span>
                </div>
                {order.creator?.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Creator</span>
                    <span className="text-white">{order.creator.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Access Buttons */}
          {order?.items?.map((item) => {
            if (item.product?.id && isReady) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleDownload(item.product!.id)}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-opacity mb-3"
                >
                  📥 Download {item.product.title}
                </button>
              );
            }

            if (item.course?.id && isReady) {
              return (
                <Link
                  key={item.id}
                  href={`/learn/${item.course.id}`}
                  className="block w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity mb-3"
                >
                  ▶ Start {item.course.title}
                </Link>
              );
            }

            return (
              <div key={item.id} className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left">
                <p className="text-sm font-semibold text-white">{item.titleSnapshot}</p>
                <p className="mt-1 text-xs text-slate-400">Access will unlock once payment verification finishes.</p>
              </div>
            );
          })}

          <div className="flex gap-3 mt-4">
            <Link href="/purchases"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 text-center transition-colors">
              My Purchases
            </Link>
            <Link href="/dashboard"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 text-center transition-colors">
              Dashboard
            </Link>
          </div>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/15 transition-colors"
            >
              💬 Need confirmation on WhatsApp?
            </a>
          )}

          {hasAccessCta && (
            <p className="mt-4 text-xs text-slate-500">
              Tip: buyers can always reopen this order later from My Purchases.
            </p>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Powered by <Link href="/" className="text-purple-400 hover:text-purple-300">Zynovexa</Link>
        </p>
      </div>
    </div>
  );
}
