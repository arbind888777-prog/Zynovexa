// ============================================================
// Zynovexa - Auth Page (Login / Signup)
// ============================================================
export function authPage(mode) {
    const isLogin = mode === 'login';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isLogin ? 'Login' : 'Sign Up'} – Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>
    tailwind.config={theme:{extend:{colors:{brand:{500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}
  </script>
  <style>
    .gradient-side { background: linear-gradient(135deg, #1e3dd4 0%, #3b6cf5 50%, #6090fa 100%); }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 gradient-side flex-col justify-center items-center p-12 text-white relative overflow-hidden">
      <div class="absolute inset-0"><div class="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div><div class="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div></div>
      <div class="relative z-10 text-center max-w-md">
        <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8">
          <i class="fas fa-bolt text-3xl"></i>
        </div>
        <h1 class="text-4xl font-bold mb-4">Zynovexa</h1>
        <p class="text-lg text-white/80 mb-8">The AI-powered platform that automates your creator business.</p>
        <div class="space-y-4 text-left">
          <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i class="fas fa-check text-sm"></i></div><span>Manage all platforms in one place</span></div>
          <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i class="fas fa-check text-sm"></i></div><span>AI-powered content creation</span></div>
          <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i class="fas fa-check text-sm"></i></div><span>Smart scheduling & analytics</span></div>
          <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i class="fas fa-check text-sm"></i></div><span>Track monetization & brand deals</span></div>
        </div>
      </div>
    </div>
    
    <!-- Right Side - Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
      <div class="w-full max-w-md">
        <a href="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><i class="fas fa-bolt text-white text-sm"></i></div>
          <span class="text-xl font-bold">Zyno<span class="text-brand-600">vexa</span></span>
        </a>
        
        <h2 class="text-2xl font-bold mb-2">${isLogin ? 'Welcome back' : 'Create your account'}</h2>
        <p class="text-gray-500 mb-8">${isLogin ? 'Sign in to your Zynovexa dashboard' : 'Start your creator journey with AI-powered tools'}</p>

        <!-- Google OAuth Button -->
        <button onclick="handleGoogleAuth()" class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition mb-6">
          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span class="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-sm text-gray-400">or</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Email/Password Form -->
        <form id="auth-form" onsubmit="handleSubmit(event)" class="space-y-4">
          <div id="error-msg" class="hidden bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl"></div>
          
          ${!isLogin ? `
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" name="name" required placeholder="Sarah Chen" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm">
          </div>` : ''}
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" name="email" required placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <input type="password" name="password" required minlength="6" placeholder="${isLogin ? 'Enter your password' : 'Min. 6 characters'}" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm pr-10">
              <button type="button" onclick="togglePassword(this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" id="submit-btn" class="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
            ${isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          ${isLogin
        ? 'Don\'t have an account? <a href="/signup" class="text-brand-600 font-semibold hover:underline">Sign up free</a>'
        : 'Already have an account? <a href="/login" class="text-brand-600 font-semibold hover:underline">Sign in</a>'}
        </p>
      </div>
    </div>
  </div>

  <script>
    function togglePassword(btn) {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (input.type === 'password') { input.type = 'text'; btn.innerHTML = '<i class="fas fa-eye-slash"></i>'; }
      else { input.type = 'password'; btn.innerHTML = '<i class="fas fa-eye"></i>'; }
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const btn = document.getElementById('submit-btn');
      const errEl = document.getElementById('error-msg');
      const isLogin = ${isLogin};
      
      btn.disabled = true;
      btn.textContent = 'Please wait...';
      errEl.classList.add('hidden');

      const data = {
        email: form.email.value,
        password: form.password.value,
        ${!isLogin ? "name: form.name.value," : ''}
      };

      try {
        const res = await fetch('/api/auth/' + (isLogin ? 'login' : 'signup'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) {
          localStorage.setItem('token', json.data.token);
          localStorage.setItem('user', JSON.stringify(json.data.user));
          window.location.href = json.data.user.onboarded ? '/app' : '/onboarding';
        } else {
          errEl.textContent = json.message || 'Something went wrong';
          errEl.classList.remove('hidden');
        }
      } catch (err) {
        errEl.textContent = 'Network error. Please try again.';
        errEl.classList.remove('hidden');
      }
      btn.disabled = false;
      btn.textContent = isLogin ? 'Sign In' : 'Create Account';
    }

    function handleGoogleAuth() {
      alert('Google OAuth would redirect to Google consent screen in production. For demo, use email signup.');
    }
  </script>
</body>
</html>`;
}
