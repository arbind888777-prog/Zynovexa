export function orderSuccessPage(orderId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase complete - Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>tailwind.config={theme:{extend:{colors:{brand:{500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
</head>
<body class="bg-slate-50 text-slate-900">
  <main class="min-h-screen flex items-center justify-center p-6">
    <section class="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
      <div class="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5 text-2xl">
        <i class="fas fa-check"></i>
      </div>
      <h1 class="text-3xl font-black mb-2">Purchase complete</h1>
      <p class="text-slate-500 mb-6">Your product is ready. A delivery email has also been queued for the address you entered.</p>
      <div id="order-summary" class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-5">
        <div class="animate-pulse text-sm text-slate-400">Loading receipt...</div>
      </div>
      <div id="download-actions"></div>
      <a href="/" class="inline-flex items-center gap-2 mt-5 text-sm text-brand-600 font-semibold hover:underline">
        <i class="fas fa-arrow-left"></i> Back to homepage
      </a>
    </section>
  </main>
  <script>
    const orderId = ${JSON.stringify(orderId)};
    const downloadUrl = new URLSearchParams(window.location.search).get('download') || '';

    async function loadOrder() {
      const res = await fetch('/api/orders/' + orderId);
      const json = await res.json();
      if (!json.success) {
        document.getElementById('order-summary').innerHTML = '<div class="text-sm text-red-500">Order not found.</div>';
        return;
      }
      const order = json.data.order;
      document.getElementById('order-summary').innerHTML =
        '<div class="text-xs text-slate-400 mb-2">Receipt</div>' +
        '<div class="text-lg font-bold">' + order.title + '</div>' +
        '<div class="text-sm text-slate-500 mt-1">Order: ' + order.id + '</div>' +
        '<div class="text-sm text-slate-500">Email: ' + order.buyer_email + '</div>' +
        '<div class="text-sm text-slate-500">Status: ' + order.payment_status + '</div>' +
        '<div class="text-2xl font-black mt-4">$' + (order.amount / 100).toFixed(2) + '</div>';
      document.getElementById('download-actions').innerHTML = downloadUrl
        ? '<a href="' + downloadUrl + '" class="inline-flex items-center justify-center gap-2 w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"><i class="fas fa-download"></i> Download now</a>'
        : '<p class="text-sm text-slate-500">Use the delivery email link to download your product, or return to the checkout tab if it is still open.</p>';
    }

    loadOrder();
  </script>
</body>
</html>`;
}