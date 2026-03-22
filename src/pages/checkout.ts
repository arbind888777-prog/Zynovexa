export function checkoutPage(productId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout - Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>tailwind.config={theme:{extend:{colors:{brand:{500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
</head>
<body class="bg-slate-50 text-slate-900">
  <main class="max-w-5xl mx-auto px-6 py-10 min-h-screen">
    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <section id="product-card" class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div class="animate-pulse text-sm text-slate-400">Loading product...</div>
      </section>
      <section class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h1 class="text-2xl font-black mb-2">Secure Checkout</h1>
        <p class="text-sm text-slate-500 mb-6">Pay once. Instant delivery. Receipt included.</p>
        <div id="checkout-error" class="hidden bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4"></div>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium text-slate-500 mb-1 block">Your name</label>
            <input id="buyer-name" class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Enter your full name">
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500 mb-1 block">Email for delivery</label>
            <input id="buyer-email" type="email" class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="you@example.com">
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500 mb-2 block">Payment provider</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input type="radio" name="payment-provider" value="stripe" checked>
                <div>
                  <div class="font-semibold text-sm">Stripe</div>
                  <div class="text-xs text-slate-400">Global cards</div>
                </div>
              </label>
              <label class="border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input type="radio" name="payment-provider" value="razorpay">
                <div>
                  <div class="font-semibold text-sm">Razorpay</div>
                  <div class="text-xs text-slate-400">UPI and India cards</div>
                </div>
              </label>
            </div>
          </div>
          <button id="checkout-btn" onclick="startCheckout()" class="w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition">Continue to payment</button>
        </div>
        <div id="demo-pay" class="hidden mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div class="text-sm font-semibold text-amber-700 mb-1">Demo checkout mode</div>
          <div class="text-xs text-amber-600 mb-3">Provider keys are not configured here, so this uses the built-in test payment flow.</div>
          <button onclick="completeDemoPayment()" class="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold">Pay test amount</button>
        </div>
      </section>
    </div>
  </main>
  <script>
    const productId = ${JSON.stringify(productId)};
    let checkoutOrderId = new URLSearchParams(window.location.search).get('order') || '';
    let productData = null;

    async function loadProduct() {
      const res = await fetch('/api/products/' + productId);
      const json = await res.json();
      if (!json.success) {
        document.getElementById('product-card').innerHTML = '<div class="text-center py-10"><div class="text-4xl mb-3">🧾</div><p class="text-slate-500">Product not found</p></div>';
        return;
      }
      productData = json.data.product;
      document.getElementById('product-card').innerHTML =
        '<div class="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-5 flex items-center justify-center">' +
          (productData.thumbnail_url ? '<img src="' + productData.thumbnail_url + '" class="w-full h-full object-cover">' : '<i class="fas fa-file-arrow-down text-4xl text-slate-300"></i>') +
        '</div>' +
        '<div class="text-sm text-brand-600 font-semibold mb-2">Digital product</div>' +
        '<h2 class="text-3xl font-black leading-tight">' + productData.title + '</h2>' +
        '<p class="text-slate-500 mt-3">' + productData.description + '</p>' +
        '<div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">' +
          '<div><div class="text-xs text-slate-400">Price</div><div class="text-3xl font-black">$' + (productData.price / 100).toFixed(2) + '</div></div>' +
          '<div class="text-right text-xs text-slate-400"><div>Instant delivery</div><div>Secure access link</div></div>' +
        '</div>';
    }

    async function startCheckout() {
      const buyerEmail = document.getElementById('buyer-email').value.trim();
      const buyerName = document.getElementById('buyer-name').value.trim();
      const provider = document.querySelector('input[name="payment-provider"]:checked').value;
      if (!buyerEmail) {
        showError('Email is required for delivery.');
        return;
      }

      const btn = document.getElementById('checkout-btn');
      btn.disabled = true;
      btn.textContent = 'Preparing checkout...';
      try {
        const res = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, buyer_email: buyerEmail, buyer_name: buyerName, payment_provider: provider })
        });
        const json = await res.json();
        if (!json.success) {
          showError(json.message || 'Checkout could not start');
          return;
        }
        checkoutOrderId = json.data.order_id;
        if (json.data.mode === 'demo') {
          document.getElementById('demo-pay').classList.remove('hidden');
          btn.textContent = 'Checkout ready';
          return;
        }
        window.location.href = json.data.checkout_url;
      } catch (error) {
        showError('Network error. Please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Continue to payment';
      }
    }

    async function completeDemoPayment() {
      if (!checkoutOrderId) {
        showError('Start checkout first.');
        return;
      }
      const res = await fetch('/api/payments/orders/' + checkoutOrderId + '/mark-paid', { method: 'POST' });
      const json = await res.json();
      if (!json.success) {
        showError(json.message || 'Payment failed');
        return;
      }
      window.location.href = json.data.success_url;
    }

    function showError(message) {
      const el = document.getElementById('checkout-error');
      el.textContent = message;
      el.classList.remove('hidden');
    }

    loadProduct();
  </script>
</body>
</html>`;
}