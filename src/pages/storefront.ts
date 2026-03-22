export function storefrontPage(username: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${username} Storefront - Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>tailwind.config={theme:{extend:{colors:{brand:{500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
</head>
<body class="bg-slate-50 text-slate-900">
  <div class="min-h-screen">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-sm font-bold">
          <span class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white"><i class="fas fa-bolt"></i></span>
          Zynovexa
        </a>
        <a href="/signup" class="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition">Launch your store</a>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-6 py-10">
      <section id="store-hero" class="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 mb-8 shadow-sm">
        <div class="animate-pulse text-sm text-slate-400">Loading storefront...</div>
      </section>
      <section>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-2xl font-black">Products</h2>
          <span id="product-count" class="text-sm text-slate-500"></span>
        </div>
        <div id="products-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
      </section>
    </main>
  </div>
  <script>
    const username = ${JSON.stringify(username)};
    const sessionId = localStorage.getItem('store-session') || ('sess_' + Math.random().toString(36).slice(2));
    localStorage.setItem('store-session', sessionId);

    async function loadStorefront() {
      const res = await fetch('/api/storefront/' + username);
      const json = await res.json();
      if (!json.success) {
        document.getElementById('store-hero').innerHTML = '<div class="text-center py-16"><div class="text-5xl mb-3">🛍️</div><h1 class="text-2xl font-black mb-2">Storefront not found</h1><p class="text-slate-500">This creator has not published products yet.</p></div>';
        return;
      }

      const store = json.data.storefront;
      const products = json.data.products || [];
      document.title = store.name + ' - Storefront';
      document.getElementById('product-count').textContent = products.length + ' product' + (products.length === 1 ? '' : 's');
      document.getElementById('store-hero').innerHTML =
        '<div class="flex flex-col md:flex-row md:items-center gap-5">' +
          '<div class="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-black overflow-hidden">' +
            (store.avatar_url ? '<img src="' + store.avatar_url + '" class="w-full h-full object-cover">' : store.name.charAt(0)) +
          '</div>' +
          '<div class="flex-1">' +
            '<h1 class="text-3xl font-black">' + store.name + '</h1>' +
            '<p class="text-slate-500 mt-1">' + (store.headline || 'Digital products built for creators') + '</p>' +
            '<p class="text-sm text-slate-400 mt-3 max-w-2xl">' + (store.bio || ('Creator niche: ' + (store.niche || 'general'))) + '</p>' +
          '</div>' +
        '</div>';

      document.getElementById('products-grid').innerHTML = products.length ? products.map((product) => {
        trackEvent(product.id, 'view');
        return '<article class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">' +
          '<div class="aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden">' +
            (product.thumbnail_url ? '<img src="' + product.thumbnail_url + '" class="w-full h-full object-cover">' : '<i class="fas fa-file-arrow-down text-3xl text-slate-300"></i>') +
          '</div>' +
          '<div class="p-5">' +
            '<h3 class="font-bold text-lg leading-tight">' + product.title + '</h3>' +
            '<p class="text-sm text-slate-500 mt-2 min-h-[3rem]">' + product.description + '</p>' +
            '<div class="flex items-center justify-between mt-5">' +
              '<div class="text-2xl font-black">$' + (product.price / 100).toFixed(2) + '</div>' +
              '<button onclick="buyProduct(\'' + product.id + '\')" class="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition">Buy</button>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('') : '<div class="text-sm text-slate-400">No products published yet.</div>';
    }

    async function trackEvent(productId, eventType) {
      try {
        await fetch('/api/products/' + productId + '/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: eventType, session_id: sessionId })
        });
      } catch (error) {}
    }

    function buyProduct(productId) {
      trackEvent(productId, 'click');
      window.location.href = '/checkout/' + productId;
    }

    loadStorefront();
  </script>
</body>
</html>`;
}