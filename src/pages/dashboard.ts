// ============================================================
// Zynovexa - Dashboard Shell
// Full SPA with sidebar navigation, all pages rendered client-side
// ============================================================

export function dashboardPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard – Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0f5ff',100:'#e0eaff',200:'#c2d5ff',500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .page { display: none; }
    .page.active { display: block; }
    .sidebar-link.active { background: #f0f5ff; color: #2850e8; font-weight: 600; }
    .sidebar-link.active i { color: #2850e8; }
    .fade-in { animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
    .glass-card { background: white; border-radius: 16px; border: 1px solid #f1f1f1; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .stat-card { transition: all 0.2s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    textarea:focus, input:focus, select:focus { outline: none; box-shadow: 0 0 0 2px #3b6cf5; }
    .chat-bubble { max-width: 85%; }
    .heatmap-cell { width: 14px; height: 14px; border-radius: 3px; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <!-- Auth check -->
  <script>
    if (!localStorage.getItem('token')) { window.location.href = '/login'; }
  </script>

  <div class="flex min-h-screen">
    <!-- ============ SIDEBAR ============ -->
    <aside id="sidebar" class="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-100 z-40 flex flex-col transition-transform -translate-x-full lg:translate-x-0">
      <!-- Logo -->
      <div class="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><i class="fas fa-bolt text-white text-sm"></i></div>
        <span class="text-lg font-bold">Zyno<span class="text-brand-600">vexa</span></span>
      </div>
      <!-- Nav Links -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <a href="#" onclick="navigate('dashboard')" data-page="dashboard" class="sidebar-link active flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-th-large w-5 text-center text-gray-400"></i> Dashboard
        </a>
        <a href="#" onclick="navigate('create')" data-page="create" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition mt-2">
          <div class="w-5 h-5 rounded bg-brand-600 flex items-center justify-center"><i class="fas fa-plus text-white text-[10px]"></i></div>
          <span class="font-semibold text-brand-600">Create Post</span>
        </a>
        <a href="#" onclick="navigate('video-post')" data-page="video-post" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <div class="w-5 h-5 rounded bg-red-600 flex items-center justify-center"><i class="fas fa-video text-white text-[10px]"></i></div>
          <span class="font-semibold text-red-600">Video Post</span>
        </a>
        <a href="#" onclick="navigate('scheduled')" data-page="scheduled" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-calendar-check w-5 text-center text-gray-400"></i> Scheduled Posts
        </a>
        <a href="#" onclick="navigate('accounts')" data-page="accounts" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-plug w-5 text-center text-gray-400"></i> Accounts
        </a>
        <a href="#" onclick="navigate('analytics')" data-page="analytics" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-chart-mixed w-5 text-center text-gray-400"></i> Analytics
        </a>
        <a href="#" onclick="navigate('video-analytics')" data-page="video-analytics" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-clapperboard w-5 text-center text-gray-400"></i> Video Analytics
        </a>
        <a href="#" onclick="navigate('seo')" data-page="seo" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-magnifying-glass-chart w-5 text-center text-gray-400"></i> SEO Tools
        </a>
        <a href="#" onclick="navigate('ai')" data-page="ai" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-robot w-5 text-center text-gray-400"></i> AI Assistant
        </a>
        <a href="#" onclick="navigate('monetization')" data-page="monetization" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-dollar-sign w-5 text-center text-gray-400"></i> Monetization
        </a>
        <a href="#" onclick="navigate('products')" data-page="products" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-bag-shopping w-5 text-center text-gray-400"></i> Products
        </a>
        <div class="border-t border-gray-100 my-3"></div>
        <p class="px-3 text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">Growth Tools</p>
        <a href="#" onclick="navigate('growth-coach')" data-page="growth-coach" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-seedling w-5 text-center text-green-400"></i> Growth Coach
        </a>
        <a href="#" onclick="navigate('ai-engine')" data-page="ai-engine" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-wand-magic-sparkles w-5 text-center text-purple-400"></i> AI Engine
        </a>
        <a href="#" onclick="navigate('pro-analytics')" data-page="pro-analytics" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-chart-line w-5 text-center text-blue-400"></i> Pro Analytics
        </a>
        <a href="#" onclick="navigate('gamification')" data-page="gamification" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-trophy w-5 text-center text-yellow-400"></i> Achievements
        </a>
        <a href="#" onclick="navigate('pricing')" data-page="pricing" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-gem w-5 text-center text-pink-400"></i> Upgrade
        </a>
        <div class="border-t border-gray-100 my-3"></div>
        <a href="#" onclick="navigate('billing')" data-page="billing" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-credit-card w-5 text-center text-gray-400"></i> Billing
        </a>
        <a href="#" onclick="navigate('settings')" data-page="settings" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-gear w-5 text-center text-gray-400"></i> Settings
        </a>
      </nav>
      <!-- User Profile -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
            <span class="text-brand-600 font-bold text-sm" id="sidebar-avatar">S</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold truncate" id="sidebar-name">Loading...</div>
            <div class="text-xs text-gray-400 truncate" id="sidebar-plan">Free</div>
          </div>
          <button onclick="logout()" class="text-gray-400 hover:text-red-500 transition" title="Logout">
            <i class="fas fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- ============ MAIN CONTENT ============ -->
    <main class="flex-1 lg:ml-64">
      <!-- Top Navbar -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <button onclick="toggleSidebar()" class="lg:hidden text-gray-500"><i class="fas fa-bars text-lg"></i></button>
          <h2 class="text-lg font-bold" id="page-title">Dashboard</h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <button onclick="toggleNotifications()" class="relative text-gray-400 hover:text-gray-600 transition">
              <i class="fas fa-bell text-lg"></i>
              <span id="notif-badge" class="hidden absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">0</span>
            </button>
            <div id="notif-dropdown" class="hidden absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
              <div class="p-4 border-b border-gray-50 flex justify-between items-center">
                <span class="font-semibold text-sm">Notifications</span>
                <button onclick="markAllRead()" class="text-xs text-brand-600 hover:underline">Mark all read</button>
              </div>
              <div id="notif-list" class="divide-y divide-gray-50"></div>
            </div>
          </div>
          <button onclick="navigate('create')" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition">
            <i class="fas fa-plus"></i> New Post
          </button>
        </div>
      </header>

      <!-- Page Content Container -->
      <div class="p-6" id="content">
${buildDashboardPage()}
${buildCreatePostPage()}
${buildVideoPostPage()}
${buildScheduledPage()}
${buildAccountsPage()}
${buildAnalyticsPage()}
${buildVideoAnalyticsPage()}
${buildSEOPage()}
${buildAIPage()}
${buildMonetizationPage()}
${buildProductsPage()}
${buildBillingPage()}
${buildSettingsPage()}
${buildGrowthCoachPage()}
${buildAIEnginePage()}
${buildProAnalyticsPage()}
${buildGamificationPage()}
${buildPricingPage()}
      </div>
    </main>
  </div>

  <!-- Mobile sidebar overlay -->
  <div id="sidebar-overlay" class="hidden fixed inset-0 bg-black/30 z-30 lg:hidden" onclick="toggleSidebar()"></div>

  <script>
${dashboardScript()}
  </script>
</body>
</html>`;
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function buildDashboardPage(): string {
  return `
<!-- DASHBOARD PAGE -->
<div class="page active" id="page-dashboard">
  <div class="fade-in">
    <!-- Welcome Banner -->
    <div class="glass-card p-6 mb-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white relative overflow-hidden">
      <div class="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <h3 class="text-xl font-bold mb-1">Welcome back, <span id="dash-username">Creator</span>! 👋</h3>
      <p class="text-white/80 text-sm">Here's what's happening with your content today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><i class="fas fa-users text-blue-500"></i></div>
          <span class="text-xs text-green-500 font-medium"><i class="fas fa-arrow-up"></i> 12.4%</span>
        </div>
        <div class="text-2xl font-bold" id="stat-followers">--</div>
        <div class="text-xs text-gray-400 mt-1">Total Followers</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><i class="fas fa-heart text-green-500"></i></div>
          <span class="text-xs text-green-500 font-medium" id="stat-engagement-delta"><i class="fas fa-arrow-up"></i> 0.6%</span>
        </div>
        <div class="text-2xl font-bold" id="stat-engagement">--%</div>
        <div class="text-xs text-gray-400 mt-1">Engagement Rate</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><i class="fas fa-paper-plane text-purple-500"></i></div>
        </div>
        <div class="text-2xl font-bold" id="stat-posts">--</div>
        <div class="text-xs text-gray-400 mt-1">Total Posts</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><i class="fas fa-calendar text-orange-500"></i></div>
        </div>
        <div class="text-2xl font-bold" id="stat-scheduled">--</div>
        <div class="text-xs text-gray-400 mt-1">Scheduled</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Growth Chart -->
      <div class="lg:col-span-2 glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold">Audience Growth</h3>
          <select class="text-xs border border-gray-200 rounded-lg px-2 py-1" onchange="loadGrowthChart(this.value)">
            <option value="7">Last 7 days</option>
            <option value="30" selected>Last 30 days</option>
          </select>
        </div>
        <canvas id="growth-chart" height="200"></canvas>
      </div>

      <!-- Upcoming Posts -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-calendar-day text-brand-500 mr-2"></i>Upcoming Posts</h3>
        <div id="upcoming-posts" class="space-y-3">
          <div class="text-sm text-gray-400 text-center py-6">Loading...</div>
        </div>
      </div>
    </div>

    <!-- AI Recommendations -->
    <div class="glass-card p-6 mt-6">
      <h3 class="font-bold mb-4"><i class="fas fa-lightbulb text-yellow-500 mr-2"></i>AI Recommendations</h3>
      <div id="ai-recs" class="grid md:grid-cols-2 gap-3"></div>
    </div>
  </div>
</div>`;
}

// ============================================================
// CREATE POST PAGE
// ============================================================
function buildCreatePostPage(): string {
  return `
<!-- CREATE POST PAGE -->
<div class="page" id="page-create">
  <div class="fade-in">
    <div class="grid lg:grid-cols-5 gap-6">
      <!-- LEFT: Editor (3 cols) -->
      <div class="lg:col-span-3 space-y-4">
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Compose Your Post</h3>
          <!-- Caption Editor -->
          <textarea id="post-caption" rows="6" class="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:border-brand-500" placeholder="Write your caption here... or let AI do it for you ✨"></textarea>
          
          <!-- Toolbar -->
          <div class="flex items-center gap-2 mt-3 flex-wrap">
            <button onclick="document.getElementById('media-upload').click()" class="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
              <i class="fas fa-image text-green-500 mr-1"></i> Media
            </button>
            <input type="file" id="media-upload" class="hidden" accept="image/*,video/*" multiple>
            <button onclick="insertEmoji()" class="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
              😊 Emoji
            </button>
            <button onclick="aiGenerate('caption')" class="px-3 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm hover:bg-brand-100 transition font-medium">
              <i class="fas fa-robot mr-1"></i> AI Generate
            </button>
            <button onclick="aiGenerate('hashtags')" class="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm hover:bg-purple-100 transition font-medium">
              <i class="fas fa-hashtag mr-1"></i> Hashtags
            </button>
            <button onclick="aiGenerate('viral_score')" class="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm hover:bg-orange-100 transition font-medium">
              <i class="fas fa-fire mr-1"></i> Viral Score
            </button>
          </div>

          <!-- AI Output -->
          <div id="ai-output" class="hidden mt-4 bg-brand-50 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-brand-700"><i class="fas fa-robot mr-1"></i> AI Suggestion</span>
              <button onclick="useAISuggestion()" class="text-xs px-3 py-1 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Use This</button>
            </div>
            <pre id="ai-output-text" class="text-sm text-gray-700 whitespace-pre-wrap font-sans"></pre>
          </div>

          <!-- Media Preview -->
          <div id="media-preview" class="hidden mt-4 flex gap-2 flex-wrap"></div>

          <!-- Hashtags -->
          <div id="hashtag-area" class="mt-4">
            <label class="text-xs font-medium text-gray-500 mb-1 block">Hashtags</label>
            <input id="post-hashtags" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="#contentcreator #viral #trending">
          </div>

          <div class="mt-4">
            <label class="text-xs font-medium text-gray-500 mb-1 block">Attach Product</label>
            <select id="attach-product-select" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">No product attached</option>
            </select>
            <p class="text-xs text-gray-400 mt-1">We will automatically add a CTA like “Buy here”.</p>
          </div>
        </div>

        <!-- Platform Selection & Schedule -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Publish To</h3>
          <div class="flex flex-wrap gap-3 mb-6" id="platform-checkboxes">
            ${['instagram,fa-instagram,#E4405F', 'youtube,fa-youtube,#FF0000', 'tiktok,fa-tiktok,#000000', 'twitter,fa-twitter,#1DA1F2', 'linkedin,fa-linkedin,#0A66C2', 'facebook,fa-facebook,#1877F2']
              .map(p => { const [name,icon,color] = p.split(','); return `
            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="checkbox" value="${name}" class="platform-cb accent-brand-600">
              <i class="fab ${icon}" style="color:${color}"></i>
              <span class="text-sm capitalize">${name}</span>
            </label>`;}).join('')}
          </div>

          <!-- Schedule -->
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="text-xs font-medium text-gray-500 mb-1 block">Schedule Date & Time</label>
              <input type="datetime-local" id="post-schedule" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            </div>
            <div class="flex gap-2">
              <button onclick="savePost('draft')" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <i class="fas fa-save mr-1"></i> Save Draft
              </button>
              <button onclick="savePost('scheduled')" class="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/25" id="publish-btn">
                <i class="fas fa-paper-plane mr-1"></i> Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Live Preview (2 cols) -->
      <div class="lg:col-span-2">
        <div class="glass-card p-6 sticky top-24">
          <h3 class="font-bold mb-4">Live Preview</h3>
          <!-- Preview Tabs -->
          <div class="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
            <button onclick="switchPreview('instagram')" class="preview-tab flex-1 py-2 text-xs rounded-md bg-white shadow-sm font-medium" data-tab="instagram">Instagram</button>
            <button onclick="switchPreview('twitter')" class="preview-tab flex-1 py-2 text-xs rounded-md text-gray-500" data-tab="twitter">Twitter</button>
            <button onclick="switchPreview('linkedin')" class="preview-tab flex-1 py-2 text-xs rounded-md text-gray-500" data-tab="linkedin">LinkedIn</button>
          </div>
          <!-- Preview Card -->
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="flex items-center gap-3 p-3 border-b border-gray-100">
              <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center"><span class="text-brand-600 text-xs font-bold" id="preview-avatar">S</span></div>
              <div><div class="text-sm font-semibold" id="preview-name">You</div><div class="text-xs text-gray-400" id="preview-handle">@yourhandle</div></div>
            </div>
            <div id="preview-media" class="bg-gray-100 h-48 flex items-center justify-center text-gray-300">
              <i class="fas fa-image text-4xl"></i>
            </div>
            <div class="p-3">
              <p class="text-sm text-gray-700 whitespace-pre-wrap" id="preview-caption">Your caption will appear here...</p>
              <p class="text-xs text-blue-500 mt-2" id="preview-hashtags"></p>
            </div>
            <div class="flex items-center gap-6 px-3 py-2 border-t border-gray-100 text-gray-400 text-sm">
              <span><i class="far fa-heart mr-1"></i> Like</span>
              <span><i class="far fa-comment mr-1"></i> Comment</span>
              <span><i class="far fa-share-square mr-1"></i> Share</span>
            </div>
          </div>
          
          <!-- Viral Score -->
          <div id="viral-score-card" class="hidden mt-4 bg-orange-50 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-orange-700"><i class="fas fa-fire mr-1"></i> Viral Score</span>
              <span class="text-2xl font-bold text-orange-600" id="viral-score-value">--</span>
            </div>
            <div class="w-full bg-orange-200 rounded-full h-2 mt-2"><div id="viral-score-bar" class="bg-orange-500 h-2 rounded-full transition-all" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// VIDEO POST PAGE — Full video upload, SEO, thumbnail, scheduling
// ============================================================
function buildVideoPostPage(): string {
  return `
<!-- VIDEO POST PAGE -->
<div class="page" id="page-video-post">
  <div class="fade-in">
    <div class="grid lg:grid-cols-5 gap-6">
      <!-- LEFT: Video Editor (3 cols) -->
      <div class="lg:col-span-3 space-y-4">
        <!-- Video Upload -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4"><i class="fas fa-video text-red-500 mr-2"></i>Upload Video</h3>
          <div id="video-upload-zone" onclick="document.getElementById('video-file-input').click()" class="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition group">
            <input type="file" id="video-file-input" class="hidden" accept="video/*" onchange="handleVideoUpload(event)">
            <div id="video-upload-placeholder">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition">
                <i class="fas fa-cloud-arrow-up text-2xl text-red-400"></i>
              </div>
              <p class="text-sm font-medium text-gray-600">Click or drag to upload video</p>
              <p class="text-xs text-gray-400 mt-1">MP4, MOV, AVI, WebM — Max 500 MB</p>
            </div>
            <div id="video-upload-preview" class="hidden">
              <video id="video-preview-player" class="w-full max-h-64 rounded-xl bg-black" controls></video>
              <div class="flex items-center justify-between mt-3">
                <div>
                  <p class="text-sm font-medium text-gray-700" id="video-file-name"></p>
                  <p class="text-xs text-gray-400" id="video-file-info"></p>
                </div>
                <button onclick="event.stopPropagation(); removeVideo()" class="px-3 py-1.5 text-red-500 bg-red-50 rounded-lg text-xs hover:bg-red-100 transition">
                  <i class="fas fa-trash mr-1"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Details -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Video Details</h3>
          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 flex justify-between">
                <span>Title <span class="text-red-400">*</span></span>
                <span class="text-gray-300" id="video-title-count">0/100</span>
              </label>
              <input type="text" id="video-title" maxlength="100" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="An attention-grabbing title for your video" oninput="updateVideoTitleCount(); updateVideoPreview()">
            </div>
            <!-- Description -->
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 flex justify-between">
                <span>Description</span>
                <span class="text-gray-300" id="video-desc-count">0/5000</span>
              </label>
              <textarea id="video-description" rows="5" maxlength="5000" class="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none" placeholder="Write a detailed description with keywords, timestamps, and links..." oninput="updateVideoDescCount(); updateVideoPreview()"></textarea>
              <div class="flex gap-2 mt-2">
                <button onclick="insertTimestamp()" class="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition"><i class="fas fa-clock mr-1"></i> Timestamps</button>
                <button onclick="aiVideoDesc()" class="px-3 py-1.5 text-xs bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition"><i class="fas fa-robot mr-1"></i> AI Description</button>
                <button onclick="aiVideoHashtags()" class="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"><i class="fas fa-hashtag mr-1"></i> AI Hashtags</button>
              </div>
            </div>
            <!-- Tags -->
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 flex justify-between">
                <span>Tags</span>
                <span class="text-gray-300" id="video-tag-count">0/15</span>
              </label>
              <div class="flex gap-2 mb-2">
                <input type="text" id="video-tag-input" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Type a tag and press Enter" onkeydown="if(event.key==='Enter'){event.preventDefault();addVideoTag()}">
                <button onclick="addVideoTag()" class="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">Add</button>
                <button onclick="aiGenerateVideoTags()" class="px-4 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm hover:bg-brand-100 transition"><i class="fas fa-robot mr-1"></i> AI Tags</button>
              </div>
              <div id="video-tags-list" class="flex flex-wrap gap-2"></div>
            </div>
            <!-- Category & Visibility -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select id="video-category" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  <option>Entertainment</option><option>Education</option><option>Science & Technology</option>
                  <option>Howto & Style</option><option>People & Blogs</option><option>Gaming</option>
                  <option>Music</option><option>Sports</option><option>News & Politics</option>
                  <option>Comedy</option><option>Film & Animation</option><option>Autos & Vehicles</option>
                  <option>Travel & Events</option><option>Pets & Animals</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 mb-1 block">Visibility</label>
                <select id="video-visibility" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="public">🌍 Public</option>
                  <option value="unlisted">🔗 Unlisted</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Thumbnail -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4"><i class="fas fa-image text-green-500 mr-2"></i>Thumbnail</h3>
          <div class="grid grid-cols-3 gap-3">
            <div onclick="document.getElementById('thumb-file-input').click()" class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition aspect-video flex flex-col items-center justify-center">
              <input type="file" id="thumb-file-input" class="hidden" accept="image/*" onchange="handleThumbUpload(event)">
              <i class="fas fa-upload text-gray-300 text-xl mb-2"></i>
              <p class="text-xs text-gray-400">Custom Upload</p>
            </div>
            <div id="thumb-preview-1" class="border border-gray-200 rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-400 transition" onclick="selectThumb(1)">
              <span class="text-white text-xs font-bold text-center px-2">Auto-generated<br>Frame 1</span>
            </div>
            <div id="thumb-preview-2" class="border border-gray-200 rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-400 transition" onclick="selectThumb(2)">
              <span class="text-white text-xs font-bold text-center px-2">Auto-generated<br>Frame 2</span>
            </div>
          </div>
          <div id="custom-thumb-preview" class="hidden mt-3">
            <img id="thumb-img" class="w-full max-h-40 object-cover rounded-xl" alt="Thumbnail">
          </div>
        </div>

        <!-- SEO Section -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold"><i class="fas fa-magnifying-glass-chart text-brand-500 mr-2"></i>SEO Optimization</h3>
            <button onclick="runVideoSEO()" class="px-4 py-2 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700 transition font-medium">
              <i class="fas fa-search mr-1"></i> Analyze SEO
            </button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">SEO Title <span class="text-gray-300">(overrides video title in search)</span></label>
              <input type="text" id="video-seo-title" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Leave blank to use video title">
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">SEO Description <span class="text-gray-300">(first 150 chars visible in search)</span></label>
              <textarea id="video-seo-desc" rows="2" class="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none" placeholder="Optimized description for search results..."></textarea>
            </div>
          </div>
          <!-- SEO Score Result -->
          <div id="video-seo-result" class="hidden mt-4">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center" id="seo-score-bg">
                <div class="text-center">
                  <div class="text-2xl font-bold" id="seo-score-val">0</div>
                  <div class="text-xs font-medium" id="seo-score-grade">-</div>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm mb-1">SEO Score</h4>
                <div class="w-full bg-gray-100 rounded-full h-2.5"><div id="seo-score-bar" class="h-2.5 rounded-full transition-all duration-500" style="width:0%"></div></div>
              </div>
            </div>
            <div id="seo-checks-list" class="space-y-2"></div>
            <div id="seo-suggestions-list" class="mt-4 space-y-2"></div>
          </div>
        </div>

        <!-- Platform & Schedule -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Publish To</h3>
          <div class="flex flex-wrap gap-3 mb-6" id="video-platform-checkboxes">
            ` + ['youtube,fa-youtube,#FF0000', 'tiktok,fa-tiktok,#000000', 'instagram,fa-instagram,#E4405F', 'facebook,fa-facebook,#1877F2', 'linkedin,fa-linkedin,#0A66C2']
              .map(p => { const [name,icon,color] = p.split(','); return `
            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="checkbox" value="${name}" class="video-platform-cb accent-brand-600">
              <i class="fab ${icon}" style="color:${color}"></i>
              <span class="text-sm capitalize">${name}</span>
            </label>`;}).join('') + `
          </div>
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="text-xs font-medium text-gray-500 mb-1 block">Schedule Date & Time</label>
              <input type="datetime-local" id="video-schedule" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            </div>
            <div class="flex gap-2">
              <button onclick="saveVideoPost('draft')" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <i class="fas fa-save mr-1"></i> Save Draft
              </button>
              <button onclick="saveVideoPost('scheduled')" class="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/25">
                <i class="fas fa-paper-plane mr-1"></i> Schedule Video
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Preview & SEO Summary (2 cols) -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Video Preview Card -->
        <div class="glass-card p-6 sticky top-24">
          <h3 class="font-bold mb-4">Video Preview</h3>
          <!-- YouTube-style preview -->
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="aspect-video bg-gray-900 flex items-center justify-center relative" id="vid-prev-thumb">
              <i class="fas fa-play-circle text-white/60 text-5xl"></i>
              <div class="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono" id="vid-prev-duration">0:00</div>
            </div>
            <div class="p-3">
              <p class="text-sm font-semibold line-clamp-2" id="vid-prev-title">Your video title will appear here...</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center"><span class="text-brand-600 text-[10px] font-bold" id="vid-prev-avatar">S</span></div>
                <span class="text-xs text-gray-500" id="vid-prev-channel">Your Channel</span>
                <span class="text-xs text-gray-400">• 0 views • Just now</span>
              </div>
              <p class="text-xs text-gray-400 mt-2 line-clamp-2" id="vid-prev-desc">Video description will appear here...</p>
            </div>
          </div>

          <!-- Quick SEO Tips -->
          <div class="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <h4 class="font-bold text-sm text-yellow-800 mb-2"><i class="fas fa-lightbulb mr-1"></i>Quick SEO Tips</h4>
            <ul class="text-xs text-yellow-700 space-y-1.5">
              <li><i class="fas fa-check-circle text-yellow-500 mr-1"></i> Use keywords in first 60 chars of title</li>
              <li><i class="fas fa-check-circle text-yellow-500 mr-1"></i> Include timestamps in description</li>
              <li><i class="fas fa-check-circle text-yellow-500 mr-1"></i> Add 5-15 relevant tags</li>
              <li><i class="fas fa-check-circle text-yellow-500 mr-1"></i> Write 200+ chars description</li>
              <li><i class="fas fa-check-circle text-yellow-500 mr-1"></i> Use custom thumbnail (10x more clicks)</li>
            </ul>
          </div>

          <!-- Video Tag Cloud -->
          <div class="mt-4">
            <h4 class="font-bold text-sm mb-2">Tags Preview</h4>
            <div id="vid-prev-tags" class="flex flex-wrap gap-1.5">
              <span class="text-xs text-gray-300 italic">No tags added yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// VIDEO ANALYTICS PAGE
// ============================================================
function buildVideoAnalyticsPage(): string {
  return `
<div class="page" id="page-video-analytics">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Deep video performance metrics: views, watch time, retention, CTR, and subscriber conversion.</p>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><i class="fas fa-play text-red-500 text-sm"></i></div></div>
        <div class="text-2xl font-bold" id="va-total-views">--</div>
        <div class="text-xs text-gray-400">Total Views</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><i class="fas fa-clock text-blue-500 text-sm"></i></div></div>
        <div class="text-2xl font-bold" id="va-watch-hours">--</div>
        <div class="text-xs text-gray-400">Watch Hours</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><i class="fas fa-user-plus text-green-500 text-sm"></i></div></div>
        <div class="text-2xl font-bold" id="va-subs-gained">--</div>
        <div class="text-xs text-gray-400">Subs Gained</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><i class="fas fa-mouse-pointer text-purple-500 text-sm"></i></div></div>
        <div class="text-2xl font-bold" id="va-avg-ctr">--%</div>
        <div class="text-xs text-gray-400">Avg CTR</div>
      </div>
    </div>

    <!-- Second row: retention & videos count -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-5 stat-card">
        <div class="text-2xl font-bold text-orange-600" id="va-avg-retention">--%</div>
        <div class="text-xs text-gray-400">Avg Retention</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-2xl font-bold text-pink-600" id="va-total-likes">--</div>
        <div class="text-xs text-gray-400">Total Likes</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-2xl font-bold text-teal-600" id="va-total-comments">--</div>
        <div class="text-xs text-gray-400">Total Comments</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-2xl font-bold text-indigo-600" id="va-total-videos">--</div>
        <div class="text-xs text-gray-400">Total Videos</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6 mb-6">
      <!-- Watch Time Trend -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-chart-area text-blue-500 mr-2"></i>Watch Time Trend (14 Days)</h3>
        <canvas id="watch-time-chart" height="220"></canvas>
      </div>
      <!-- Audience Retention Curve -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-chart-line text-green-500 mr-2"></i>Avg Audience Retention</h3>
        <canvas id="retention-chart" height="220"></canvas>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6 mb-6">
      <!-- Views Trend -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-eye text-red-500 mr-2"></i>Daily Views</h3>
        <canvas id="views-trend-chart" height="220"></canvas>
      </div>
      <!-- Views vs Watch Time Comparison -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-scale-balanced text-purple-500 mr-2"></i>Views vs Watch Time</h3>
        <canvas id="views-vs-watch-chart" height="220"></canvas>
      </div>
    </div>

    <!-- Video List Table -->
    <div class="glass-card p-6">
      <h3 class="font-bold mb-4"><i class="fas fa-video text-red-500 mr-2"></i>Your Videos</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th class="text-left p-3 font-medium">Video</th>
              <th class="text-right p-3 font-medium">Views</th>
              <th class="text-right p-3 font-medium">Watch (hrs)</th>
              <th class="text-right p-3 font-medium">Retention</th>
              <th class="text-right p-3 font-medium">CTR</th>
              <th class="text-right p-3 font-medium">Likes</th>
              <th class="text-right p-3 font-medium">Subs</th>
            </tr>
          </thead>
          <tbody id="va-video-table">
            <tr><td colspan="7" class="p-8 text-center text-gray-400">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// SEO TOOLS PAGE
// ============================================================
function buildSEOPage(): string {
  return `
<div class="page" id="page-seo">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Optimize your video titles, descriptions, and tags for maximum search visibility.</p>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- LEFT: SEO Tools (2 cols) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- SEO Analyzer -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4"><i class="fas fa-stethoscope text-brand-500 mr-2"></i>SEO Analyzer</h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Video Title</label>
              <input type="text" id="seo-analyze-title" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Enter your video title to analyze...">
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <textarea id="seo-analyze-desc" rows="4" class="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none" placeholder="Enter your video description..."></textarea>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Tags (comma separated)</label>
              <input type="text" id="seo-analyze-tags" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="tag1, tag2, tag3...">
            </div>
            <button onclick="runSEOAnalysis()" class="w-full py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
              <i class="fas fa-magnifying-glass-chart mr-2"></i> Analyze SEO Score
            </button>
          </div>
          <!-- Results -->
          <div id="seo-analysis-result" class="hidden mt-6">
            <div class="flex items-center gap-4 mb-4 p-4 rounded-2xl" id="seo-result-banner">
              <div class="w-24 h-24 rounded-2xl flex items-center justify-center text-white" id="seo-result-score-bg">
                <div class="text-center">
                  <div class="text-3xl font-bold" id="seo-result-score">0</div>
                  <div class="text-xs font-medium" id="seo-result-grade">/100</div>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="font-bold" id="seo-result-title-text">SEO Score</h4>
                <div class="w-full bg-white/30 rounded-full h-3 mt-2"><div id="seo-result-bar" class="h-3 rounded-full bg-white transition-all duration-700" style="width:0%"></div></div>
                <p class="text-xs mt-2" id="seo-result-summary"></p>
              </div>
            </div>
            <!-- Checks -->
            <div id="seo-result-checks" class="space-y-2 mb-4"></div>
            <!-- Suggestions -->
            <div id="seo-result-suggestions" class="space-y-2"></div>
          </div>
        </div>

        <!-- Keyword Research -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4"><i class="fas fa-key text-yellow-500 mr-2"></i>Keyword Research</h3>
          <div class="flex gap-2 mb-4">
            <input type="text" id="seo-keyword-input" class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Enter a topic to research keywords..." onkeydown="if(event.key==='Enter')runKeywordResearch()">
            <button onclick="runKeywordResearch()" class="px-6 py-3 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition">
              <i class="fas fa-search mr-1"></i> Research
            </button>
          </div>
          <div id="keyword-results" class="hidden">
            <div class="overflow-x-auto">
              <table class="w-full mb-4">
                <thead>
                  <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
                    <th class="text-left p-3 font-medium">Keyword</th>
                    <th class="text-right p-3 font-medium">Volume</th>
                    <th class="text-center p-3 font-medium">Competition</th>
                    <th class="text-center p-3 font-medium">Trend</th>
                    <th class="text-right p-3 font-medium">CPC</th>
                  </tr>
                </thead>
                <tbody id="keyword-table-body"></tbody>
              </table>
            </div>
            <!-- Related & Trending -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="font-bold text-sm mb-2"><i class="fas fa-link text-blue-500 mr-1"></i> Related Topics</h4>
                <div id="keyword-related" class="flex flex-wrap gap-2"></div>
              </div>
              <div>
                <h4 class="font-bold text-sm mb-2"><i class="fas fa-arrow-trend-up text-green-500 mr-1"></i> Trending Queries</h4>
                <div id="keyword-trending" class="flex flex-wrap gap-2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Title Optimizer -->
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4"><i class="fas fa-wand-magic-sparkles text-purple-500 mr-2"></i>Title Optimizer</h3>
          <div class="flex gap-2 mb-4">
            <input type="text" id="seo-title-input" class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Enter your current title to get optimization suggestions..." onkeydown="if(event.key==='Enter')runTitleOptimize()">
            <button onclick="runTitleOptimize()" class="px-6 py-3 bg-purple-500 text-white rounded-xl text-sm font-semibold hover:bg-purple-600 transition">
              <i class="fas fa-wand-sparkles mr-1"></i> Optimize
            </button>
          </div>
          <div id="title-suggestions" class="hidden space-y-2"></div>
        </div>
      </div>

      <!-- RIGHT: Quick Actions & Tips (1 col) -->
      <div class="space-y-4">
        <div class="glass-card p-6">
          <h3 class="font-bold text-sm mb-3"><i class="fas fa-bolt text-yellow-500 mr-1"></i>Quick Actions</h3>
          <div class="space-y-2">
            <button onclick="document.getElementById('seo-analyze-title').focus()" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-stethoscope text-brand-500 mr-2"></i> Analyze SEO Score
            </button>
            <button onclick="document.getElementById('seo-keyword-input').focus()" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-yellow-50 hover:border-yellow-200 transition">
              <i class="fas fa-key text-yellow-500 mr-2"></i> Keyword Research
            </button>
            <button onclick="document.getElementById('seo-title-input').focus()" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 transition">
              <i class="fas fa-wand-magic-sparkles text-purple-500 mr-2"></i> Title Optimizer
            </button>
            <button onclick="navigate('video-post')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-red-50 hover:border-red-200 transition">
              <i class="fas fa-video text-red-500 mr-2"></i> Create Video Post
            </button>
          </div>
        </div>

        <div class="glass-card p-6 bg-gradient-to-br from-brand-50 to-purple-50 border-brand-100">
          <h3 class="font-bold text-sm mb-3"><i class="fas fa-graduation-cap text-brand-600 mr-1"></i>SEO Best Practices</h3>
          <ul class="text-xs text-gray-600 space-y-2.5">
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Title:</strong> 40-70 chars, include main keyword in first 60 chars</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Description:</strong> 200+ chars, keywords in first 2 lines, add timestamps</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Tags:</strong> 5-15 tags, mix broad + niche, include exact title</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Thumbnail:</strong> Custom > auto-generated. 1280x720 min.</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Hooks:</strong> Use numbers, power words, and questions in titles</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>CTA:</strong> Always include subscribe, like, comment prompts</span></li>
            <li class="flex gap-2"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><span><strong>Chapters:</strong> Timestamps create searchable chapters on YouTube</span></li>
          </ul>
        </div>

        <div class="glass-card p-6">
          <h3 class="font-bold text-sm mb-3"><i class="fas fa-chart-pie text-orange-500 mr-1"></i>SEO Usage</h3>
          <div class="text-xs text-gray-500 mb-2" id="seo-usage-text">0 analyses this month</div>
          <div class="w-full bg-gray-100 rounded-full h-2"><div id="seo-usage-bar" class="bg-brand-600 rounded-full h-2 transition-all" style="width:0%"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// SCHEDULED POSTS PAGE
// ============================================================
function buildScheduledPage(): string {
  return `
<div class="page" id="page-scheduled">
  <div class="fade-in">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-sm text-gray-500">View and manage all your scheduled and past posts.</p>
      </div>
      <button onclick="navigate('create')" class="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition"><i class="fas fa-plus mr-2"></i>New Post</button>
    </div>
    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button onclick="filterPosts('')" class="post-filter px-4 py-2 bg-brand-600 text-white text-sm rounded-lg">All</button>
      <button onclick="filterPosts('scheduled')" class="post-filter px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Scheduled</button>
      <button onclick="filterPosts('published')" class="post-filter px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Published</button>
      <button onclick="filterPosts('draft')" class="post-filter px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Drafts</button>
      <button onclick="filterPosts('failed')" class="post-filter px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Failed</button>
    </div>
    <!-- Posts Table -->
    <div class="glass-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th class="text-left p-4 font-medium">Post</th>
              <th class="text-left p-4 font-medium">Platforms</th>
              <th class="text-left p-4 font-medium">Schedule</th>
              <th class="text-left p-4 font-medium">Status</th>
              <th class="text-left p-4 font-medium">Viral</th>
              <th class="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody id="posts-table-body">
            <tr><td colspan="6" class="p-8 text-center text-gray-400">Loading posts...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// ACCOUNTS PAGE
// ============================================================
function buildAccountsPage(): string {
  return `
<div class="page" id="page-accounts">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Connect your social media accounts to publish, schedule, and track analytics.</p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" id="accounts-grid">
      ${['Instagram,fa-instagram,#E4405F', 'YouTube,fa-youtube,#FF0000', 'TikTok,fa-tiktok,#000000', 'Twitter / X,fa-twitter,#1DA1F2', 'LinkedIn,fa-linkedin,#0A66C2', 'Facebook,fa-facebook,#1877F2']
        .map(p => { const [name,icon,color] = p.split(','); const key = name.toLowerCase().replace(/\\s.*/, ''); return `
      <div class="glass-card p-6" id="acc-card-${key}">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:${color}15"><i class="fab ${icon} text-2xl" style="color:${color}"></i></div>
          <div>
            <div class="font-bold">${name}</div>
            <div class="text-xs text-gray-400" id="acc-status-${key}">Not connected</div>
          </div>
        </div>
        <div class="text-sm text-gray-500 mb-4" id="acc-info-${key}">Connect to enable publishing and analytics</div>
        <div class="flex gap-2">
          <button onclick="connectAccount('${key}')" id="acc-btn-${key}" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-brand-600 hover:text-white hover:border-brand-600 transition">
            <i class="fas fa-plug mr-1"></i> Connect
          </button>
          <button onclick="disconnectAccount('${key}')" id="acc-disconnect-${key}" class="hidden px-4 py-2 border border-red-200 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
            <i class="fas fa-unlink"></i>
          </button>
        </div>
      </div>`;}).join('')}
    </div>
    <div class="glass-card p-4 mt-6 bg-blue-50 border-blue-100">
      <p class="text-sm text-blue-700"><i class="fas fa-shield-halved mr-2"></i><strong>Security:</strong> We use OAuth 2.0 for all connections. We never access or store your passwords. Tokens are encrypted at rest and can be revoked anytime.</p>
    </div>
  </div>
</div>`;
}

// ============================================================
// ANALYTICS PAGE
// ============================================================
function buildAnalyticsPage(): string {
  return `
<div class="page" id="page-analytics">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Unified performance metrics across all your platforms.</p>
    
    <!-- Engagement Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="glass-card p-4 text-center stat-card">
        <div class="text-2xl font-bold text-blue-600" id="an-impressions">--</div>
        <div class="text-xs text-gray-400">Impressions</div>
      </div>
      <div class="glass-card p-4 text-center stat-card">
        <div class="text-2xl font-bold text-pink-600" id="an-likes">--</div>
        <div class="text-xs text-gray-400">Likes</div>
      </div>
      <div class="glass-card p-4 text-center stat-card">
        <div class="text-2xl font-bold text-green-600" id="an-comments">--</div>
        <div class="text-xs text-gray-400">Comments</div>
      </div>
      <div class="glass-card p-4 text-center stat-card">
        <div class="text-2xl font-bold text-purple-600" id="an-shares">--</div>
        <div class="text-xs text-gray-400">Shares</div>
      </div>
      <div class="glass-card p-4 text-center stat-card">
        <div class="text-2xl font-bold text-orange-600" id="an-rate">--%</div>
        <div class="text-xs text-gray-400">Engagement</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6 mb-6">
      <!-- Engagement Chart -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4">Engagement Overview</h3>
        <canvas id="engagement-chart" height="220"></canvas>
      </div>
      <!-- Best Posting Time Heatmap -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4"><i class="fas fa-fire text-orange-500 mr-1"></i> Best Posting Times</h3>
        <p class="text-xs text-gray-400 mb-3">Darker = Higher engagement. Schedule posts during peak times.</p>
        <div id="heatmap-container" class="overflow-x-auto"></div>
      </div>
    </div>

    <!-- Top Posts -->
    <div class="glass-card p-6">
      <h3 class="font-bold mb-4"><i class="fas fa-trophy text-yellow-500 mr-1"></i> Top Performing Posts</h3>
      <div id="top-posts-list" class="space-y-3">
        <div class="text-sm text-gray-400 text-center py-6">Loading...</div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// AI ASSISTANT PAGE
// ============================================================
function buildAIPage(): string {
  return `
<div class="page" id="page-ai">
  <div class="fade-in">
    <div class="grid lg:grid-cols-4 gap-6">
      <!-- Quick Actions -->
      <div class="lg:col-span-1 space-y-3">
        <div class="glass-card p-4">
          <h4 class="font-bold text-sm mb-3">Quick Generate</h4>
          <div class="space-y-2">
            <button onclick="quickAI('ideas')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-lightbulb text-yellow-500 mr-2"></i> Content Ideas
            </button>
            <button onclick="quickAI('caption')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-pen text-blue-500 mr-2"></i> Write Caption
            </button>
            <button onclick="quickAI('script')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-video text-red-500 mr-2"></i> Video Script
            </button>
            <button onclick="quickAI('hashtags')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-hashtag text-purple-500 mr-2"></i> Hashtags
            </button>
            <button onclick="quickAI('growth')" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-brand-50 hover:border-brand-200 transition">
              <i class="fas fa-chart-line text-green-500 mr-2"></i> Growth Strategy
            </button>
          </div>
        </div>
        <div class="glass-card p-4">
          <h4 class="font-bold text-sm mb-2">AI Usage</h4>
          <div class="text-xs text-gray-500 mb-2" id="ai-usage-text">0 / 20 requests this month</div>
          <div class="w-full bg-gray-100 rounded-full h-2"><div id="ai-usage-bar" class="bg-brand-600 rounded-full h-2 transition-all" style="width:0%"></div></div>
        </div>
      </div>

      <!-- Chat Interface -->
      <div class="lg:col-span-3">
        <div class="glass-card flex flex-col" style="height: calc(100vh - 180px);">
          <!-- Chat Header -->
          <div class="p-4 border-b border-gray-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center"><i class="fas fa-robot text-brand-600"></i></div>
            <div>
              <div class="font-bold text-sm">AI Creator Coach</div>
              <div class="text-xs text-green-500"><i class="fas fa-circle text-[6px] mr-1"></i>Online</div>
            </div>
          </div>
          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-100 flex-shrink-0 flex items-center justify-center"><i class="fas fa-robot text-brand-600 text-xs"></i></div>
              <div class="chat-bubble bg-gray-100 rounded-2xl rounded-tl-md p-3 text-sm text-gray-700">
                Hey! 👋 I'm your AI Creator Coach. I can help you with:<br><br>
                <strong>• Content Ideas</strong> — Generate trending topics<br>
                <strong>• Captions & Scripts</strong> — Write engaging copy<br>
                <strong>• Hashtag Strategy</strong> — Maximize reach<br>
                <strong>• Growth Advice</strong> — Personalized strategies<br><br>
                What would you like help with today?
              </div>
            </div>
          </div>
          <!-- Chat Input -->
          <div class="p-4 border-t border-gray-100">
            <form onsubmit="sendChat(event)" class="flex gap-2">
              <input type="text" id="chat-input" placeholder="Ask me anything about content creation..." class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <button type="submit" class="px-5 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition">
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// MONETIZATION PAGE
// ============================================================
function buildMonetizationPage(): string {
  return `
<div class="page" id="page-monetization">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Track earnings, manage brand partnerships, and optimize your creator income.</p>

    <!-- Revenue Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-5 stat-card">
        <div class="text-xs text-gray-400 mb-1">Total Earnings</div>
        <div class="text-2xl font-bold text-green-600" id="mon-earnings">$0</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-xs text-gray-400 mb-1">Pending Deals</div>
        <div class="text-2xl font-bold text-orange-600" id="mon-pending">0</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-xs text-gray-400 mb-1">Est. Post Rate</div>
        <div class="text-2xl font-bold text-brand-600" id="mon-rate">$0</div>
      </div>
      <div class="glass-card p-5 stat-card">
        <div class="text-xs text-gray-400 mb-1">Est. Video Rate</div>
        <div class="text-2xl font-bold text-purple-600" id="mon-video-rate">$0</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Brand Deals -->
      <div class="lg:col-span-2">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold"><i class="fas fa-handshake text-brand-500 mr-2"></i>Brand Deals</h3>
            <button onclick="showAddDeal()" class="px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700"><i class="fas fa-plus mr-1"></i>Add Deal</button>
          </div>
          <div id="deals-list" class="space-y-3">
            <div class="text-sm text-gray-400 text-center py-4">Loading...</div>
          </div>
        </div>
      </div>

      <!-- Media Kit & Rate Calculator -->
      <div class="space-y-4">
        <div class="glass-card p-6">
          <h3 class="font-bold mb-3"><i class="fas fa-file-invoice text-green-500 mr-2"></i>Media Kit</h3>
          <p class="text-sm text-gray-500 mb-4">Auto-generated professional media kit based on your real stats.</p>
          <button onclick="generateMediaKit()" class="w-full py-2.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition">
            <i class="fas fa-download mr-1"></i> Generate Media Kit
          </button>
        </div>
        <div class="glass-card p-6">
          <h3 class="font-bold mb-3"><i class="fas fa-calculator text-orange-500 mr-2"></i>Rate Calculator</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Instagram Post</span><span class="font-bold" id="rate-ig-post">--</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Instagram Story</span><span class="font-bold" id="rate-ig-story">--</span></div>
            <div class="flex justify-between"><span class="text-gray-500">YouTube Video</span><span class="font-bold" id="rate-yt-video">--</span></div>
            <div class="flex justify-between"><span class="text-gray-500">TikTok Video</span><span class="font-bold" id="rate-tt-video">--</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Deal Modal -->
    <div id="deal-modal" class="hidden fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="font-bold text-lg mb-4">Add Brand Deal</h3>
        <form onsubmit="saveDeal(event)" class="space-y-3">
          <input type="text" id="deal-brand" placeholder="Brand name" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <input type="number" id="deal-value" placeholder="Deal value ($)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <select id="deal-platform" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Platform</option><option>instagram</option><option>youtube</option><option>tiktok</option><option>twitter</option><option>linkedin</option>
          </select>
          <select id="deal-status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="negotiating">Negotiating</option><option value="confirmed">Confirmed</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
          </select>
          <input type="text" id="deal-deliverables" placeholder="Deliverables (e.g., 3 posts + 2 stories)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <input type="date" id="deal-deadline" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <div class="flex gap-2 pt-2">
            <button type="button" onclick="document.getElementById('deal-modal').classList.add('hidden')" class="flex-1 py-2 border border-gray-200 rounded-lg text-sm">Cancel</button>
            <button type="submit" class="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">Save Deal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// BILLING PAGE
// ============================================================
function buildBillingPage(): string {
  return `
<div class="page" id="page-billing">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Manage your subscription and billing information.</p>

    <!-- Current Plan -->
    <div class="glass-card p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <div class="text-xs text-gray-400 mb-1">Current Plan</div>
          <div class="text-2xl font-bold capitalize" id="billing-plan">Free</div>
          <div class="text-sm text-gray-500" id="billing-period"></div>
        </div>
        <button onclick="showUpgradeModal()" class="mt-4 sm:mt-0 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <i class="fas fa-arrow-up mr-1"></i> Upgrade Plan
        </button>
      </div>
    </div>

    <!-- Plan Comparison -->
    <div class="grid md:grid-cols-3 gap-4 mb-6">
      <div class="glass-card p-5 cursor-pointer hover:border-brand-500 transition" onclick="upgradePlan('free')">
        <div class="font-bold mb-1">Free</div><div class="text-2xl font-bold mb-3">$0</div>
        <div class="text-xs text-gray-500 space-y-1"><p>2 accounts</p><p>10 posts/mo</p><p>20 AI gens</p><p>Basic analytics</p></div>
      </div>
      <div class="glass-card p-5 border-brand-500 cursor-pointer hover:border-brand-500 transition" onclick="upgradePlan('pro')">
        <div class="inline-block px-2 py-0.5 bg-brand-100 text-brand-600 text-xs rounded-full mb-2">Popular</div>
        <div class="font-bold mb-1">Pro</div><div class="text-2xl font-bold mb-3">$19<span class="text-sm text-gray-400">/mo</span></div>
        <div class="text-xs text-gray-500 space-y-1"><p>10 accounts</p><p>100 posts/mo</p><p>500 AI gens</p><p>All features</p></div>
      </div>
      <div class="glass-card p-5 cursor-pointer hover:border-brand-500 transition" onclick="upgradePlan('business')">
        <div class="font-bold mb-1">Business</div><div class="text-2xl font-bold mb-3">$49<span class="text-sm text-gray-400">/mo</span></div>
        <div class="text-xs text-gray-500 space-y-1"><p>Unlimited</p><p>Unlimited</p><p>Unlimited</p><p>Priority support</p></div>
      </div>
    </div>

    <!-- Payment History -->
    <div class="glass-card p-6">
      <h3 class="font-bold mb-4">Payment History</h3>
      <div id="payments-list" class="space-y-2">
        <div class="text-sm text-gray-400 text-center py-4">No payments yet</div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// PRODUCTS PAGE
// ============================================================
function buildProductsPage(): string {
  return `
<div class="page" id="page-products">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Create, sell, and track digital products from one dashboard.</p>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card stat-card p-4">
        <div class="text-xs text-gray-400">Products</div>
        <div class="text-2xl font-black" id="prod-summary-count">0</div>
      </div>
      <div class="glass-card stat-card p-4">
        <div class="text-xs text-gray-400">Sales</div>
        <div class="text-2xl font-black" id="prod-summary-sales">0</div>
      </div>
      <div class="glass-card stat-card p-4">
        <div class="text-xs text-gray-400">Revenue</div>
        <div class="text-2xl font-black" id="prod-summary-revenue">$0</div>
      </div>
      <div class="glass-card stat-card p-4">
        <div class="text-xs text-gray-400">Weekly Summary</div>
        <div class="text-sm font-semibold mt-1" id="prod-summary-weekly">Loading...</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-5 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Create Product</h3>
          <div class="space-y-3">
            <input id="product-title" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Product title">
            <textarea id="product-description" rows="4" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" placeholder="What does the buyer get?"></textarea>
            <input id="product-price" type="number" min="1" step="1" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Price in USD cents, e.g. 2900">
            <select id="product-delivery-type" onchange="toggleProductDeliveryType()" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="file">Upload PDF or ZIP</option>
              <option value="link">Secure link access</option>
            </select>
            <div id="product-file-wrap">
              <input id="product-file" type="file" accept=".pdf,.zip,application/pdf,application/zip" onchange="handleProductFile(event)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <p id="product-file-status" class="text-xs text-gray-400 mt-1">No file selected.</p>
            </div>
            <div id="product-link-wrap" class="hidden">
              <input id="product-link" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="https://secure-link.example.com/private-resource">
            </div>
            <input id="product-thumbnail" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Thumbnail image URL">
            <button onclick="createProduct()" id="create-product-btn" class="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">Create Product</button>
          </div>
        </div>

        <div class="glass-card p-6">
          <h3 class="font-bold mb-3">AI Sales Suggestions</h3>
          <div id="product-ai-suggestions" class="space-y-2 text-sm text-gray-500">
            <div>Loading suggestions...</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-3 space-y-6">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold">Your Storefront</h3>
            <button onclick="copyStorefrontLink()" id="storefront-copy-btn" class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition">Copy Store Link</button>
          </div>
          <div id="storefront-link-box" class="text-sm text-gray-500">Loading storefront...</div>
        </div>

        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Products</h3>
          <div id="products-list" class="space-y-3">
            <div class="text-sm text-gray-400">Loading products...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function buildSettingsPage(): string {
  return `
<div class="page" id="page-settings">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Manage your account, preferences, and security settings.</p>

    <div class="max-w-2xl space-y-6">
      <!-- Profile -->
      <div class="glass-card p-6">
        <h3 class="font-bold mb-4">Profile</h3>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
            <input type="text" id="settings-name" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value="">
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input type="email" id="settings-email" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" readonly>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Creator Niche</label>
            <select id="settings-niche" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Select niche</option>
              <option>lifestyle</option><option>tech</option><option>fitness</option><option>beauty</option>
              <option>food</option><option>travel</option><option>business</option><option>gaming</option>
              <option>education</option><option>music</option><option>photography</option><option>fashion</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Timezone</label>
            <select id="settings-tz" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>UTC</option><option>America/New_York</option><option>America/Chicago</option><option>America/Denver</option>
              <option>America/Los_Angeles</option><option>Europe/London</option><option>Europe/Berlin</option><option>Asia/Tokyo</option>
              <option>Asia/Kolkata</option><option>Australia/Sydney</option>
            </select>
          </div>
          <button onclick="saveSettings()" class="px-6 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition">Save Changes</button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="glass-card p-6 border-red-200">
        <h3 class="font-bold text-red-600 mb-4">Danger Zone</h3>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">Delete Account</div>
            <div class="text-xs text-gray-400">Permanently delete your account and all data</div>
          </div>
          <button class="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition">Delete Account</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// GROWTH COACH PAGE
// ============================================================
function buildGrowthCoachPage(): string {
  return `
<div class="page" id="page-growth-coach">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Your personal AI coach — daily recommendations, weekly reports, and growth insights.</p>

    <!-- Streak Banner -->
    <div id="gc-streak-banner" class="glass-card p-4 mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div class="flex items-center gap-4">
        <div class="text-3xl">🔥</div>
        <div>
          <div class="font-bold text-lg" id="gc-streak-count">0 Day Streak</div>
          <div class="text-sm opacity-90" id="gc-streak-msg">Start posting to build your streak!</div>
        </div>
      </div>
    </div>

    <!-- Today's Recommendations -->
    <h3 class="font-bold text-sm uppercase text-gray-400 mb-3">Today's Recommendations</h3>
    <div id="gc-recommendations" class="space-y-3 mb-8">
      <div class="text-sm text-gray-400">Loading recommendations...</div>
    </div>

    <!-- Weekly Report -->
    <h3 class="font-bold text-sm uppercase text-gray-400 mb-3">Weekly Report</h3>
    <div id="gc-weekly" class="glass-card p-6 mb-6">
      <div class="text-sm text-gray-400">Loading weekly report...</div>
    </div>

    <!-- Best Posting Time -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass-card p-4 text-center">
        <div class="text-2xl mb-1">📅</div>
        <div class="text-xs text-gray-400">Best Day</div>
        <div id="gc-best-day" class="font-bold">—</div>
      </div>
      <div class="glass-card p-4 text-center">
        <div class="text-2xl mb-1">⏰</div>
        <div class="text-xs text-gray-400">Best Time</div>
        <div id="gc-best-time" class="font-bold">—</div>
      </div>
      <div class="glass-card p-4 text-center">
        <div class="text-2xl mb-1">🎯</div>
        <div class="text-xs text-gray-400">Focus Area</div>
        <div id="gc-focus" class="font-bold">—</div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// AI ENGINE PAGE
// ============================================================
function buildAIEnginePage(): string {
  return `
<div class="page" id="page-ai-engine">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Advanced AI content generator with niche-specific prompts and quality scoring.</p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Input Panel -->
      <div class="lg:col-span-1 space-y-4">
        <div class="glass-card p-5">
          <h3 class="font-bold mb-4">Generate Content</h3>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Content Type</label>
              <select id="aie-type" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="caption">Caption</option>
                <option value="hook">Hook Ideas</option>
                <option value="viral_reel">Viral Reel Caption</option>
                <option value="youtube_script">YouTube Script</option>
                <option value="script">Video Script</option>
                <option value="hashtags">Smart Hashtags</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Platform</label>
              <select id="aie-platform" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Audience</label>
              <select id="aie-audience" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="general">General</option>
                <option value="gen_z">Gen Z</option>
                <option value="millennials">Millennials</option>
                <option value="professionals">Professionals</option>
                <option value="entrepreneurs">Entrepreneurs</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Tone</label>
              <select id="aie-tone" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="hinglish">Hinglish</option>
                <option value="humorous">Humorous</option>
                <option value="motivational">Motivational</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Niche</label>
              <input id="aie-niche" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. tech, fitness, lifestyle">
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 mb-1 block">Topic / Idea</label>
              <textarea id="aie-input" rows="3" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="What do you want to create content about?"></textarea>
            </div>
            <button onclick="generateAIContent()" id="aie-btn" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-brand-600 text-white text-sm rounded-lg hover:opacity-90 transition font-semibold">
              <i class="fas fa-wand-magic-sparkles mr-2"></i>Generate
            </button>
            <div class="text-xs text-gray-400 text-center" id="aie-usage">— / — used today</div>
          </div>
        </div>
      </div>

      <!-- Output Panel -->
      <div class="lg:col-span-2">
        <div id="aie-output-empty" class="glass-card p-12 text-center">
          <div class="text-5xl mb-4">✨</div>
          <div class="text-gray-400 text-sm">Choose your settings and generate content.<br>AI will create platform-optimized content with scoring.</div>
        </div>
        <div id="aie-output" class="hidden space-y-4">
          <!-- Score Card -->
          <div class="glass-card p-5">
            <h3 class="font-bold mb-3">Content Score</h3>
            <div class="grid grid-cols-4 gap-3">
              <div class="text-center">
                <div class="text-3xl font-black" id="aie-score-overall">—</div>
                <div class="text-[10px] text-gray-400 uppercase">Overall</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-orange-500" id="aie-score-hook">—</div>
                <div class="text-[10px] text-gray-400 uppercase">Hook</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-blue-500" id="aie-score-read">—</div>
                <div class="text-[10px] text-gray-400 uppercase">Readability</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-green-500" id="aie-score-engage">—</div>
                <div class="text-[10px] text-gray-400 uppercase">Engagement</div>
              </div>
            </div>
            <div id="aie-suggestions" class="mt-3 space-y-1"></div>
          </div>
          <!-- Generated Content -->
          <div class="glass-card p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold">Generated Content</h3>
              <button onclick="copyAIContent()" class="text-xs text-brand-600 hover:text-brand-700"><i class="fas fa-copy mr-1"></i>Copy</button>
            </div>
            <pre id="aie-content" class="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-[500px] overflow-y-auto"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// PRO ANALYTICS PAGE
// ============================================================
function buildProAnalyticsPage(): string {
  return `
<div class="page" id="page-pro-analytics">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Advanced metrics, competitor tracking, and content performance ranking.</p>

    <div id="pa-locked" class="hidden glass-card p-12 text-center">
      <div class="text-5xl mb-4">📊</div>
      <h3 class="font-bold text-lg mb-2">Pro Analytics</h3>
      <p class="text-gray-400 text-sm mb-4">Unlock advanced insights, competitor tracking, and content ranking with a Pro plan.</p>
      <button onclick="navigate('pricing')" class="px-6 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition">Upgrade to Pro</button>
    </div>

    <div id="pa-content" class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card stat-card p-4">
          <div class="text-xs text-gray-400">Engagement Rate</div>
          <div class="text-2xl font-black" id="pa-engagement-rate">—</div>
          <div class="text-xs mt-1" id="pa-engagement-trend"></div>
        </div>
        <div class="glass-card stat-card p-4">
          <div class="text-xs text-gray-400">Avg. CTR</div>
          <div class="text-2xl font-black" id="pa-ctr">—</div>
          <div class="text-xs mt-1" id="pa-ctr-trend"></div>
        </div>
        <div class="glass-card stat-card p-4">
          <div class="text-xs text-gray-400">Growth Rate</div>
          <div class="text-2xl font-black" id="pa-growth-rate">—</div>
          <div class="text-xs mt-1" id="pa-growth-trend"></div>
        </div>
        <div class="glass-card stat-card p-4">
          <div class="text-xs text-gray-400">Total Posts</div>
          <div class="text-2xl font-black" id="pa-total-posts">—</div>
        </div>
      </div>

      <!-- Content Ranking -->
      <div class="glass-card p-5">
        <h3 class="font-bold mb-4"><i class="fas fa-ranking-star text-yellow-500 mr-2"></i>Content Ranking</h3>
        <div id="pa-ranking" class="space-y-2">
          <div class="text-sm text-gray-400">Loading content ranking...</div>
        </div>
      </div>

      <!-- Competitor Tracking -->
      <div class="glass-card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold"><i class="fas fa-binoculars text-blue-500 mr-2"></i>Competitor Tracking</h3>
          <button onclick="showAddCompetitor()" class="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition"><i class="fas fa-plus mr-1"></i>Add</button>
        </div>
        <div id="pa-competitors" class="space-y-3">
          <div class="text-sm text-gray-400">No competitors added yet.</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// GAMIFICATION / ACHIEVEMENTS PAGE
// ============================================================
function buildGamificationPage(): string {
  return `
<div class="page" id="page-gamification">
  <div class="fade-in">
    <p class="text-sm text-gray-500 mb-6">Track your progress, earn badges, and climb the leaderboard.</p>

    <!-- XP & Level -->
    <div class="glass-card p-6 mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      <div class="flex items-center gap-6">
        <div class="text-center">
          <div class="text-4xl font-black" id="gam-level">1</div>
          <div class="text-xs opacity-90">Level</div>
        </div>
        <div class="flex-1">
          <div class="flex justify-between text-sm mb-1">
            <span id="gam-xp">0 XP</span>
            <span id="gam-xp-next">100 XP to next level</span>
          </div>
          <div class="w-full bg-white/30 rounded-full h-3">
            <div id="gam-xp-bar" class="bg-white rounded-full h-3 transition-all" style="width:0%"></div>
          </div>
        </div>
        <div class="text-center">
          <div class="text-4xl">🔥</div>
          <div class="text-sm font-bold" id="gam-streak">0</div>
          <div class="text-xs opacity-90">Day Streak</div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card stat-card p-4 text-center">
        <div class="text-2xl font-black" id="gam-posts">0</div>
        <div class="text-xs text-gray-400">Total Posts</div>
      </div>
      <div class="glass-card stat-card p-4 text-center">
        <div class="text-2xl font-black" id="gam-ai-uses">0</div>
        <div class="text-xs text-gray-400">AI Uses</div>
      </div>
      <div class="glass-card stat-card p-4 text-center">
        <div class="text-2xl font-black" id="gam-longest">0</div>
        <div class="text-xs text-gray-400">Longest Streak</div>
      </div>
      <div class="glass-card stat-card p-4 text-center">
        <div class="text-2xl font-black" id="gam-badges-count">0</div>
        <div class="text-xs text-gray-400">Badges Earned</div>
      </div>
    </div>

    <!-- Badges -->
    <h3 class="font-bold text-sm uppercase text-gray-400 mb-3">Badges</h3>
    <div id="gam-badges" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
      <div class="text-sm text-gray-400">Loading badges...</div>
    </div>

    <!-- Leaderboard -->
    <h3 class="font-bold text-sm uppercase text-gray-400 mb-3">Leaderboard</h3>
    <div class="glass-card p-5">
      <div id="gam-leaderboard" class="space-y-2">
        <div class="text-sm text-gray-400">Loading leaderboard...</div>
      </div>
    </div>
  </div>
</div>`;
}

// ============================================================
// PRICING PAGE
// ============================================================
function buildPricingPage(): string {
  return `
<div class="page" id="page-pricing">
  <div class="fade-in">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-black mb-2">Choose Your Growth Plan</h2>
      <p class="text-gray-500 text-sm">Invest in your creator journey. Cancel anytime.</p>
      <div class="inline-flex bg-gray-100 rounded-lg p-1 mt-4">
        <button onclick="setPricingCycle('monthly')" id="price-monthly-btn" class="px-4 py-1.5 text-sm rounded-md bg-white shadow font-semibold">Monthly</button>
        <button onclick="setPricingCycle('yearly')" id="price-yearly-btn" class="px-4 py-1.5 text-sm rounded-md text-gray-500">Yearly <span class="text-green-500 text-xs">-17%</span></button>
      </div>
    </div>

    <div id="pricing-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="text-sm text-gray-400 text-center col-span-4">Loading plans...</div>
    </div>
  </div>
</div>`;
}

// ============================================================
// MAIN DASHBOARD JAVASCRIPT
// ============================================================
function dashboardScript(): string {
  return `
    const API = '';
    const token = localStorage.getItem('token') || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    let currentPage = 'dashboard';
    let currentFilter = '';
    let growthChart = null;
    let engagementChart = null;

    // ---- Navigation ----
    function navigate(page) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      const el = document.getElementById('page-' + page);
      if (el) { el.classList.add('active'); el.querySelector('.fade-in')?.classList.remove('fade-in'); void el.offsetWidth; el.querySelector('div')?.classList.add('fade-in'); }
      const link = document.querySelector('[data-page="' + page + '"]');
      if (link) link.classList.add('active');
      
      const titles = { dashboard:'Dashboard', create:'Create Post', 'video-post':'Video Post', scheduled:'Scheduled Posts', accounts:'Accounts', analytics:'Analytics', 'video-analytics':'Video Analytics', seo:'SEO Tools', ai:'AI Assistant', monetization:'Monetization', products:'Products', billing:'Billing', settings:'Settings', 'growth-coach':'Growth Coach', 'ai-engine':'AI Engine', 'pro-analytics':'Pro Analytics', gamification:'Achievements', pricing:'Upgrade Plan' };
      document.getElementById('page-title').textContent = titles[page] || page;
      currentPage = page;
      
      // Load page data
      if (page === 'dashboard') loadDashboard();
      else if (page === 'create') loadProductOptions();
      else if (page === 'scheduled') loadPosts();
      else if (page === 'accounts') loadAccounts();
      else if (page === 'analytics') loadAnalytics();
      else if (page === 'video-analytics') loadVideoAnalytics();
      else if (page === 'monetization') loadMonetization();
      else if (page === 'products') loadProductsDashboard();
      else if (page === 'billing') loadBilling();
      else if (page === 'settings') loadSettings();
      else if (page === 'growth-coach') loadGrowthCoach();
      else if (page === 'ai-engine') loadAIEngine();
      else if (page === 'pro-analytics') loadProAnalytics();
      else if (page === 'gamification') loadGamification();
      else if (page === 'pricing') loadPricingPlans();

      // Close mobile sidebar
      document.getElementById('sidebar').classList.add('-translate-x-full');
      document.getElementById('sidebar-overlay').classList.add('hidden');
      
      window.history.pushState({}, '', '/app/' + (page === 'dashboard' ? '' : page));
      return false;
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('-translate-x-full');
      document.getElementById('sidebar-overlay').classList.toggle('hidden');
    }

    function toggleNotifications() {
      document.getElementById('notif-dropdown').classList.toggle('hidden');
    }

    // ---- Init ----
    async function init() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      document.getElementById('sidebar-name').textContent = user.name || 'Creator';
      document.getElementById('sidebar-plan').textContent = (user.plan || 'free').toUpperCase() + ' Plan';
      document.getElementById('sidebar-avatar').textContent = (user.name || 'C').charAt(0).toUpperCase();
      document.getElementById('preview-avatar').textContent = (user.name || 'C').charAt(0).toUpperCase();
      document.getElementById('preview-name').textContent = user.name || 'You';
      
      if (user.niche) {
        document.getElementById('settings-niche').value = user.niche;
      }
      
      loadDashboard();
      loadNotifications();
      
      // Handle browser path
      const path = window.location.pathname.replace('/app/', '').replace('/app', '');
      if (path && path !== '/') navigate(path);
      
      // Live preview for create page
      document.getElementById('post-caption')?.addEventListener('input', updatePreview);
      document.getElementById('post-hashtags')?.addEventListener('input', updatePreview);
    }

    // ---- Dashboard ----
    async function loadDashboard() {
      try {
        const res = await fetch(API + '/api/analytics/dashboard', { headers });
        const json = await res.json();
        if (!json.success) return;
        const s = json.data.stats;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        document.getElementById('dash-username').textContent = user.name || 'Creator';
        document.getElementById('stat-followers').textContent = formatNum(s.total_followers);
        document.getElementById('stat-engagement').textContent = s.engagement_rate + '%';
        document.getElementById('stat-posts').textContent = s.total_posts;
        document.getElementById('stat-scheduled').textContent = s.scheduled_posts;

        // Upcoming posts
        const upcoming = json.data.upcoming_posts || [];
        const upEl = document.getElementById('upcoming-posts');
        if (upcoming.length === 0) {
          upEl.innerHTML = '<div class="text-sm text-gray-400 text-center py-4"><i class="fas fa-calendar-plus mb-2 text-2xl"></i><p>No upcoming posts</p></div>';
        } else {
          upEl.innerHTML = upcoming.map(p => {
            const platforms = JSON.parse(p.platforms || '[]');
            return '<div class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"><div class="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></div><div class="min-w-0"><p class="text-sm font-medium truncate">' + truncate(p.caption, 50) + '</p><p class="text-xs text-gray-400 mt-0.5">' + formatDate(p.scheduled_at) + '</p><div class="flex gap-1 mt-1">' + platforms.map(pl => '<span class="text-xs bg-gray-200 px-1.5 py-0.5 rounded capitalize">' + pl + '</span>').join('') + '</div></div></div>';
          }).join('');
        }

        // AI Recommendations
        const recs = json.data.ai_recommendations || [];
        document.getElementById('ai-recs').innerHTML = recs.map(r => {
          const icons = { timing: 'fa-clock text-blue-500', content: 'fa-pen text-purple-500', growth: 'fa-chart-line text-green-500', hashtag: 'fa-hashtag text-orange-500' };
          return '<div class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"><i class="fas ' + (icons[r.type] || 'fa-lightbulb text-yellow-500') + ' mt-0.5"></i><p class="text-sm text-gray-600">' + r.text + '</p></div>';
        }).join('');

        // Growth chart
        loadGrowthChart(30);
      } catch (e) { console.error('Dashboard load error:', e); }
    }

    async function loadGrowthChart(days) {
      try {
        const res = await fetch(API + '/api/analytics/growth?days=' + days, { headers });
        const json = await res.json();
        if (!json.success) return;
        
        const data = json.data.growth || [];
        const labels = [...new Set(data.map(d => d.recorded_date))].sort();
        const values = labels.map(date => {
          const entries = data.filter(d => d.recorded_date === date);
          return entries.reduce((sum, e) => sum + e.metric_value, 0);
        });

        const ctx = document.getElementById('growth-chart');
        if (growthChart) growthChart.destroy();
        growthChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels.map(l => l.substring(5)),
            datasets: [{ label: 'Followers', data: values, borderColor: '#3b6cf5', backgroundColor: 'rgba(59,108,245,0.1)', fill: true, tension: 0.4, pointRadius: 3 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false }, x: { grid: { display: false } } } }
        });
      } catch (e) {}
    }

    // ---- Posts ----
    async function loadPosts() {
      try {
        const url = API + '/api/posts' + (currentFilter ? '?status=' + currentFilter : '');
        const res = await fetch(url, { headers });
        const json = await res.json();
        if (!json.success) return;
        
        const posts = json.data.posts || [];
        const tbody = document.getElementById('posts-table-body');
        if (posts.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-400"><i class="fas fa-inbox text-3xl mb-2"></i><p>No posts found</p></td></tr>';
          return;
        }
        tbody.innerHTML = posts.map(p => {
          const platforms = JSON.parse(p.platforms || '[]');
          const statusColors = { draft: 'bg-gray-100 text-gray-600', scheduled: 'bg-blue-100 text-blue-700', published: 'bg-green-100 text-green-700', publishing: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700' };
          return '<tr class="border-b border-gray-50 hover:bg-gray-50">' +
            '<td class="p-4"><p class="text-sm font-medium truncate max-w-[200px]">' + truncate(p.caption, 60) + '</p><p class="text-xs text-gray-400">' + (p.media_type || 'text') + '</p></td>' +
            '<td class="p-4"><div class="flex gap-1">' + platforms.map(pl => '<span class="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">' + pl + '</span>').join('') + '</div></td>' +
            '<td class="p-4 text-sm text-gray-500">' + (p.scheduled_at ? formatDate(p.scheduled_at) : '-') + '</td>' +
            '<td class="p-4"><span class="text-xs px-2 py-1 rounded-full font-medium ' + (statusColors[p.status] || '') + '">' + p.status + '</span></td>' +
            '<td class="p-4"><span class="text-sm font-bold ' + (p.viral_score > 70 ? 'text-green-600' : p.viral_score > 40 ? 'text-orange-500' : 'text-gray-400') + '">' + p.viral_score + '</span></td>' +
            '<td class="p-4 text-right"><div class="flex gap-2 justify-end">' +
              (p.status === 'draft' || p.status === 'scheduled' ? '<button onclick="publishPost(\\'' + p.id + '\\')" class="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"><i class="fas fa-paper-plane"></i></button>' : '') +
              '<button onclick="deletePost(\\'' + p.id + '\\')" class="text-xs px-2 py-1 bg-red-50 text-red-500 rounded hover:bg-red-100"><i class="fas fa-trash"></i></button>' +
            '</div></td></tr>';
        }).join('');
      } catch (e) { console.error('Load posts error:', e); }
    }

    function filterPosts(status) {
      currentFilter = status;
      document.querySelectorAll('.post-filter').forEach(b => { b.className = 'post-filter px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50'; });
      event.target.className = 'post-filter px-4 py-2 bg-brand-600 text-white text-sm rounded-lg';
      loadPosts();
    }

    async function savePost(status) {
      const caption = document.getElementById('post-caption').value;
      if (!caption.trim()) return alert('Please write a caption');
      
      const platforms = [...document.querySelectorAll('.platform-cb:checked')].map(c => c.value);
      if (platforms.length === 0) return alert('Select at least one platform');
      
      const scheduled_at = document.getElementById('post-schedule').value;
      if (status === 'scheduled' && !scheduled_at) return alert('Select a schedule date');
      
      const hashtags = document.getElementById('post-hashtags').value.split(/\s+/).filter(h => h.startsWith('#'));
      const attached_product_id = document.getElementById('attach-product-select').value;
      
      try {
        const res = await fetch(API + '/api/posts', {
          method: 'POST', headers,
          body: JSON.stringify({ caption, platforms, status, scheduled_at, hashtags, media_type: 'text', attached_product_id })
        });
        const json = await res.json();
        if (json.success) {
          alert('Post ' + (status === 'draft' ? 'saved as draft' : 'scheduled') + '! Viral Score: ' + json.data.viral_score);
          document.getElementById('post-caption').value = '';
          document.getElementById('post-hashtags').value = '';
          document.getElementById('post-schedule').value = '';
          document.getElementById('attach-product-select').value = '';
          document.querySelectorAll('.platform-cb').forEach(c => c.checked = false);
          navigate('scheduled');
        } else {
          alert(json.message || 'Failed to save');
        }
      } catch (e) { alert('Error saving post'); }
    }

    async function publishPost(id) {
      if (!confirm('Publish this post now?')) return;
      try {
        const res = await fetch(API + '/api/posts/' + id + '/publish', { method: 'POST', headers });
        const json = await res.json();
        alert(json.success ? 'Published!' : json.message);
        loadPosts();
      } catch (e) { alert('Publish failed'); }
    }

    async function deletePost(id) {
      if (!confirm('Delete this post?')) return;
      try {
        await fetch(API + '/api/posts/' + id, { method: 'DELETE', headers });
        loadPosts();
      } catch (e) { alert('Delete failed'); }
    }

    // ---- Accounts ----
    async function loadAccounts() {
      try {
        const res = await fetch(API + '/api/accounts', { headers });
        const json = await res.json();
        if (!json.success) return;
        (json.data.accounts || []).forEach(a => {
          const key = a.platform;
          const statusEl = document.getElementById('acc-status-' + key);
          const infoEl = document.getElementById('acc-info-' + key);
          const btnEl = document.getElementById('acc-btn-' + key);
          const discEl = document.getElementById('acc-disconnect-' + key);
          if (statusEl) {
            statusEl.innerHTML = '<span class="text-green-500"><i class="fas fa-circle text-[6px] mr-1"></i>Connected</span>';
            infoEl.textContent = a.platform_username + ' • ' + formatNum(a.followers_count) + ' followers';
            btnEl.textContent = 'Connected';
            btnEl.className = 'flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium cursor-default';
            btnEl.disabled = true;
            discEl.classList.remove('hidden');
            discEl.dataset.id = a.id;
          }
        });
      } catch (e) {}
    }

    async function connectAccount(platform) {
      try {
        const res = await fetch(API + '/api/accounts/connect', {
          method: 'POST', headers, body: JSON.stringify({ platform })
        });
        const json = await res.json();
        if (json.success) loadAccounts();
        else alert(json.message);
      } catch (e) { alert('Connection failed'); }
    }

    async function disconnectAccount(platform) {
      const btn = document.getElementById('acc-disconnect-' + platform);
      const id = btn?.dataset?.id;
      if (!id || !confirm('Disconnect ' + platform + '?')) return;
      try {
        await fetch(API + '/api/accounts/' + id, { method: 'DELETE', headers });
        location.reload();
      } catch (e) {}
    }

    // ---- Analytics ----
    async function loadAnalytics() {
      try {
        const [dashRes, engRes, heatRes, topRes] = await Promise.all([
          fetch(API + '/api/analytics/dashboard', { headers }),
          fetch(API + '/api/analytics/engagement', { headers }),
          fetch(API + '/api/analytics/heatmap', { headers }),
          fetch(API + '/api/analytics/top-posts', { headers })
        ]);
        const [dash, eng, heat, top] = await Promise.all([dashRes.json(), engRes.json(), heatRes.json(), topRes.json()]);
        
        if (dash.success) {
          const s = dash.data.stats;
          document.getElementById('an-impressions').textContent = formatNum(s.weekly_impressions);
          document.getElementById('an-likes').textContent = formatNum(s.weekly_likes);
          document.getElementById('an-comments').textContent = formatNum(s.weekly_comments);
          document.getElementById('an-shares').textContent = formatNum(s.weekly_shares);
          document.getElementById('an-rate').textContent = s.engagement_rate + '%';
        }

        // Engagement chart
        if (eng.success) {
          const data = eng.data.engagement || [];
          const platforms = [...new Set(data.map(d => d.platform))];
          const colors = { instagram: '#E4405F', youtube: '#FF0000', tiktok: '#000', twitter: '#1DA1F2', linkedin: '#0A66C2', facebook: '#1877F2' };
          
          const ctx = document.getElementById('engagement-chart');
          if (engagementChart) engagementChart.destroy();
          engagementChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Impressions', 'Likes', 'Comments', 'Shares'],
              datasets: platforms.map(p => ({
                label: p, backgroundColor: colors[p] || '#999',
                data: ['impressions','likes','comments','shares'].map(m => {
                  const entry = data.find(d => d.platform === p && d.metric_type === m);
                  return entry ? entry.total : 0;
                })
              }))
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
          });
        }

        // Heatmap
        if (heat.success) renderHeatmap(heat.data.heatmap);

        // Top Posts
        if (top.success) {
          const posts = top.data.top_posts || [];
          const el = document.getElementById('top-posts-list');
          if (posts.length === 0) { el.innerHTML = '<div class="text-sm text-gray-400 text-center py-4">No published posts yet</div>'; return; }
          el.innerHTML = posts.slice(0, 5).map((p, i) => 
            '<div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"><span class="text-lg font-bold text-gray-300 w-6">' + (i+1) + '</span><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">' + truncate(p.caption, 60) + '</p><div class="flex gap-3 mt-1 text-xs text-gray-400"><span><i class="fas fa-eye mr-1"></i>' + formatNum(p.impressions || 0) + '</span><span><i class="fas fa-heart mr-1"></i>' + formatNum(p.likes || 0) + '</span><span><i class="fas fa-comment mr-1"></i>' + formatNum(p.comments || 0) + '</span></div></div><div class="text-right"><span class="text-sm font-bold ' + (p.viral_score > 70 ? 'text-green-600' : 'text-orange-500') + '">' + p.viral_score + '</span><div class="text-xs text-gray-400">viral</div></div></div>'
          ).join('');
        }
      } catch (e) { console.error('Analytics error:', e); }
    }

    function renderHeatmap(data) {
      const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      const hours = Array.from({length:24}, (_, i) => i);
      let html = '<div class="flex gap-1"><div class="w-8"></div>' + hours.filter(h => h % 3 === 0).map(h => '<div class="text-[9px] text-gray-400" style="width:45px">' + (h < 10 ? '0' : '') + h + ':00</div>').join('') + '</div>';
      days.forEach(day => {
        html += '<div class="flex items-center gap-1 mb-1"><div class="w-8 text-[10px] text-gray-400">' + day + '</div>';
        hours.forEach(h => {
          const entry = data.find(d => d.day === day && d.hour === h);
          const val = entry ? entry.value : 0;
          const opacity = Math.max(0.1, val / 100);
          html += '<div class="heatmap-cell" style="background:rgba(59,108,245,' + opacity + ')" title="' + day + ' ' + h + ':00 - Score: ' + val + '"></div>';
        });
        html += '</div>';
      });
      document.getElementById('heatmap-container').innerHTML = html;
    }

    // ---- AI Assistant ----
    async function sendChat(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      if (!message) return;
      
      appendChat('user', message);
      input.value = '';
      appendChat('typing', '');

      try {
        const res = await fetch(API + '/api/ai/chat', { method: 'POST', headers, body: JSON.stringify({ message }) });
        const json = await res.json();
        removeTyping();
        appendChat('ai', json.success ? json.data.response : 'Sorry, something went wrong.');
      } catch (e) { removeTyping(); appendChat('ai', 'Network error. Please try again.'); }
    }

    function appendChat(role, text) {
      const container = document.getElementById('chat-messages');
      const div = document.createElement('div');
      div.className = role === 'user' ? 'flex gap-3 justify-end' : 'flex gap-3';
      
      if (role === 'typing') {
        div.id = 'typing-indicator';
        div.innerHTML = '<div class="w-8 h-8 rounded-lg bg-brand-100 flex-shrink-0 flex items-center justify-center"><i class="fas fa-robot text-brand-600 text-xs"></i></div><div class="chat-bubble bg-gray-100 rounded-2xl rounded-tl-md p-3 text-sm text-gray-400"><i class="fas fa-circle-notch fa-spin mr-1"></i> Thinking...</div>';
      } else if (role === 'user') {
        div.innerHTML = '<div class="chat-bubble bg-brand-600 text-white rounded-2xl rounded-tr-md p-3 text-sm">' + escapeHtml(text) + '</div>';
      } else {
        div.innerHTML = '<div class="w-8 h-8 rounded-lg bg-brand-100 flex-shrink-0 flex items-center justify-center"><i class="fas fa-robot text-brand-600 text-xs"></i></div><div class="chat-bubble bg-gray-100 rounded-2xl rounded-tl-md p-3 text-sm text-gray-700 whitespace-pre-wrap">' + escapeHtml(text) + '</div>';
      }
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function removeTyping() { document.getElementById('typing-indicator')?.remove(); }

    function quickAI(type) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const niche = user.niche || 'content creation';
      const messages = { ideas: 'Give me content ideas for ' + niche, caption: 'Write a viral caption about ' + niche, script: 'Write a 60-second video script about ' + niche, hashtags: 'Give me trending hashtags for ' + niche, growth: 'Give me a growth strategy for ' + niche };
      document.getElementById('chat-input').value = messages[type] || '';
      sendChat(new Event('submit'));
    }

    // ---- AI Generate for Create Post ----
    async function aiGenerate(type) {
      const caption = document.getElementById('post-caption').value;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const input = caption || user.niche || 'content creation';
      
      try {
        const res = await fetch(API + '/api/ai/generate', { method: 'POST', headers, body: JSON.stringify({ type, input }) });
        const json = await res.json();
        if (json.success) {
          document.getElementById('ai-output').classList.remove('hidden');
          document.getElementById('ai-output-text').textContent = json.data.output;
          
          if (type === 'viral_score') {
            const scoreMatch = json.data.output.match(/Score:\\s*(\\d+)/);
            if (scoreMatch) {
              const score = parseInt(scoreMatch[1]);
              document.getElementById('viral-score-card').classList.remove('hidden');
              document.getElementById('viral-score-value').textContent = score + '/100';
              document.getElementById('viral-score-bar').style.width = score + '%';
            }
          }
        }
      } catch (e) { alert('AI generation failed'); }
    }

    function useAISuggestion() {
      const text = document.getElementById('ai-output-text').textContent;
      const caption = document.getElementById('post-caption');
      if (text.includes('#')) {
        document.getElementById('post-hashtags').value = text;
      } else {
        caption.value = text;
      }
      document.getElementById('ai-output').classList.add('hidden');
      updatePreview();
    }

    // ---- Live Preview ----
    function updatePreview() {
      const caption = document.getElementById('post-caption').value;
      const hashtags = document.getElementById('post-hashtags').value;
      document.getElementById('preview-caption').textContent = caption || 'Your caption will appear here...';
      document.getElementById('preview-hashtags').textContent = hashtags;
    }

    function switchPreview(platform) {
      document.querySelectorAll('.preview-tab').forEach(t => { t.className = 'preview-tab flex-1 py-2 text-xs rounded-md text-gray-500'; });
      const active = document.querySelector('[data-tab="' + platform + '"]');
      if (active) active.className = 'preview-tab flex-1 py-2 text-xs rounded-md bg-white shadow-sm font-medium';
    }

    function insertEmoji() {
      const emojis = ['😊','🔥','💡','🚀','✨','💪','🎯','❤️','🎉','👇','💰','🏆'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const ta = document.getElementById('post-caption');
      ta.value += ' ' + emoji;
      updatePreview();
    }

    // ---- Monetization ----
    async function loadMonetization() {
      try {
        const res = await fetch(API + '/api/monetization/overview', { headers });
        const json = await res.json();
        if (!json.success) return;
        const d = json.data;
        document.getElementById('mon-earnings').textContent = '$' + (d.total_earnings / 100).toLocaleString();
        document.getElementById('mon-pending').textContent = d.pending_deals;
        document.getElementById('mon-rate').textContent = '$' + d.rate_estimate.per_post;
        document.getElementById('mon-video-rate').textContent = '$' + d.rate_estimate.per_video;
        document.getElementById('rate-ig-post').textContent = '$' + d.rate_estimate.per_post;
        document.getElementById('rate-ig-story').textContent = '$' + d.rate_estimate.per_story;
        document.getElementById('rate-yt-video').textContent = '$' + d.rate_estimate.per_video;
        document.getElementById('rate-tt-video').textContent = '$' + Math.round(d.rate_estimate.per_video * 0.6);
        
        const deals = d.deals || [];
        const el = document.getElementById('deals-list');
        if (deals.length === 0) {
          el.innerHTML = '<div class="text-sm text-gray-400 text-center py-4">No brand deals yet. Add your first one!</div>';
        } else {
          const statusColors = { negotiating: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', in_progress: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' };
          el.innerHTML = deals.map(deal => 
            '<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"><div class="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center"><i class="fas fa-handshake text-brand-600"></i></div><div class="flex-1 min-w-0"><p class="font-medium text-sm">' + deal.brand_name + '</p><p class="text-xs text-gray-400">' + (deal.deliverables || 'No deliverables specified') + '</p></div><div class="text-right"><p class="font-bold text-sm">$' + (deal.deal_value / 100).toLocaleString() + '</p><span class="text-xs px-2 py-0.5 rounded-full ' + (statusColors[deal.status] || '') + '">' + deal.status.replace('_', ' ') + '</span></div></div>'
          ).join('');
        }
      } catch (e) {}
    }

    function showAddDeal() { document.getElementById('deal-modal').classList.remove('hidden'); }
    async function saveDeal(e) {
      e.preventDefault();
      try {
        await fetch(API + '/api/monetization/deals', {
          method: 'POST', headers,
          body: JSON.stringify({
            brand_name: document.getElementById('deal-brand').value,
            deal_value: parseInt(document.getElementById('deal-value').value || '0') * 100,
            platform: document.getElementById('deal-platform').value,
            status: document.getElementById('deal-status').value,
            deliverables: document.getElementById('deal-deliverables').value,
            deadline: document.getElementById('deal-deadline').value
          })
        });
        document.getElementById('deal-modal').classList.add('hidden');
        loadMonetization();
      } catch (e) { alert('Failed to save deal'); }
    }

    async function generateMediaKit() {
      try {
        const res = await fetch(API + '/api/monetization/media-kit', { headers });
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          alert('Media Kit Generated!\\n\\n' + d.creator.name + ' | ' + d.creator.niche + ' Creator\\n\\nTotal Followers: ' + formatNum(d.stats.total_followers) + '\\nEngagement Rate: ' + d.stats.avg_engagement_rate + '\\nCompleted Partnerships: ' + d.stats.completed_partnerships + '\\n\\nAudience: ' + d.stats.audience_demographics.top_locations.join(', '));
        }
      } catch (e) { alert('Failed to generate media kit'); }
    }

    // ---- Billing ----
    async function loadBilling() {
      try {
        const res = await fetch(API + '/api/billing', { headers });
        const json = await res.json();
        if (!json.success) return;
        document.getElementById('billing-plan').textContent = json.data.current_plan;
        if (json.data.subscription) {
          const sub = json.data.subscription;
          document.getElementById('billing-period').textContent = sub.current_period_end ? 'Renews ' + formatDate(sub.current_period_end) : '';
        }
        const payments = json.data.payments || [];
        const el = document.getElementById('payments-list');
        if (payments.length > 0) {
          el.innerHTML = payments.map(p => 
            '<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p class="text-sm font-medium">' + p.description + '</p><p class="text-xs text-gray-400">' + formatDate(p.created_at) + '</p></div><div class="text-right"><p class="text-sm font-bold">$' + (p.amount / 100).toFixed(2) + '</p><span class="text-xs text-green-500">' + p.status + '</span></div></div>'
          ).join('');
        }
      } catch (e) {}
    }

    async function upgradePlan(plan) {
      if (!confirm('Upgrade to ' + plan + ' plan?')) return;
      try {
        const res = await fetch(API + '/api/billing/upgrade', { method: 'POST', headers, body: JSON.stringify({ plan }) });
        const json = await res.json();
        if (json.success) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.plan = plan;
          localStorage.setItem('user', JSON.stringify(user));
          document.getElementById('sidebar-plan').textContent = plan.toUpperCase() + ' Plan';
          alert('Upgraded to ' + plan + '!');
          loadBilling();
        } else { alert(json.message); }
      } catch (e) { alert('Upgrade failed'); }
    }

    // ---- Settings ----
    function loadSettings() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      document.getElementById('settings-name').value = user.name || '';
      document.getElementById('settings-email').value = user.email || '';
      if (user.niche) document.getElementById('settings-niche').value = user.niche;
      if (user.timezone) document.getElementById('settings-tz').value = user.timezone;
    }

    function saveSettings() { alert('Settings saved! (Demo mode)'); }

    // ---- Notifications ----
    async function loadNotifications() {
      try {
        const res = await fetch(API + '/api/notifications', { headers });
        const json = await res.json();
        if (!json.success) return;
        const notifs = json.data.notifications || [];
        const unread = notifs.filter(n => !n.read).length;
        const badge = document.getElementById('notif-badge');
        if (unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); }
        
        const el = document.getElementById('notif-list');
        if (notifs.length === 0) {
          el.innerHTML = '<div class="p-4 text-sm text-gray-400 text-center">No notifications</div>';
        } else {
          const typeIcons = { success: 'fa-check-circle text-green-500', info: 'fa-info-circle text-blue-500', warning: 'fa-exclamation-circle text-yellow-500', error: 'fa-times-circle text-red-500' };
          el.innerHTML = notifs.slice(0, 10).map(n => 
            '<div class="p-3 hover:bg-gray-50 cursor-pointer ' + (n.read ? '' : 'bg-blue-50/50') + '" onclick="' + (n.link ? "navigate('" + n.link.replace('/app/', '') + "')" : '') + '"><div class="flex items-start gap-2"><i class="fas ' + (typeIcons[n.type] || 'fa-bell text-gray-400') + ' mt-0.5"></i><div><p class="text-sm font-medium">' + n.title + '</p><p class="text-xs text-gray-400">' + (n.message || '') + '</p><p class="text-xs text-gray-300 mt-1">' + timeAgo(n.created_at) + '</p></div></div></div>'
          ).join('');
        }
      } catch (e) {}
    }

    async function markAllRead() {
      await fetch(API + '/api/notifications/read-all', { method: 'PUT', headers });
      document.getElementById('notif-badge').classList.add('hidden');
      loadNotifications();
    }

    // ---- Logout ----
    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      fetch(API + '/api/auth/logout', { method: 'POST', headers });
      window.location.href = '/login';
    }

    // ---- Helpers ----
    function formatNum(n) { if (n >= 1000000) return (n/1000000).toFixed(1)+'M'; if (n >= 1000) return (n/1000).toFixed(1)+'K'; return n.toString(); }
    function formatDate(d) { if (!d) return ''; try { return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); } catch(e) { return d; } }
    function truncate(s, n) { return s && s.length > n ? s.substring(0, n) + '...' : s || ''; }
    function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    function timeAgo(d) { const s = Math.floor((Date.now() - new Date(d).getTime())/1000); if(s<60)return 'just now'; if(s<3600)return Math.floor(s/60)+'m ago'; if(s<86400)return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago'; }

    // ============================================================
    // VIDEO POST FUNCTIONS
    // ============================================================
    let videoTags = [];
    let videoFile = null;
    let thumbFile = null;

    function handleVideoUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      videoFile = file;
      const player = document.getElementById('video-preview-player');
      player.src = URL.createObjectURL(file);
      document.getElementById('video-file-name').textContent = file.name;
      document.getElementById('video-file-info').textContent = (file.size / 1024 / 1024).toFixed(1) + ' MB • ' + file.type;
      document.getElementById('video-upload-placeholder').classList.add('hidden');
      document.getElementById('video-upload-preview').classList.remove('hidden');
      // Get duration
      player.addEventListener('loadedmetadata', () => {
        const dur = Math.floor(player.duration);
        const m = Math.floor(dur / 60);
        const s = dur % 60;
        document.getElementById('vid-prev-duration').textContent = m + ':' + (s < 10 ? '0' : '') + s;
      }, { once: true });
    }

    function removeVideo() {
      videoFile = null;
      document.getElementById('video-file-input').value = '';
      document.getElementById('video-upload-placeholder').classList.remove('hidden');
      document.getElementById('video-upload-preview').classList.add('hidden');
      document.getElementById('video-preview-player').src = '';
      document.getElementById('vid-prev-duration').textContent = '0:00';
    }

    function handleThumbUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      thumbFile = file;
      const img = document.getElementById('thumb-img');
      img.src = URL.createObjectURL(file);
      document.getElementById('custom-thumb-preview').classList.remove('hidden');
    }

    function selectThumb(n) {
      alert('Auto-generated thumbnail ' + n + ' selected! (In production, this would extract a frame from the video)');
    }

    function updateVideoTitleCount() {
      const v = document.getElementById('video-title').value;
      document.getElementById('video-title-count').textContent = v.length + '/100';
    }

    function updateVideoDescCount() {
      const v = document.getElementById('video-description').value;
      document.getElementById('video-desc-count').textContent = v.length + '/5000';
    }

    function updateVideoPreview() {
      const title = document.getElementById('video-title').value;
      const desc = document.getElementById('video-description').value;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      document.getElementById('vid-prev-title').textContent = title || 'Your video title will appear here...';
      document.getElementById('vid-prev-desc').textContent = desc || 'Video description will appear here...';
      document.getElementById('vid-prev-avatar').textContent = (user.name || 'C').charAt(0).toUpperCase();
      document.getElementById('vid-prev-channel').textContent = user.name || 'Your Channel';
    }

    function addVideoTag() {
      const input = document.getElementById('video-tag-input');
      const tag = input.value.trim();
      if (!tag || videoTags.length >= 15 || videoTags.includes(tag)) return;
      videoTags.push(tag);
      input.value = '';
      renderVideoTags();
    }

    function removeVideoTag(idx) {
      videoTags.splice(idx, 1);
      renderVideoTags();
    }

    function renderVideoTags() {
      document.getElementById('video-tag-count').textContent = videoTags.length + '/15';
      const list = document.getElementById('video-tags-list');
      list.innerHTML = videoTags.map((t, i) =>
        '<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">' + escapeHtml(t) +
        '<button onclick="removeVideoTag(' + i + ')" class="text-gray-400 hover:text-red-500 ml-0.5">&times;</button></span>'
      ).join('');
      // Update preview tags
      const prev = document.getElementById('vid-prev-tags');
      if (videoTags.length === 0) {
        prev.innerHTML = '<span class="text-xs text-gray-300 italic">No tags added yet</span>';
      } else {
        prev.innerHTML = videoTags.map(t => '<span class="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[10px]">' + escapeHtml(t) + '</span>').join('');
      }
    }

    async function aiGenerateVideoTags() {
      const title = document.getElementById('video-title').value;
      const desc = document.getElementById('video-description').value;
      if (!title) return alert('Enter a video title first');
      try {
        const res = await fetch(API + '/api/seo/generate-tags', { method: 'POST', headers, body: JSON.stringify({ title, description: desc }) });
        const json = await res.json();
        if (json.success) {
          videoTags = (json.data.tags || []).slice(0, 15);
          renderVideoTags();
        }
      } catch(e) { alert('Failed to generate tags'); }
    }

    async function aiVideoDesc() {
      const title = document.getElementById('video-title').value;
      if (!title) return alert('Enter a video title first');
      try {
        const res = await fetch(API + '/api/ai/generate', { method: 'POST', headers, body: JSON.stringify({ type: 'script', input: title }) });
        const json = await res.json();
        if (json.success) {
          document.getElementById('video-description').value = json.data.output;
          updateVideoDescCount();
          updateVideoPreview();
        }
      } catch(e) { alert('Failed to generate description'); }
    }

    async function aiVideoHashtags() {
      const title = document.getElementById('video-title').value;
      if (!title) return alert('Enter a video title first');
      try {
        const res = await fetch(API + '/api/ai/generate', { method: 'POST', headers, body: JSON.stringify({ type: 'hashtags', input: title }) });
        const json = await res.json();
        if (json.success) {
          const desc = document.getElementById('video-description');
          desc.value = (desc.value ? desc.value + '\\n\\n' : '') + json.data.output;
          updateVideoDescCount();
          updateVideoPreview();
        }
      } catch(e) { alert('Failed to generate hashtags'); }
    }

    function insertTimestamp() {
      const desc = document.getElementById('video-description');
      const ts = '\\n0:00 Intro\\n0:30 Main Topic\\n1:00 Key Point 1\\n2:00 Key Point 2\\n3:00 Summary\\n';
      desc.value = (desc.value || '') + ts;
      updateVideoDescCount();
    }

    async function runVideoSEO() {
      const title = document.getElementById('video-seo-title').value || document.getElementById('video-title').value;
      const desc = document.getElementById('video-seo-desc').value || document.getElementById('video-description').value;
      if (!title) return alert('Enter a title first');
      try {
        const res = await fetch(API + '/api/seo/analyze', { method: 'POST', headers, body: JSON.stringify({ title, description: desc, tags: videoTags }) });
        const json = await res.json();
        if (json.success) renderVideoSEOResult(json.data);
      } catch(e) { alert('SEO analysis failed'); }
    }

    function renderVideoSEOResult(data) {
      document.getElementById('video-seo-result').classList.remove('hidden');
      const score = data.score;
      const colors = score >= 80 ? ['bg-green-500', 'bg-green-500'] : score >= 60 ? ['bg-yellow-500', 'bg-yellow-500'] : ['bg-red-500', 'bg-red-500'];
      document.getElementById('seo-score-val').textContent = score;
      document.getElementById('seo-score-grade').textContent = data.grade;
      document.getElementById('seo-score-bg').className = 'w-20 h-20 rounded-2xl flex items-center justify-center text-white ' + colors[0];
      document.getElementById('seo-score-bar').className = 'h-2.5 rounded-full transition-all duration-500 ' + colors[1];
      document.getElementById('seo-score-bar').style.width = score + '%';

      const checks = data.checks || [];
      document.getElementById('seo-checks-list').innerHTML = checks.map(c =>
        '<div class="flex items-center gap-2 text-sm p-2 rounded-lg ' + (c.pass ? 'bg-green-50' : 'bg-red-50') + '">' +
        '<i class="fas ' + (c.pass ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-400') + '"></i>' +
        '<span class="font-medium">' + c.label + '</span><span class="text-gray-400 text-xs ml-auto">' + c.detail + '</span></div>'
      ).join('');

      const sugs = data.suggestions || [];
      document.getElementById('seo-suggestions-list').innerHTML = sugs.length ? '<h4 class="font-bold text-sm text-orange-700 mb-1"><i class="fas fa-lightbulb mr-1"></i>Suggestions</h4>' +
        sugs.map(s => '<div class="flex gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded-lg"><i class="fas fa-arrow-right mt-0.5 text-orange-400"></i><span>' + s + '</span></div>').join('') : '';
    }

    async function saveVideoPost(status) {
      const title = document.getElementById('video-title').value;
      if (!title.trim()) return alert('Please enter a video title');
      const platforms = [...document.querySelectorAll('.video-platform-cb:checked')].map(c => c.value);
      if (platforms.length === 0) return alert('Select at least one platform');
      const scheduled_at = document.getElementById('video-schedule').value;
      if (status === 'scheduled' && !scheduled_at) return alert('Select a schedule date');

      const caption = title + '\\n\\n' + document.getElementById('video-description').value;
      try {
        // Create the post
        const res = await fetch(API + '/api/posts', {
          method: 'POST', headers,
          body: JSON.stringify({ caption, platforms, status, scheduled_at, hashtags: videoTags, media_type: 'video' })
        });
        const json = await res.json();
        if (json.success) {
          // Save video metadata
          await fetch(API + '/api/video-analytics/metadata', {
            method: 'POST', headers,
            body: JSON.stringify({
              post_id: json.data.id,
              title,
              description: document.getElementById('video-description').value,
              tags: videoTags,
              category: document.getElementById('video-category').value,
              visibility: document.getElementById('video-visibility').value,
              seo_title: document.getElementById('video-seo-title').value,
              seo_description: document.getElementById('video-seo-desc').value,
              seo_tags: videoTags,
              duration_seconds: 0
            })
          });
          alert('Video ' + (status === 'draft' ? 'saved as draft' : 'scheduled') + '! Viral Score: ' + json.data.viral_score);
          // Reset form
          document.getElementById('video-title').value = '';
          document.getElementById('video-description').value = '';
          document.getElementById('video-seo-title').value = '';
          document.getElementById('video-seo-desc').value = '';
          document.getElementById('video-category').value = '';
          document.getElementById('video-schedule').value = '';
          document.querySelectorAll('.video-platform-cb').forEach(c => c.checked = false);
          videoTags = [];
          renderVideoTags();
          removeVideo();
          navigate('scheduled');
        } else {
          alert(json.message || 'Failed to save');
        }
      } catch(e) { alert('Error saving video post'); }
    }

    // ============================================================
    // VIDEO ANALYTICS FUNCTIONS
    // ============================================================
    let watchTimeChart = null;
    let retentionChart = null;
    let viewsTrendChart = null;
    let viewsVsWatchChart = null;

    async function loadVideoAnalytics() {
      try {
        const res = await fetch(API + '/api/video-analytics/overview', { headers });
        const json = await res.json();
        if (!json.success) return;
        const d = json.data;
        const s = d.summary;

        document.getElementById('va-total-views').textContent = formatNum(s.total_views);
        document.getElementById('va-watch-hours').textContent = s.total_watch_hours.toFixed(1);
        document.getElementById('va-subs-gained').textContent = formatNum(s.subscribers_gained);
        document.getElementById('va-avg-ctr').textContent = s.avg_ctr_pct + '%';
        document.getElementById('va-avg-retention').textContent = s.avg_retention_pct + '%';
        document.getElementById('va-total-likes').textContent = formatNum(s.total_likes);
        document.getElementById('va-total-comments').textContent = formatNum(s.total_comments);
        document.getElementById('va-total-videos').textContent = s.total_videos;

        // Watch Time Trend Chart
        const wt = d.watch_time_trend || [];
        const wtCtx = document.getElementById('watch-time-chart');
        if (watchTimeChart) watchTimeChart.destroy();
        watchTimeChart = new Chart(wtCtx, {
          type: 'line',
          data: {
            labels: wt.map(w => w.date.substring(5)),
            datasets: [{
              label: 'Watch Time (min)',
              data: wt.map(w => w.minutes),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,0.1)',
              fill: true, tension: 0.4, pointRadius: 3
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }
        });

        // Audience Retention Curve
        const rc = d.retention_curve || [];
        const rcCtx = document.getElementById('retention-chart');
        if (retentionChart) retentionChart.destroy();
        retentionChart = new Chart(rcCtx, {
          type: 'line',
          data: {
            labels: rc.map(r => r.pct_through + '%'),
            datasets: [{
              label: 'Retention %',
              data: rc.map(r => Math.round(r.retention)),
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.1)',
              fill: true, tension: 0.3, pointRadius: 2
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } } }
        });

        // Daily Views
        const vtCtx = document.getElementById('views-trend-chart');
        if (viewsTrendChart) viewsTrendChart.destroy();
        viewsTrendChart = new Chart(vtCtx, {
          type: 'bar',
          data: {
            labels: wt.map(w => w.date.substring(5)),
            datasets: [{
              label: 'Views',
              data: wt.map(w => w.views),
              backgroundColor: 'rgba(239,68,68,0.7)',
              borderRadius: 4
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }
        });

        // Views vs Watch Time scatter-style
        const vwCtx = document.getElementById('views-vs-watch-chart');
        if (viewsVsWatchChart) viewsVsWatchChart.destroy();
        viewsVsWatchChart = new Chart(vwCtx, {
          type: 'bar',
          data: {
            labels: wt.map(w => w.date.substring(5)),
            datasets: [
              { label: 'Views', data: wt.map(w => w.views), backgroundColor: 'rgba(239,68,68,0.5)', borderRadius: 4 },
              { label: 'Watch (min)', data: wt.map(w => w.minutes), backgroundColor: 'rgba(59,130,246,0.5)', borderRadius: 4 }
            ]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }
        });

        // Videos Table
        const videos = d.videos || [];
        const tbody = document.getElementById('va-video-table');
        if (videos.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-gray-400"><i class="fas fa-video text-3xl mb-2 block"></i>No videos yet. Create your first video post!</td></tr>';
        } else {
          tbody.innerHTML = videos.map(v =>
            '<tr class="border-b border-gray-50 hover:bg-gray-50">' +
            '<td class="p-3"><p class="text-sm font-medium truncate max-w-[200px]">' + (v.title || 'Untitled') + '</p><p class="text-xs text-gray-400">' + (v.category || '-') + '</p></td>' +
            '<td class="p-3 text-right text-sm">' + formatNum(v.views || 0) + '</td>' +
            '<td class="p-3 text-right text-sm">' + ((v.watch_time_minutes || 0) / 60).toFixed(1) + '</td>' +
            '<td class="p-3 text-right text-sm">' + (v.avg_retention_pct || 0).toFixed(1) + '%</td>' +
            '<td class="p-3 text-right text-sm">' + (v.ctr_pct || 0).toFixed(2) + '%</td>' +
            '<td class="p-3 text-right text-sm">' + formatNum(v.likes || 0) + '</td>' +
            '<td class="p-3 text-right text-sm text-green-600">+' + (v.subscribers_gained || 0) + '</td></tr>'
          ).join('');
        }
      } catch(e) { console.error('Video analytics error:', e); }
    }

    // ============================================================
    // SEO TOOLS FUNCTIONS
    // ============================================================
    let seoAnalysisCount = 0;

    async function runSEOAnalysis() {
      const title = document.getElementById('seo-analyze-title').value;
      const description = document.getElementById('seo-analyze-desc').value;
      const tagsStr = document.getElementById('seo-analyze-tags').value;
      if (!title) return alert('Enter a title to analyze');
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      try {
        const res = await fetch(API + '/api/seo/analyze', { method: 'POST', headers, body: JSON.stringify({ title, description, tags }) });
        const json = await res.json();
        if (!json.success) return alert(json.message);
        const data = json.data;
        seoAnalysisCount++;
        document.getElementById('seo-usage-text').textContent = seoAnalysisCount + ' analyses this month';
        document.getElementById('seo-usage-bar').style.width = Math.min(100, seoAnalysisCount * 5) + '%';

        document.getElementById('seo-analysis-result').classList.remove('hidden');
        const score = data.score;
        const bgColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
        const bannerBg = score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-yellow-50' : score >= 40 ? 'bg-orange-50' : 'bg-red-50';

        document.getElementById('seo-result-banner').className = 'flex items-center gap-4 mb-4 p-4 rounded-2xl ' + bannerBg;
        document.getElementById('seo-result-score-bg').className = 'w-24 h-24 rounded-2xl flex items-center justify-center text-white ' + bgColor;
        document.getElementById('seo-result-score').textContent = score;
        document.getElementById('seo-result-grade').textContent = 'Grade: ' + data.grade;
        document.getElementById('seo-result-bar').style.width = score + '%';
        document.getElementById('seo-result-summary').textContent = score >= 80 ? 'Excellent SEO! Your content is well-optimized.' : score >= 60 ? 'Good SEO. A few improvements can boost visibility.' : 'Needs work. Follow the suggestions below.';

        document.getElementById('seo-result-checks').innerHTML = (data.checks || []).map(c =>
          '<div class="flex items-center gap-2 text-sm p-2.5 rounded-xl ' + (c.pass ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100') + '">' +
          '<i class="fas ' + (c.pass ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-red-400') + '"></i>' +
          '<span class="font-medium">' + c.label + '</span><span class="text-gray-400 text-xs ml-auto">' + c.detail + '</span></div>'
        ).join('');

        const sugs = data.suggestions || [];
        document.getElementById('seo-result-suggestions').innerHTML = sugs.length ?
          '<h4 class="font-bold text-sm text-orange-700"><i class="fas fa-lightbulb mr-1"></i> Improvement Suggestions</h4>' +
          sugs.map(s => '<div class="flex gap-2 text-xs text-orange-700 bg-orange-50 p-2.5 rounded-xl border border-orange-100"><i class="fas fa-arrow-right mt-0.5 text-orange-400"></i><span>' + s + '</span></div>').join('') : '';
      } catch(e) { alert('SEO analysis failed'); }
    }

    async function runKeywordResearch() {
      const topic = document.getElementById('seo-keyword-input').value.trim();
      if (!topic) return alert('Enter a topic');
      try {
        const res = await fetch(API + '/api/seo/keywords', { method: 'POST', headers, body: JSON.stringify({ topic }) });
        const json = await res.json();
        if (!json.success) return alert(json.message);
        document.getElementById('keyword-results').classList.remove('hidden');

        const kws = json.data.keywords || [];
        document.getElementById('keyword-table-body').innerHTML = kws.map(k => {
          const compColors = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
          const trendIcons = { up: 'fa-arrow-trend-up text-green-500', down: 'fa-arrow-trend-down text-red-500', stable: 'fa-minus text-gray-400' };
          return '<tr class="border-b border-gray-50 hover:bg-gray-50">' +
            '<td class="p-3 text-sm font-medium">' + k.keyword + '</td>' +
            '<td class="p-3 text-right text-sm">' + formatNum(k.volume) + '</td>' +
            '<td class="p-3 text-center"><span class="text-xs px-2 py-0.5 rounded-full ' + (compColors[k.competition] || '') + '">' + k.competition + '</span></td>' +
            '<td class="p-3 text-center"><i class="fas ' + (trendIcons[k.trend] || 'fa-minus text-gray-400') + '"></i></td>' +
            '<td class="p-3 text-right text-sm text-gray-500">$' + k.cpc + '</td></tr>';
        }).join('');

        document.getElementById('keyword-related').innerHTML = (json.data.related_topics || []).map(r =>
          '<span class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs cursor-pointer hover:bg-blue-100" onclick="document.getElementById(\\'seo-keyword-input\\').value=\\'' + r + '\\';runKeywordResearch()">' + r + '</span>'
        ).join('');

        document.getElementById('keyword-trending').innerHTML = (json.data.trending_queries || []).map(t =>
          '<span class="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs cursor-pointer hover:bg-green-100" onclick="document.getElementById(\\'seo-keyword-input\\').value=\\'' + t + '\\';runKeywordResearch()">' + t + '</span>'
        ).join('');
      } catch(e) { alert('Keyword research failed'); }
    }

    async function runTitleOptimize() {
      const title = document.getElementById('seo-title-input').value.trim();
      if (!title) return alert('Enter a title');
      try {
        const res = await fetch(API + '/api/seo/optimize-title', { method: 'POST', headers, body: JSON.stringify({ title }) });
        const json = await res.json();
        if (!json.success) return alert(json.message);
        const container = document.getElementById('title-suggestions');
        container.classList.remove('hidden');
        container.innerHTML = '<p class="text-xs text-gray-500 mb-2">Click a suggestion to copy it:</p>' +
          (json.data.suggestions || []).map((s, i) =>
            '<div class="flex items-center gap-2 p-3 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition border border-purple-100" onclick="navigator.clipboard.writeText(\\'' + s.replace(/'/g, "\\\\'") + '\\');this.querySelector(\\'span\\').textContent=\\'Copied!\\';setTimeout(()=>this.querySelector(\\'span\\').textContent=\\'' + s.replace(/'/g, "\\\\'") + '\\',1500)">' +
            '<span class="text-sm flex-1">' + s + '</span>' +
            '<i class="fas fa-copy text-purple-400 text-xs"></i></div>'
          ).join('');
      } catch(e) { alert('Title optimization failed'); }
    }

    let productUploadPayload = null;
    let storefrontLink = '';

    async function loadProductOptions() {
      try {
        const res = await fetch(API + '/api/products/mine', { headers });
        const json = await res.json();
        const select = document.getElementById('attach-product-select');
        if (!select) return;
        const products = json.success ? (json.data.products || []) : [];
        select.innerHTML = '<option value="">No product attached</option>' + products.map(product =>
          '<option value="' + product.id + '">' + product.title + ' ($' + (Number(product.price || 0) / 100).toFixed(2) + ')</option>'
        ).join('');
      } catch (error) {}
    }

    function toggleProductDeliveryType() {
      const type = document.getElementById('product-delivery-type').value;
      document.getElementById('product-file-wrap').classList.toggle('hidden', type !== 'file');
      document.getElementById('product-link-wrap').classList.toggle('hidden', type !== 'link');
    }

    function handleProductFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        productUploadPayload = null;
        document.getElementById('product-file-status').textContent = 'No file selected.';
        return;
      }

      const reader = new FileReader();
      reader.onload = function() {
        const result = String(reader.result || '');
        productUploadPayload = {
          file_name: file.name,
          file_type: file.type || 'application/octet-stream',
          file_size: file.size,
          file_data_base64: result.includes(',') ? result.split(',')[1] : result,
        };
        document.getElementById('product-file-status').textContent = file.name + ' ready for secure delivery';
      };
      reader.readAsDataURL(file);
    }

    async function loadProductsDashboard() {
      try {
        const [productsRes, weeklyRes, suggestionsRes] = await Promise.all([
          fetch(API + '/api/products/mine', { headers }),
          fetch(API + '/api/reports/weekly-revenue', { headers }),
          fetch(API + '/api/ai/sales-suggestions', { headers }),
        ]);
        const productsJson = await productsRes.json();
        const weeklyJson = await weeklyRes.json();
        const suggestionsJson = await suggestionsRes.json();

        const products = productsJson.success ? (productsJson.data.products || []) : [];
        const sales = products.reduce((sum, product) => sum + Number(product.sales_count || 0), 0);
        const revenue = products.reduce((sum, product) => sum + Number(product.revenue_total || 0), 0);

        document.getElementById('prod-summary-count').textContent = products.length;
        document.getElementById('prod-summary-sales').textContent = sales;
        document.getElementById('prod-summary-revenue').textContent = '$' + (revenue / 100).toFixed(2);
        document.getElementById('prod-summary-weekly').textContent = weeklyJson.success ? weeklyJson.data.summary : 'Weekly report unavailable';

        storefrontLink = products.length && products[0].username ? window.location.origin + '/' + products[0].username : '';
        document.getElementById('storefront-link-box').innerHTML = storefrontLink
          ? '<a href="' + storefrontLink + '" target="_blank" class="text-brand-600 font-semibold hover:underline">' + storefrontLink + '</a>'
          : '<span class="text-gray-400">Your storefront URL will appear after your first product is created.</span>';

        document.getElementById('products-list').innerHTML = products.length ? products.map(product =>
          '<div class="border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4">' +
            '<div class="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">' +
              (product.thumbnail_url ? '<img src="' + product.thumbnail_url + '" class="w-full h-full object-cover">' : '<i class="fas fa-file-arrow-down text-gray-300 text-2xl"></i>') +
            '</div>' +
            '<div class="flex-1 min-w-0">' +
              '<div class="flex items-start justify-between gap-3">' +
                '<div><div class="font-bold">' + product.title + '</div><div class="text-sm text-gray-500 mt-1 line-clamp-2">' + product.description + '</div></div>' +
                '<div class="text-right"><div class="text-lg font-black">$' + (Number(product.price || 0) / 100).toFixed(2) + '</div><div class="text-xs text-gray-400">' + (product.delivery_type === 'link' ? 'Link delivery' : 'File delivery') + '</div></div>' +
              '</div>' +
              '<div class="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">' +
                '<span>Sales: <b>' + Number(product.sales_count || 0) + '</b></span>' +
                '<span>Revenue: <b>$' + (Number(product.revenue_total || 0) / 100).toFixed(2) + '</b></span>' +
                '<a href="/checkout/' + product.id + '" target="_blank" class="text-brand-600 font-semibold hover:underline">Checkout link</a>' +
              '</div>' +
            '</div>' +
          '</div>'
        ).join('') : '<div class="text-sm text-gray-400">No products yet. Create one in under 2 minutes.</div>';

        document.getElementById('product-ai-suggestions').innerHTML = suggestionsJson.success
          ? (suggestionsJson.data.suggestions || []).map(item => '<div class="flex items-start gap-2"><i class="fas fa-lightbulb text-yellow-400 mt-0.5"></i><span>' + item + '</span></div>').join('')
          : '<div>No suggestions right now.</div>';

        loadProductOptions();
      } catch (error) {
        document.getElementById('products-list').innerHTML = '<div class="text-sm text-red-500">Could not load product dashboard.</div>';
      }
    }

    async function createProduct() {
      const title = document.getElementById('product-title').value.trim();
      const description = document.getElementById('product-description').value.trim();
      const price = Number(document.getElementById('product-price').value || 0);
      const delivery_type = document.getElementById('product-delivery-type').value;
      const thumbnail_url = document.getElementById('product-thumbnail').value.trim();
      const delivery_link = document.getElementById('product-link').value.trim();

      if (!title || !description || !price) return alert('Title, description, and price are required.');
      if (delivery_type === 'file' && !productUploadPayload) return alert('Upload a PDF or ZIP file.');
      if (delivery_type === 'link' && !delivery_link) return alert('Enter a secure delivery link.');

      const btn = document.getElementById('create-product-btn');
      btn.disabled = true;
      btn.textContent = 'Creating product...';
      try {
        const payload = {
          title,
          description,
          price,
          delivery_type,
          thumbnail_url,
          delivery_link,
          ...(productUploadPayload || {}),
        };
        const res = await fetch(API + '/api/products/create', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) return alert(json.message || 'Failed to create product');

        document.getElementById('product-title').value = '';
        document.getElementById('product-description').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-thumbnail').value = '';
        document.getElementById('product-link').value = '';
        document.getElementById('product-file').value = '';
        document.getElementById('product-file-status').textContent = 'No file selected.';
        productUploadPayload = null;
        alert('Product created. Storefront: ' + json.data.storefront_url);
        loadProductsDashboard();
      } catch (error) {
        alert('Error creating product');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Create Product';
      }
    }

    function copyStorefrontLink() {
      if (!storefrontLink) return alert('Create a product first.');
      navigator.clipboard.writeText(storefrontLink).then(() => {
        const btn = document.getElementById('storefront-copy-btn');
        const previous = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = previous; }, 1200);
      });
    }

    // ═══════════════════════════════════════════════════════════
    // GROWTH COACH
    // ═══════════════════════════════════════════════════════════
    async function loadGrowthCoach() {
      try {
        const res = await fetch(API + '/api/growth-coach/daily', { headers });
        const d = (await res.json()).data || {};
        // Streak
        const streak = d.streak || {};
        document.getElementById('gc-streak-count').textContent = (streak.current_streak || 0) + ' Day Streak';
        document.getElementById('gc-streak-msg').textContent = streak.current_streak > 0 ? 'Keep the momentum going! Post today to extend your streak.' : 'Start posting to build your streak!';
        // Recommendations
        const recs = d.recommendations || [];
        document.getElementById('gc-recommendations').innerHTML = recs.length ? recs.map(r =>
          '<div class="glass-card p-4 hover:shadow-md transition"><div class="flex items-start gap-3"><div class="text-2xl">' +
          (r.type === 'content' ? '📝' : r.type === 'timing' ? '⏰' : '💡') +
          '</div><div class="flex-1"><div class="font-semibold text-sm">' + r.title + '</div><div class="text-xs text-gray-500 mt-1">' + r.description + '</div></div></div></div>'
        ).join('') : '<div class="text-sm text-gray-400">No recommendations today. Check back tomorrow!</div>';
        // Best time / day
        document.getElementById('gc-best-day').textContent = d.best_posting?.day || 'Post today!';
        document.getElementById('gc-best-time').textContent = d.best_posting?.time || '10:00 AM';
        document.getElementById('gc-focus').textContent = d.focus || 'Consistency';
      } catch(e) { console.error('Growth coach error:', e); }
      // Weekly
      try {
        const wr = await fetch(API + '/api/growth-coach/weekly-report', { headers });
        const w = (await wr.json()).data || {};
        const s = w.summary || {};
        document.getElementById('gc-weekly').innerHTML =
          '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">' +
          '<div><div class="text-xs text-gray-400">Posts This Week</div><div class="text-xl font-bold">' + (s.posts_this_week || 0) + '</div></div>' +
          '<div><div class="text-xs text-gray-400">Total Engagement</div><div class="text-xl font-bold">' + (s.total_engagement || 0) + '</div></div>' +
          '<div><div class="text-xs text-gray-400">Followers Gained</div><div class="text-xl font-bold text-green-600">+' + (s.followers_change || 0) + '</div></div>' +
          '<div><div class="text-xs text-gray-400">AI Uses</div><div class="text-xl font-bold">' + (s.ai_uses || 0) + '</div></div></div>' +
          '<div class="text-sm text-gray-600">' + (w.highlights || []).map(h => '<div class="flex items-center gap-2 py-1"><i class="fas fa-check-circle text-green-500 text-xs"></i><span>' + h + '</span></div>').join('') + '</div>';
      } catch(e) {}
    }

    // ═══════════════════════════════════════════════════════════
    // AI ENGINE
    // ═══════════════════════════════════════════════════════════
    async function loadAIEngine() {
      // Update usage counter
      try {
        const r = await fetch(API + '/api/pricing/my-plan', { headers });
        const d = (await r.json()).data || {};
        const ai = d.usage?.ai_today || {};
        document.getElementById('aie-usage').textContent = (ai.used || 0) + ' / ' + (ai.limit || 10) + ' used today';
      } catch(e) {}
    }

    async function generateAIContent() {
      const btn = document.getElementById('aie-btn');
      const input = document.getElementById('aie-input').value.trim();
      if (!input) { alert('Enter a topic or idea first'); return; }
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
      try {
        const res = await fetch(API + '/api/ai-engine/generate', {
          method: 'POST', headers,
          body: JSON.stringify({
            input,
            type: document.getElementById('aie-type').value,
            platform: document.getElementById('aie-platform').value,
            audience: document.getElementById('aie-audience').value,
            tone: document.getElementById('aie-tone').value,
            niche: document.getElementById('aie-niche').value || 'general',
          })
        });
        const d = (await res.json()).data || {};
        document.getElementById('aie-output-empty').classList.add('hidden');
        document.getElementById('aie-output').classList.remove('hidden');
        document.getElementById('aie-content').textContent = d.content || 'No content generated.';
        const s = d.score || {};
        document.getElementById('aie-score-overall').textContent = s.overall || '—';
        document.getElementById('aie-score-overall').className = 'text-3xl font-black ' + (s.overall >= 80 ? 'text-green-600' : s.overall >= 60 ? 'text-yellow-600' : 'text-red-600');
        document.getElementById('aie-score-hook').textContent = s.hook || '—';
        document.getElementById('aie-score-read').textContent = s.readability || '—';
        document.getElementById('aie-score-engage').textContent = s.engagement || '—';
        document.getElementById('aie-suggestions').innerHTML = (s.suggestions || []).map(sg =>
          '<div class="text-xs text-gray-500 flex items-start gap-1"><i class="fas fa-lightbulb text-yellow-400 mt-0.5"></i><span>' + sg + '</span></div>'
        ).join('');
        const u = d.usage || {};
        document.getElementById('aie-usage').textContent = (u.used || 0) + ' / ' + (u.limit || 10) + ' used today';
      } catch(e) { alert('Generation failed: ' + e.message); }
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-wand-magic-sparkles mr-2"></i>Generate';
    }

    function copyAIContent() {
      const t = document.getElementById('aie-content').textContent;
      navigator.clipboard.writeText(t).then(() => { alert('Copied to clipboard!'); });
    }

    // ═══════════════════════════════════════════════════════════
    // PRO ANALYTICS
    // ═══════════════════════════════════════════════════════════
    async function loadProAnalytics() {
      try {
        const res = await fetch(API + '/api/pro-analytics/overview', { headers });
        if (res.status === 403) { document.getElementById('pa-locked').classList.remove('hidden'); document.getElementById('pa-content').classList.add('hidden'); return; }
        document.getElementById('pa-locked').classList.add('hidden'); document.getElementById('pa-content').classList.remove('hidden');
        const d = (await res.json()).data || {};
        document.getElementById('pa-engagement-rate').textContent = (d.engagement_rate || 0).toFixed(1) + '%';
        document.getElementById('pa-ctr').textContent = (d.avg_ctr || 0).toFixed(1) + '%';
        document.getElementById('pa-growth-rate').textContent = (d.follower_growth_rate || 0).toFixed(1) + '%';
        document.getElementById('pa-total-posts').textContent = d.total_posts || 0;
      } catch(e) { console.error('Pro analytics error:', e); }
      // Content ranking
      try {
        const cr = await fetch(API + '/api/pro-analytics/content-ranking', { headers });
        const cd = (await cr.json()).data || {};
        const top = cd.top_posts || [];
        document.getElementById('pa-ranking').innerHTML = top.length ? top.map((p, i) =>
          '<div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"><div class="font-bold text-lg text-gray-300 w-6">' + (i+1) + '</div><div class="flex-1"><div class="text-sm font-medium truncate">' + (p.caption || 'Untitled').substring(0,60) + '</div><div class="text-xs text-gray-400">Score: ' + (p.score || 0) + ' | ' + (p.likes || 0) + ' likes</div></div></div>'
        ).join('') : '<div class="text-sm text-gray-400">No ranked content yet.</div>';
      } catch(e) {}
      // Competitors
      try {
        const cp = await fetch(API + '/api/pro-analytics/competitors', { headers });
        const cpd = (await cp.json()).data || {};
        const comps = cpd.competitors || [];
        document.getElementById('pa-competitors').innerHTML = comps.length ? comps.map(c =>
          '<div class="flex items-center justify-between p-3 border border-gray-100 rounded-lg"><div><div class="font-semibold text-sm">@' + c.username + '</div><div class="text-xs text-gray-400">' + c.platform + ' · ' + (c.followers_count || 0).toLocaleString() + ' followers</div></div><button onclick="deleteCompetitor(\\'' + c.id + '\\')" class="text-xs text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button></div>'
        ).join('') : '<div class="text-sm text-gray-400">Add competitors to track.</div>';
      } catch(e) {}
    }

    async function showAddCompetitor() {
      const u = prompt('Enter competitor username (e.g. @creator):');
      const p = prompt('Platform (instagram, youtube, tiktok, linkedin, twitter):');
      if (!u || !p) return;
      try {
        await fetch(API + '/api/pro-analytics/competitors', { method: 'POST', headers, body: JSON.stringify({ platform: p, username: u.replace('@','') }) });
        loadProAnalytics();
      } catch(e) { alert('Failed to add competitor'); }
    }

    async function deleteCompetitor(id) {
      if (!confirm('Remove this competitor?')) return;
      await fetch(API + '/api/pro-analytics/competitors/' + id, { method: 'DELETE', headers });
      loadProAnalytics();
    }

    // ═══════════════════════════════════════════════════════════
    // GAMIFICATION
    // ═══════════════════════════════════════════════════════════
    async function loadGamification() {
      try {
        const res = await fetch(API + '/api/gamification/profile', { headers });
        const d = (await res.json()).data || {};
        const p = d.profile || {};
        const xpLevels = [0,100,300,600,1000,1500,2500,4000,6000,9000,15000];
        const lvl = p.level || 1;
        const xp = p.xp_points || 0;
        const nextXp = xpLevels[lvl] || 15000;
        const prevXp = xpLevels[lvl-1] || 0;
        const pct = Math.min(100, ((xp - prevXp) / (nextXp - prevXp)) * 100);
        document.getElementById('gam-level').textContent = lvl;
        document.getElementById('gam-xp').textContent = xp + ' XP';
        document.getElementById('gam-xp-next').textContent = (nextXp - xp) + ' XP to Level ' + (lvl+1);
        document.getElementById('gam-xp-bar').style.width = pct + '%';
        document.getElementById('gam-streak').textContent = p.current_streak || 0;
        document.getElementById('gam-posts').textContent = p.total_posts || 0;
        document.getElementById('gam-ai-uses').textContent = p.total_ai_uses || 0;
        document.getElementById('gam-longest').textContent = p.longest_streak || 0;
        // Badges
        const badges = d.badges || [];
        const earned = badges.filter(b => b.earned);
        document.getElementById('gam-badges-count').textContent = earned.length;
        document.getElementById('gam-badges').innerHTML = badges.map(b =>
          '<div class="glass-card p-3 text-center ' + (b.earned ? '' : 'opacity-40 grayscale') + '"><div class="text-2xl mb-1">' + b.icon + '</div><div class="text-[10px] font-bold">' + b.name + '</div>' + (b.earned ? '<div class="text-[9px] text-green-500">✓ Earned</div>' : '<div class="text-[9px] text-gray-400">' + b.requirement + '</div>') + '</div>'
        ).join('');
      } catch(e) { console.error('Gamification error:', e); }
      // Leaderboard
      try {
        const lb = await fetch(API + '/api/gamification/leaderboard', { headers });
        const ld = (await lb.json()).data || {};
        const entries = ld.leaderboard || [];
        document.getElementById('gam-leaderboard').innerHTML = entries.length ? entries.map((e, i) =>
          '<div class="flex items-center gap-3 p-2 rounded-lg ' + (i < 3 ? 'bg-yellow-50' : '') + '"><div class="font-bold text-lg w-6 text-center">' + (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1)) + '</div><div class="flex-1"><div class="text-sm font-medium">' + (e.name || 'Creator') + '</div><div class="text-xs text-gray-400">Level ' + e.level + ' · ' + e.xp_points + ' XP · 🔥' + e.current_streak + '</div></div></div>'
        ).join('') : '<div class="text-sm text-gray-400">No leaderboard data yet.</div>';
      } catch(e) {}
    }

    // ═══════════════════════════════════════════════════════════
    // PRICING
    // ═══════════════════════════════════════════════════════════
    let pricingCycle = 'monthly';
    let allPlans = [];

    async function loadPricingPlans() {
      try {
        const res = await fetch(API + '/api/pricing/plans');
        const d = (await res.json()).data || {};
        allPlans = d.plans || [];
        renderPricingGrid();
      } catch(e) { console.error('Pricing error:', e); }
    }

    function setPricingCycle(cycle) {
      pricingCycle = cycle;
      document.getElementById('price-monthly-btn').className = 'px-4 py-1.5 text-sm rounded-md ' + (cycle === 'monthly' ? 'bg-white shadow font-semibold' : 'text-gray-500');
      document.getElementById('price-yearly-btn').className = 'px-4 py-1.5 text-sm rounded-md ' + (cycle === 'yearly' ? 'bg-white shadow font-semibold' : 'text-gray-500');
      renderPricingGrid();
    }

    function renderPricingGrid() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      document.getElementById('pricing-grid').innerHTML = allPlans.map(p => {
        const price = pricingCycle === 'yearly' ? p.priceYearly : p.price;
        const monthly = pricingCycle === 'yearly' ? Math.round(p.priceYearly / 12) : p.price;
        const isCurrent = user.plan === p.id;
        const features = Object.entries(p.features || {}).filter(([k,v]) => v);
        return '<div class="glass-card p-6 ' + (p.badge === 'POPULAR' ? 'border-2 border-brand-500 relative' : '') + '">' +
          (p.badge ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">' + p.badge + '</div>' : '') +
          '<h3 class="font-bold text-lg">' + p.name + '</h3>' +
          '<p class="text-xs text-gray-400 mt-1">' + p.description + '</p>' +
          '<div class="mt-4"><span class="text-3xl font-black">$' + monthly + '</span><span class="text-gray-400 text-sm">/mo</span></div>' +
          (pricingCycle === 'yearly' ? '<div class="text-xs text-green-500">$' + price + '/year (save $' + (p.price * 12 - p.priceYearly) + ')</div>' : '') +
          '<ul class="mt-4 space-y-2 text-sm">' + features.map(([k]) =>
            '<li class="flex items-center gap-2"><i class="fas fa-check text-green-500 text-xs"></i>' + k.replace(/_/g, ' ') + '</li>'
          ).join('') + '</ul>' +
          '<div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">' +
          Object.entries(p.limits || {}).map(([k,v]) => '<div>' + k.replace(/_/g, ' ') + ': <b>' + (v >= 9999 ? '∞' : v) + '</b></div>').join('') + '</div>' +
          (isCurrent ? '<button class="w-full mt-4 py-2.5 bg-gray-100 text-gray-500 text-sm rounded-lg font-semibold" disabled>Current Plan</button>' :
          p.price === 0 ? '<button class="w-full mt-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition" disabled>Free Forever</button>' :
          '<button onclick="upgradePlan(\\'' + p.id + '\\')" class="w-full mt-4 py-2.5 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition font-semibold">Upgrade to ' + p.name + '</button>') +
          '</div>';
      }).join('');
    }

    async function upgradePlan(planId) {
      if (!confirm('Upgrade to ' + planId + ' plan?')) return;
      try {
        const res = await fetch(API + '/api/pricing/upgrade', { method: 'POST', headers, body: JSON.stringify({ plan: planId, billing_cycle: pricingCycle }) });
        const d = await res.json();
        if (d.success) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.plan = planId;
          localStorage.setItem('user', JSON.stringify(user));
          alert('Upgraded to ' + d.data.plan.name + '! 🎉');
          renderPricingGrid();
          document.getElementById('sidebar-plan').textContent = d.data.plan.name;
        } else { alert(d.message || 'Upgrade failed'); }
      } catch(e) { alert('Upgrade failed: ' + e.message); }
    }

    // ---- Boot ----
    init();
  `;
}
