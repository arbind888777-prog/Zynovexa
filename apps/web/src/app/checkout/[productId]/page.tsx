'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api, commerceApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  type?: string;
  coverImageUrl?: string;
  store?: { name: string; slug: string };
  creator?: { name: string };
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.productId as string;
  const itemTypeParam = searchParams.get('type') || 'PRODUCT';
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/checkout/${productId}${itemTypeParam === 'COURSE' ? '?type=COURSE' : ''}`);
      return;
    }
    api.get(`/commerce/public/product/${productId}`)
      .then(res => {
        const d = res.data?.data || res.data;
        setProduct(d);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [productId, isAuthenticated, router, itemTypeParam]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const itemType = itemTypeParam === 'COURSE' ? 'COURSE' : 'PRODUCT';
      const checkoutData = {
        itemType,
        productId: itemType === 'PRODUCT' ? productId : undefined,
        courseId: itemType === 'COURSE' ? productId : undefined,
      };

      if (paymentMethod === 'razorpay') {
        const res = await commerceApi.createRazorpayCheckout(checkoutData);
        const data = res.data?.data || res.data;

        if (data.provider === 'razorpay') {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'Zynovexa',
            description: data.itemTitle,
            order_id: data.orderId,
            prefill: { name: data.buyerName, email: data.buyerEmail },
            theme: { color: '#6366f1' },
            handler: () => {
              toast.success('Payment successful!');
              router.push('/purchases?success=true');
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', () => {
            toast.error('Payment failed. Please try again.');
          });
          rzp.open();
          return;
        }
      }

      // Stripe fallback
      const res = await commerceApi.createCheckout(checkoutData);
      const data = res.data?.data || res.data;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      toast.success('Checkout initiated');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Checkout failed. Please try again.';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl font-bold text-white mb-2">Product not found</p>
          <p className="text-slate-400 text-sm mb-6">This item is unavailable.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Home</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Product Info */}
          <div className="text-center mb-8">
            {product.coverImageUrl ? (
              <img src={product.coverImageUrl} alt={product.title}
                className="w-full h-40 rounded-xl object-cover mb-4" />
            ) : (
              <div className="w-full h-40 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <span className="text-5xl opacity-30">{itemTypeParam === 'COURSE' ? '🎓' : '🛍️'}</span>
              </div>
            )}
            <h1 className="text-xl font-extrabold text-white mb-2">{product.title}</h1>
            {product.creator && (
              <p className="text-sm text-slate-500 mb-1">by {product.creator.name}</p>
            )}
            <p className="text-sm text-slate-400 line-clamp-3">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-6">
            <span className="text-sm text-slate-300 font-medium">Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">₹{(product.price / 100).toFixed(0)}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-slate-500 line-through">₹{((product.originalPrice || 0) / 100).toFixed(0)}</span>
                  <span className="text-xs font-bold text-green-400">{discount}% OFF</span>
                </>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2 font-medium">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMethod('razorpay')}
                className={`p-3 rounded-xl text-sm font-medium border transition-all ${paymentMethod === 'razorpay' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                🇮🇳 Razorpay
              </button>
              <button onClick={() => setPaymentMethod('stripe')}
                className={`p-3 rounded-xl text-sm font-medium border transition-all ${paymentMethod === 'stripe' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                💳 Stripe
              </button>
            </div>
          </div>

          {/* Checkout Button */}
          <button onClick={handleCheckout} disabled={processing}
            className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity disabled:opacity-50 mb-4">
            {processing ? 'Processing...' : `💳 Pay ₹${(product.price / 100).toFixed(0)}`}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>🔒 Secure Payment</span>
            <span>⚡ Instant Access</span>
            <span>💯 Money Back</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Powered by <Link href="/" className="text-purple-400 hover:text-purple-300">Zynovexa</Link>
        </p>
      </div>

      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}
