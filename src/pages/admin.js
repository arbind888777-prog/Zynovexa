// ============================================================
// Zynovexa - Admin Panel
// System overview, user management, revenue analytics
// ============================================================
export function adminPanelPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin – Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0f5ff',100:'#e0eaff',500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
  <style>
    .admin-page{display:none}.admin-page.active{display:block}
    .admin-link.active{background:#f0f5ff;color:#2850e8;font-weight:600}
    .glass-card{background:white;border-radius:16px;border:1px solid #f1f1f1;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
    .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.06)}
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <script>
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') { window.location.href = '/app'; }
  </script>
  <div class="flex min-h-screen">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 fixed h-full z-40 hidden lg:block">
      <div class="h-16 flex items-center gap-2 px-6 border-b border-gray-50">
        <div class="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center"><i class="fas fa-shield-halved text-white text-sm"></i></div>
        <span class="text-lg font-bold">Admin Panel</span>
      </div>
      <nav class="py-4 px-3 space-y-1">
        <a href="#" onclick="return adminNav('overview')" data-page="overview" class="admin-link active flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-th-large w-5 text-center text-gray-400"></i> Overview
        </a>
        <a href="#" onclick="return adminNav('users')" data-page="users" class="admin-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-users w-5 text-center text-gray-400"></i> Users
        </a>
        <a href="#" onclick="return adminNav('subscriptions')" data-page="subscriptions" class="admin-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-credit-card w-5 text-center text-gray-400"></i> Subscriptions
        </a>
        <a href="#" onclick="return adminNav('posts-monitor')" data-page="posts-monitor" class="admin-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-newspaper w-5 text-center text-gray-400"></i> Posts Monitor
        </a>
        <a href="#" onclick="return adminNav('activity')" data-page="activity" class="admin-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-list-timeline w-5 text-center text-gray-400"></i> API Logs
        </a>
        <a href="#" onclick="return adminNav('revenue')" data-page="revenue" class="admin-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-chart-line w-5 text-center text-gray-400"></i> Revenue
        </a>
        <div class="border-t border-gray-100 my-3"></div>
        <a href="/app" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          <i class="fas fa-arrow-left w-5 text-center text-gray-400"></i> Back to App
        </a>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 lg:ml-64 p-6">
      <header class="mb-6">
        <h1 class="text-2xl font-bold" id="admin-title">System Overview</h1>
        <p class="text-sm text-gray-500">Zynovexa Administration Dashboard</p>
      </header>

      <!-- OVERVIEW PAGE -->
      <div class="admin-page active" id="admin-overview">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="glass-card p-5 stat-card transition"><div class="text-xs text-gray-400 mb-1">Total Users</div><div class="text-2xl font-bold" id="adm-users">--</div></div>
          <div class="glass-card p-5 stat-card transition"><div class="text-xs text-gray-400 mb-1">Total Posts</div><div class="text-2xl font-bold" id="adm-posts">--</div></div>
          <div class="glass-card p-5 stat-card transition"><div class="text-xs text-gray-400 mb-1">AI Requests</div><div class="text-2xl font-bold" id="adm-ai">--</div></div>
          <div class="glass-card p-5 stat-card transition"><div class="text-xs text-gray-400 mb-1">Revenue</div><div class="text-2xl font-bold text-green-600" id="adm-revenue">$0</div></div>
        </div>
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass-card p-6">
            <h3 class="font-bold mb-4">Today's Activity</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-xl p-4 text-center"><div class="text-xl font-bold text-blue-600" id="adm-today-users">0</div><div class="text-xs text-gray-500">New Users</div></div>
              <div class="bg-green-50 rounded-xl p-4 text-center"><div class="text-xl font-bold text-green-600" id="adm-today-posts">0</div><div class="text-xs text-gray-500">New Posts</div></div>
            </div>
          </div>
          <div class="glass-card p-6">
            <h3 class="font-bold mb-4">Subscription Distribution</h3>
            <canvas id="sub-chart" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- USERS PAGE -->
      <div class="admin-page" id="admin-users">
        <div class="flex items-center justify-between mb-4">
          <input type="text" id="user-search" placeholder="Search users..." class="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64" onkeyup="searchUsers()">
        </div>
        <div class="glass-card overflow-hidden">
          <table class="w-full">
            <thead><tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th class="text-left p-4">User</th><th class="text-left p-4">Role</th><th class="text-left p-4">Plan</th><th class="text-left p-4">Niche</th><th class="text-left p-4">Joined</th><th class="text-right p-4">Actions</th>
            </tr></thead>
            <tbody id="admin-users-table"><tr><td colspan="6" class="p-8 text-center text-gray-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- SUBSCRIPTIONS PAGE -->
      <div class="admin-page" id="admin-subscriptions">
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Active Subscriptions by Plan</h3>
          <div id="sub-breakdown" class="space-y-3"></div>
        </div>
      </div>

      <!-- POSTS MONITOR -->
      <div class="admin-page" id="admin-posts-monitor">
        <div class="glass-card overflow-hidden">
          <table class="w-full">
            <thead><tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th class="text-left p-4">Author</th><th class="text-left p-4">Caption</th><th class="text-left p-4">Platforms</th><th class="text-left p-4">Status</th><th class="text-left p-4">Date</th>
            </tr></thead>
            <tbody id="admin-posts-table"><tr><td colspan="5" class="p-8 text-center text-gray-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- ACTIVITY LOGS -->
      <div class="admin-page" id="admin-activity">
        <div class="glass-card overflow-hidden">
          <table class="w-full">
            <thead><tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
              <th class="text-left p-4">User</th><th class="text-left p-4">Action</th><th class="text-left p-4">Resource</th><th class="text-left p-4">Time</th>
            </tr></thead>
            <tbody id="admin-logs-table"><tr><td colspan="4" class="p-8 text-center text-gray-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- REVENUE -->
      <div class="admin-page" id="admin-revenue">
        <div class="glass-card p-6">
          <h3 class="font-bold mb-4">Revenue Overview</h3>
          <canvas id="revenue-chart" height="300"></canvas>
        </div>
      </div>
    </main>
  </div>

  <script>
    const token = localStorage.getItem('token') || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    
    function adminNav(page) {
      document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.admin-link').forEach(l => l.classList.remove('active'));
      document.getElementById('admin-' + page)?.classList.add('active');
      document.querySelector('[data-page="' + page + '"]')?.classList.add('active');
      const titles = { overview:'System Overview', users:'User Management', subscriptions:'Subscriptions', 'posts-monitor':'Posts Monitor', activity:'API Logs & Activity', revenue:'Revenue Analytics' };
      document.getElementById('admin-title').textContent = titles[page] || page;
      
      if (page === 'overview') loadAdminOverview();
      else if (page === 'users') loadAdminUsers();
      else if (page === 'subscriptions') loadAdminSubs();
      else if (page === 'posts-monitor') loadAdminPosts();
      else if (page === 'activity') loadAdminActivity();
      else if (page === 'revenue') loadAdminRevenue();
      return false;
    }

    async function loadAdminOverview() {
      try {
        const res = await fetch('/api/admin/overview', { headers });
        const json = await res.json();
        if (!json.success) return;
        const d = json.data;
        document.getElementById('adm-users').textContent = d.total_users;
        document.getElementById('adm-posts').textContent = d.total_posts;
        document.getElementById('adm-ai').textContent = d.total_ai_requests;
        document.getElementById('adm-revenue').textContent = '$' + (d.total_revenue / 100 || 0).toLocaleString();
        document.getElementById('adm-today-users').textContent = d.today_signups;
        document.getElementById('adm-today-posts').textContent = d.today_posts;
        
        const subs = d.subscriptions_by_plan || [];
        const ctx = document.getElementById('sub-chart');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: subs.map(s => s.plan),
            datasets: [{ data: subs.map(s => s.count), backgroundColor: ['#9CA3AF','#3b6cf5','#F59E0B'] }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      } catch (e) { console.error(e); }
    }

    async function loadAdminUsers() {
      const search = document.getElementById('user-search')?.value || '';
      const res = await fetch('/api/admin/users?search=' + encodeURIComponent(search), { headers });
      const json = await res.json();
      if (!json.success) return;
      const el = document.getElementById('admin-users-table');
      el.innerHTML = (json.data.users || []).map(u =>
        '<tr class="border-b border-gray-50 hover:bg-gray-50"><td class="p-4"><div class="font-medium text-sm">' + u.name + '</div><div class="text-xs text-gray-400">' + u.email + '</div></td><td class="p-4"><span class="text-xs px-2 py-1 rounded-full ' + (u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600') + '">' + u.role + '</span></td><td class="p-4 text-sm capitalize">' + u.plan + '</td><td class="p-4 text-sm capitalize">' + (u.niche || '-') + '</td><td class="p-4 text-xs text-gray-400">' + new Date(u.created_at).toLocaleDateString() + '</td><td class="p-4 text-right"><button onclick="viewUser(\\'' + u.id + '\\')" class="text-xs px-3 py-1 bg-brand-50 text-brand-600 rounded hover:bg-brand-100">View</button></td></tr>'
      ).join('');
    }

    function searchUsers() { clearTimeout(window._st); window._st = setTimeout(loadAdminUsers, 300); }
    function viewUser(id) { alert('User details for: ' + id + ' (would open detail modal in production)'); }

    async function loadAdminSubs() {
      const res = await fetch('/api/admin/overview', { headers });
      const json = await res.json();
      if (!json.success) return;
      const subs = json.data.subscriptions_by_plan || [];
      document.getElementById('sub-breakdown').innerHTML = subs.map(s =>
        '<div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"><span class="font-medium capitalize">' + s.plan + ' Plan</span><span class="text-lg font-bold">' + s.count + ' users</span></div>'
      ).join('');
    }

    async function loadAdminPosts() {
      const res = await fetch('/api/admin/posts', { headers });
      const json = await res.json();
      if (!json.success) return;
      const el = document.getElementById('admin-posts-table');
      el.innerHTML = (json.data.posts || []).map(p => {
        const platforms = JSON.parse(p.platforms || '[]');
        return '<tr class="border-b border-gray-50"><td class="p-4 text-sm">' + (p.author_name || '') + '</td><td class="p-4 text-sm truncate max-w-[200px]">' + (p.caption || '').substring(0,60) + '</td><td class="p-4"><div class="flex gap-1">' + platforms.map(pl => '<span class="text-xs bg-gray-100 px-2 py-0.5 rounded">' + pl + '</span>').join('') + '</div></td><td class="p-4"><span class="text-xs px-2 py-1 rounded-full bg-gray-100">' + p.status + '</span></td><td class="p-4 text-xs text-gray-400">' + new Date(p.created_at).toLocaleDateString() + '</td></tr>';
      }).join('');
    }

    async function loadAdminActivity() {
      const res = await fetch('/api/admin/activity', { headers });
      const json = await res.json();
      if (!json.success) return;
      document.getElementById('admin-logs-table').innerHTML = (json.data.logs || []).map(l =>
        '<tr class="border-b border-gray-50"><td class="p-4 text-sm">' + (l.user_name || l.user_email || '-') + '</td><td class="p-4 text-sm">' + l.action + '</td><td class="p-4 text-sm">' + (l.resource_type ? l.resource_type + '/' + l.resource_id : '-') + '</td><td class="p-4 text-xs text-gray-400">' + new Date(l.created_at).toLocaleString() + '</td></tr>'
      ).join('');
    }

    async function loadAdminRevenue() {
      const res = await fetch('/api/admin/revenue', { headers });
      const json = await res.json();
      if (!json.success) return;
      const monthly = json.data.monthly_revenue || [];
      const ctx = document.getElementById('revenue-chart');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthly.map(m => m.month),
          datasets: [{ label: 'Revenue ($)', data: monthly.map(m => m.total / 100), backgroundColor: '#3b6cf5' }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
    }

    // Init
    loadAdminOverview();
  </script>
</body>
</html>`;
}
