// ============================================================
// Zynovexa - Landing Page
// Public marketing page with hero, features, pricing, CTA
// ============================================================
export function landingPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zynovexa – AI Creator Automation Platform</title>
  <meta name="description" content="Manage all your social media, create AI content, schedule posts, and grow your audience from one powerful dashboard.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { 50:'#f0f5ff', 100:'#e0eaff', 200:'#c2d5ff', 300:'#93b4fd', 400:'#6090fa', 500:'#3b6cf5', 600:'#2850e8', 700:'#1e3dd4', 800:'#1e35ab', 900:'#1f3086' },
            accent: { 400:'#f97316', 500:'#ea580c' }
          }
        }
      }
    }
  </script>
  <style>
    html { scroll-behavior: smooth; }
    .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); }
    .gradient-hero { background: linear-gradient(135deg, #1e3dd4 0%, #3b6cf5 40%, #6090fa 70%, #93b4fd 100%); }
    .gradient-text { background: linear-gradient(135deg, #1e3dd4, #6090fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .float-anim { animation: float 6s ease-in-out infinite; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    .card-hover { transition: all 0.3s; }
    .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  </style>
</head>
<body class="bg-white text-gray-800 antialiased">

<!-- ============ NAVBAR ============ -->
<nav class="fixed top-0 w-full z-50 glass border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
        <i class="fas fa-bolt text-white text-sm"></i>
      </div>
      <span class="text-xl font-bold text-gray-900">Zyno<span class="text-brand-600">vexa</span></span>
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="#features" class="text-sm font-medium text-gray-600 hover:text-brand-600 transition">Features</a>
      <a href="#pricing" class="text-sm font-medium text-gray-600 hover:text-brand-600 transition">Pricing</a>
      <a href="#how-it-works" class="text-sm font-medium text-gray-600 hover:text-brand-600 transition">How It Works</a>
      <a href="/login" class="text-sm font-medium text-gray-600 hover:text-brand-600 transition">Login</a>
      <a href="/signup" class="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
        Get Started Free
      </a>
    </div>
    <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden text-gray-600">
      <i class="fas fa-bars text-xl"></i>
    </button>
  </div>
  <div id="mobile-menu" class="hidden md:hidden px-6 pb-4 space-y-3">
    <a href="#features" class="block text-sm text-gray-600">Features</a>
    <a href="#pricing" class="block text-sm text-gray-600">Pricing</a>
    <a href="/login" class="block text-sm text-gray-600">Login</a>
    <a href="/signup" class="block w-full text-center py-2 bg-brand-600 text-white text-sm rounded-lg">Get Started Free</a>
  </div>
</nav>

<!-- ============ HERO SECTION ============ -->
<section class="gradient-hero pt-32 pb-20 px-6 relative overflow-hidden">
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
  </div>
  <div class="max-w-7xl mx-auto relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-white/90 text-sm mb-6">
        <i class="fas fa-sparkles"></i>
        <span>Powered by AI • Trusted by 50,000+ creators</span>
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
        Your Entire Creator<br>Business in <span class="text-yellow-300">One Platform</span>
      </h1>
      <p class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
        Manage all social accounts, create AI content, auto-publish across platforms, 
        analyze performance, and grow your audience — all from one intelligent dashboard.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a href="/signup" class="px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-xl text-lg">
          <i class="fas fa-rocket mr-2"></i>Start Free Today
        </a>
        <a href="#how-it-works" class="px-8 py-4 bg-white/15 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/25 transition text-lg border border-white/20">
          <i class="fas fa-play-circle mr-2"></i>See How It Works
        </a>
      </div>
    </div>
    <!-- Dashboard Preview Mock -->
    <div class="max-w-5xl mx-auto mt-4 float-anim">
      <div class="bg-white rounded-2xl shadow-2xl p-2 border border-gray-200">
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
            <span class="ml-3 text-xs text-gray-400">Zynovexa Dashboard</span>
          </div>
          <div class="grid grid-cols-4 gap-3 mb-4">
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Followers</div>
              <div class="text-lg font-bold text-gray-900">153.5K</div>
              <div class="text-xs text-green-500"><i class="fas fa-arrow-up"></i> +12.4%</div>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Engagement</div>
              <div class="text-lg font-bold text-gray-900">4.8%</div>
              <div class="text-xs text-green-500"><i class="fas fa-arrow-up"></i> +0.6%</div>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Posts</div>
              <div class="text-lg font-bold text-gray-900">247</div>
              <div class="text-xs text-gray-400">This month</div>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Revenue</div>
              <div class="text-lg font-bold text-gray-900">$8.2K</div>
              <div class="text-xs text-green-500"><i class="fas fa-arrow-up"></i> +22%</div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2 bg-white rounded-lg p-3 shadow-sm h-28">
              <div class="text-xs text-gray-500 mb-2">Growth Trend</div>
              <svg viewBox="0 0 300 60" class="w-full h-16"><polyline fill="none" stroke="#3b6cf5" stroke-width="2" points="0,50 30,45 60,48 90,35 120,30 150,28 180,20 210,18 240,12 270,10 300,5"/><polyline fill="url(#grad)" stroke="none" points="0,60 0,50 30,45 60,48 90,35 120,30 150,28 180,20 210,18 240,12 270,10 300,5 300,60"/><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b6cf5" stop-opacity="0.2"/><stop offset="100%" stop-color="#3b6cf5" stop-opacity="0"/></linearGradient></defs></svg>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm h-28">
              <div class="text-xs text-gray-500 mb-2">AI Score</div>
              <div class="text-3xl font-bold text-brand-600 text-center mt-3">92</div>
              <div class="text-xs text-center text-gray-400">Viral potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ SOCIAL PROOF BAR ============ -->
<section class="py-8 bg-gray-50 border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-center text-sm text-gray-400 mb-4">TRUSTED BY CREATORS ON</p>
    <div class="flex flex-wrap items-center justify-center gap-8 text-gray-300 text-2xl">
      <i class="fab fa-instagram"></i>
      <i class="fab fa-youtube"></i>
      <i class="fab fa-tiktok"></i>
      <i class="fab fa-linkedin"></i>
      <i class="fab fa-twitter"></i>
      <i class="fab fa-facebook"></i>
    </div>
  </div>
</section>

<!-- ============ PROBLEM SECTION ============ -->
<section class="py-20 px-6 bg-white">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Creators Are <span class="text-red-500">Burning Out</span></h2>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">Managing multiple platforms, creating content daily, and figuring out what works — it's exhausting. Sound familiar?</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      ${[
        { icon: 'fa-clock', color: 'red', title: 'Time Drain', desc: 'Spending 4+ hours daily jumping between platforms to post and manage content.' },
        { icon: 'fa-chart-line-down', color: 'orange', title: 'Growth Plateau', desc: 'Posting consistently but not growing. No idea what content actually works.' },
        { icon: 'fa-shuffle', color: 'purple', title: 'Platform Chaos', desc: 'Different logins, different formats, different analytics. Nothing is unified.' },
        { icon: 'fa-money-bill-wave', color: 'yellow', title: 'Missed Revenue', desc: 'Leaving money on the table because you cannot track deals and pricing properly.' }
    ].map(p => `
      <div class="bg-${p.color}-50 rounded-xl p-6 border border-${p.color}-100">
        <div class="w-12 h-12 rounded-lg bg-${p.color}-100 flex items-center justify-center mb-4">
          <i class="fas ${p.icon} text-${p.color}-500 text-xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">${p.title}</h3>
        <p class="text-sm text-gray-600">${p.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ============ FEATURES SHOWCASE ============ -->
<section id="features" class="py-20 px-6 bg-gray-50">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full mb-4">
        <i class="fas fa-sparkles"></i> Powerful Features
      </div>
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Everything You Need to <span class="gradient-text">Create, Schedule & Grow</span></h2>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">One platform replacing 8+ tools. Save time, grow faster, earn more.</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${[
        { icon: 'fa-paper-plane', title: 'Multi-Platform Publishing', desc: 'Create once, publish everywhere. Instagram, YouTube, TikTok, LinkedIn, Twitter — all from one editor.', color: 'blue' },
        { icon: 'fa-robot', title: 'AI Content Generator', desc: 'Generate captions, video scripts, hashtags, and content ideas instantly using advanced AI.', color: 'purple' },
        { icon: 'fa-calendar-check', title: 'Smart Scheduling', desc: 'AI analyzes your audience to suggest the best times. Set it and forget it.', color: 'green' },
        { icon: 'fa-chart-mixed', title: 'Unified Analytics', desc: 'See all your metrics in one dashboard. Engagement, growth, reach — across all platforms.', color: 'orange' },
        { icon: 'fa-fire', title: 'Viral Score Prediction', desc: 'AI predicts how your post will perform before you publish. Optimize for virality.', color: 'red' },
        { icon: 'fa-dollar-sign', title: 'Monetization Tracker', desc: 'Track brand deals, calculate your rates, and generate professional media kits.', color: 'emerald' },
        { icon: 'fa-brain', title: 'AI Creator Coach', desc: 'Get personalized growth strategies, content feedback, and competitor insights.', color: 'indigo' },
        { icon: 'fa-images', title: 'Media Library', desc: 'Store and organize all your media assets. Drag and drop into any post.', color: 'pink' },
        { icon: 'fa-bell', title: 'Smart Notifications', desc: 'Get alerts for viral posts, expiring tokens, upcoming schedules, and brand opportunities.', color: 'yellow' }
    ].map(f => `
      <div class="bg-white rounded-xl p-6 border border-gray-100 card-hover">
        <div class="w-12 h-12 rounded-lg bg-${f.color}-100 flex items-center justify-center mb-4">
          <i class="fas ${f.icon} text-${f.color}-600 text-xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2 text-lg">${f.title}</h3>
        <p class="text-sm text-gray-500 leading-relaxed">${f.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ============ HOW IT WORKS ============ -->
<section id="how-it-works" class="py-20 px-6 bg-white">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Get Started in <span class="gradient-text">3 Simple Steps</span></h2>
      <p class="text-lg text-gray-500">From zero to autopilot in under 5 minutes.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      ${[
        { step: '1', icon: 'fa-plug', title: 'Connect', desc: 'Link your Instagram, YouTube, TikTok, and other social accounts with one click. Secure OAuth — we never store passwords.' },
        { step: '2', icon: 'fa-wand-magic-sparkles', title: 'Create', desc: 'Write posts with AI assistance, upload media, preview on each platform, and schedule for optimal times.' },
        { step: '3', icon: 'fa-rocket', title: 'Grow', desc: 'Let AI handle publishing, analyze performance, and give you actionable insights to grow faster.' }
    ].map(s => `
      <div class="text-center">
        <div class="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
          <i class="fas ${s.icon} text-brand-600 text-2xl"></i>
        </div>
        <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold mb-3">${s.step}</div>
        <h3 class="font-bold text-xl mb-3">${s.title}</h3>
        <p class="text-gray-500">${s.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ============ PRICING SECTION ============ -->
<section id="pricing" class="py-20 px-6 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent <span class="gradient-text">Pricing</span></h2>
      <p class="text-lg text-gray-500">Start free. Upgrade when you're ready to go pro.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Free Plan -->
      <div class="bg-white rounded-2xl p-8 border border-gray-200 card-hover">
        <div class="text-sm font-semibold text-gray-500 mb-2">FREE</div>
        <div class="text-4xl font-bold mb-1">$0</div>
        <div class="text-sm text-gray-400 mb-6">Forever free</div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 2 social accounts</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 10 posts/month</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 20 AI generations</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Basic analytics</li>
          <li class="flex items-center gap-2 text-sm text-gray-300"><i class="fas fa-xmark"></i> Viral score</li>
          <li class="flex items-center gap-2 text-sm text-gray-300"><i class="fas fa-xmark"></i> Brand deal tracker</li>
        </ul>
        <a href="/signup" class="block text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition">Get Started</a>
      </div>
      <!-- Pro Plan -->
      <div class="bg-white rounded-2xl p-8 border-2 border-brand-500 card-hover relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">MOST POPULAR</div>
        <div class="text-sm font-semibold text-brand-600 mb-2">PRO</div>
        <div class="text-4xl font-bold mb-1">$19<span class="text-lg text-gray-400">/mo</span></div>
        <div class="text-sm text-gray-400 mb-6">Billed monthly</div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 10 social accounts</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 100 posts/month</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> 500 AI generations</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Advanced analytics</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Viral score prediction</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Brand deal tracker</li>
        </ul>
        <a href="/signup?plan=pro" class="block text-center py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">Start Free Trial</a>
      </div>
      <!-- Business Plan -->
      <div class="bg-white rounded-2xl p-8 border border-gray-200 card-hover">
        <div class="text-sm font-semibold text-gray-500 mb-2">BUSINESS</div>
        <div class="text-4xl font-bold mb-1">$49<span class="text-lg text-gray-400">/mo</span></div>
        <div class="text-sm text-gray-400 mb-6">For teams & agencies</div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Unlimited accounts</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Unlimited posts</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Unlimited AI</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Everything in Pro</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Media kit generator</li>
          <li class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-check text-green-500"></i> Priority support</li>
        </ul>
        <a href="/signup?plan=business" class="block text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition">Get Started</a>
      </div>
    </div>
  </div>
</section>

<!-- ============ TESTIMONIALS ============ -->
<section class="py-20 px-6 bg-white">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Loved by <span class="gradient-text">50,000+ Creators</span></h2>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      ${[
        { name: 'Jessica Lee', handle: '@jessicacreates', text: "Zynovexa saved me 3 hours every single day. The AI scheduling alone is worth 10x the price. My engagement is up 40% since I started.", stars: 5 },
        { name: 'Marcus Chen', handle: '@marcustech', text: "Finally one tool that replaces Buffer, Later, and Canva for me. The viral score prediction is scary accurate — my last 3 posts all went viral.", stars: 5 },
        { name: 'Priya Sharma', handle: '@priyalifestyle', text: "The monetization tracker helped me negotiate a $5K brand deal. The media kit generator is incredibly professional. Game changer.", stars: 5 }
    ].map(t => `
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div class="flex items-center gap-1 mb-3">${'<i class="fas fa-star text-yellow-400 text-sm"></i>'.repeat(t.stars)}</div>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed">"${t.text}"</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
            <span class="text-brand-600 font-bold text-sm">${t.name.charAt(0)}</span>
          </div>
          <div>
            <div class="text-sm font-bold">${t.name}</div>
            <div class="text-xs text-gray-400">${t.handle}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ============ FINAL CTA ============ -->
<section class="py-20 px-6 gradient-hero">
  <div class="max-w-3xl mx-auto text-center">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to 10x Your Creator Career?</h2>
    <p class="text-lg text-white/80 mb-8">Join 50,000+ creators who save hours daily and grow faster with AI.</p>
    <a href="/signup" class="inline-flex items-center gap-2 px-10 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-xl text-lg">
      <i class="fas fa-rocket"></i> Start Free — No Credit Card Required
    </a>
  </div>
</section>

<!-- ============ FOOTER ============ -->
<footer class="bg-gray-900 text-gray-400 py-16 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-4 gap-8 mb-12">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <i class="fas fa-bolt text-white text-sm"></i>
          </div>
          <span class="text-lg font-bold text-white">Zynovexa</span>
        </div>
        <p class="text-sm">The all-in-one AI platform for modern content creators.</p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Product</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="#features" class="hover:text-white transition">Features</a></li>
          <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
          <li><a href="#" class="hover:text-white transition">Changelog</a></li>
          <li><a href="#" class="hover:text-white transition">API</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Company</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="hover:text-white transition">About</a></li>
          <li><a href="/terms" class="hover:text-white transition">Terms</a></li>
          <li><a href="/privacy" class="hover:text-white transition">Privacy</a></li>
          <li><a href="mailto:hello@zynovexa.com" class="hover:text-white transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Legal</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="/terms" class="hover:text-white transition">Terms of Service</a></li>
          <li><a href="/about" class="hover:text-white transition">About Zynovexa</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm">&copy; 2026 Zynovexa. All rights reserved.</p>
      <div class="flex gap-4 text-lg">
        <a href="#" class="hover:text-white transition"><i class="fab fa-twitter"></i></a>
        <a href="#" class="hover:text-white transition"><i class="fab fa-instagram"></i></a>
        <a href="#" class="hover:text-white transition"><i class="fab fa-linkedin"></i></a>
        <a href="#" class="hover:text-white transition"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
</footer>

</body>
</html>`;
}
