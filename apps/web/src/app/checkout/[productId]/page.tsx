'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api, commerceApi } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  originalPrice?: number;
  type?: string;
  coverImageUrl?: string;
  store?: {
    name: string;
    slug: string;
    promoCode?: string;
    promoLabel?: string;
    promoDiscountPercent?: number;
    promoExpiresAt?: string;
  };
  creator?: { name: string };
}

function CheckoutPageContent() {
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
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

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
        promoCode: appliedPromoCode || undefined,
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
  const activePromo = product.store?.promoCode && product.store?.promoDiscountPercent && (!product.store?.promoExpiresAt || new Date(product.store.promoExpiresAt).getTime() > Date.now())
    ? {
        code: product.store.promoCode,
        label: product.store.promoLabel || 'Limited-time offer',
        discountPercent: product.store.promoDiscountPercent,
        expiresAt: product.store.promoExpiresAt,
      }
    : null;
  const effectivePromo = appliedPromoCode && activePromo?.code === appliedPromoCode ? activePromo : null;
  const discountedAmount = effectivePromo ? Math.round(product.price * (100 - effectivePromo.discountPercent) / 100) : product.price;
  const priceText = formatMoneyFromMinor(product.price, product.currency);
  const originalPriceText = formatMoneyFromMinor(product.originalPrice || 0, product.currency);
  const discountedPriceText = formatMoneyFromMinor(discountedAmount, product.currency);

  const applyPromo = () => {
    const normalized = promoInput.trim().toUpperCase();
    if (!normalized) {
      setAppliedPromoCode(null);
      setPromoError('');
      return;
    }

    if (!activePromo || activePromo.code !== normalized) {
      setAppliedPromoCode(null);
      setPromoError('Promo code invalid ya expire ho chuka hai.');
      return;
    }

    setAppliedPromoCode(normalized);
    setPromoError('');
    toast.success(`${activePromo.discountPercent}% discount applied`);
  };

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
              <span className="text-2xl font-bold text-white">{effectivePromo ? discountedPriceText : priceText}</span>
              {effectivePromo && <span className="text-sm text-slate-500 line-through">{priceText}</span>}
              {discount > 0 && (
                <>
                  <span className="text-sm text-slate-500 line-through">{originalPriceText}</span>
                  <span className="text-xs font-bold text-green-400">{discount}% OFF</span>
                </>
              )}
            </div>
          </div>

          {activePromo && (
            <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-left">
              <p className="text-sm font-semibold text-amber-200">{activePromo.label}</p>
              <p className="mt-1 text-xs text-amber-100/80">Use code <span className="font-mono text-white">{activePromo.code}</span> for {activePromo.discountPercent}% off.</p>
              {activePromo.expiresAt && (
                <p className="mt-1 text-[11px] text-amber-100/70">Ends {new Date(activePromo.expiresAt).toLocaleString('en-IN')}</p>
              )}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button onClick={applyPromo} type="button" className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors">
                  Apply
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-red-300">{promoError}</p>}
            </div>
          )}

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
            {processing ? 'Processing...' : `💳 Pay ${effectivePromo ? discountedPriceText : priceText}`}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-bg" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
