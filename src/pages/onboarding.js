// ============================================================
// Zynovexa - Onboarding Wizard (5 Steps)
// Step 1: Choose niche | Step 2: Connect accounts
// Step 3: Set goals | Step 4: Generate first post with AI
// Step 5: Choose plan
// ============================================================
export function onboardingPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Zynovexa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script>tailwind.config={theme:{extend:{colors:{brand:{500:'#3b6cf5',600:'#2850e8',700:'#1e3dd4'}}}}}</script>
  <style>.step-panel{display:none}.step-panel.active{display:block}.niche-card.selected,.goal-card.selected,.plan-card.selected{border-color:#2850e8;background:#f0f5ff;box-shadow:0 0 0 2px #2850e8}</style>
</head>
<body class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
  <div class="w-full max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><i class="fas fa-bolt text-white text-sm"></i></div>
        <span class="text-xl font-bold">Zyno<span class="text-brand-600">vexa</span></span>
      </div>
      <h1 class="text-2xl font-bold" id="step-title">What type of creator are you?</h1>
      <p class="text-gray-500 mt-1" id="step-desc">This helps us personalize your experience.</p>
    </div>

    <!-- Progress Bar -->
    <div class="flex gap-2 mb-8">
      <div class="h-1.5 rounded-full flex-1 bg-brand-600 transition-all" id="bar-1"></div>
      <div class="h-1.5 rounded-full flex-1 bg-gray-200 transition-all" id="bar-2"></div>
      <div class="h-1.5 rounded-full flex-1 bg-gray-200 transition-all" id="bar-3"></div>
      <div class="h-1.5 rounded-full flex-1 bg-gray-200 transition-all" id="bar-4"></div>
      <div class="h-1.5 rounded-full flex-1 bg-gray-200 transition-all" id="bar-5"></div>
    </div>

    <!-- STEP 1: Choose Niche -->
    <div class="step-panel active" id="step-1">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        ${['Lifestyle,fa-heart,pink', 'Tech,fa-microchip,blue', 'Fitness,fa-dumbbell,green', 'Beauty,fa-sparkles,purple', 'Food,fa-utensils,orange', 'Travel,fa-plane,cyan', 'Business,fa-briefcase,slate', 'Gaming,fa-gamepad,red', 'Education,fa-graduation-cap,indigo', 'Music,fa-music,violet', 'Photography,fa-camera,amber', 'Fashion,fa-shirt,rose']
        .map(n => {
        const [name, icon, color] = n.split(',');
        return `
        <div onclick="selectNiche(this,'${name.toLowerCase()}')" class="niche-card cursor-pointer border-2 border-gray-200 rounded-xl p-4 text-center hover:border-brand-500 transition">
          <i class="fas ${icon} text-2xl text-${color}-500 mb-2"></i>
          <div class="text-sm font-semibold">${name}</div>
        </div>`;
    }).join('')}
      </div>
    </div>

    <!-- STEP 2: Connect Accounts -->
    <div class="step-panel" id="step-2">
      <div class="space-y-3">
        ${['Instagram,fa-instagram,#E4405F', 'YouTube,fa-youtube,#FF0000', 'TikTok,fa-tiktok,#000000', 'Twitter / X,fa-twitter,#1DA1F2', 'LinkedIn,fa-linkedin,#0A66C2', 'Facebook,fa-facebook,#1877F2']
        .map(p => {
        const [name, icon, color] = p.split(',');
        return `
        <div class="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:${color}15">
              <i class="fab ${icon} text-lg" style="color:${color}"></i>
            </div>
            <span class="font-medium text-sm">${name}</span>
          </div>
          <button onclick="connectPlatform(this,'${name.toLowerCase().replace(/\\s.*/, '')}')" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-brand-600 hover:text-white hover:border-brand-600 transition font-medium">
            Connect
          </button>
        </div>`;
    }).join('')}
      </div>
      <p class="text-xs text-gray-400 mt-4 text-center"><i class="fas fa-lock mr-1"></i>We use secure OAuth. We never store your passwords.</p>
    </div>

    <!-- STEP 3: Set Goals -->
    <div class="step-panel" id="step-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${['Grow my audience,fa-chart-line', 'Save time on content,fa-clock', 'Improve engagement,fa-comments', 'Monetize my brand,fa-dollar-sign', 'Stay consistent,fa-calendar', 'Go viral,fa-fire']
        .map(g => {
        const [label, icon] = g.split(',');
        return `
        <div onclick="toggleGoal(this)" class="goal-card cursor-pointer border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-brand-500 transition bg-white">
          <div class="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center"><i class="fas ${icon} text-brand-600"></i></div>
          <span class="font-medium text-sm">${label}</span>
        </div>`;
    }).join('')}
      </div>
    </div>

    <!-- STEP 4: Generate First Post (AI magic moment) -->
    <div class="step-panel" id="step-4">
      <div class="glass-card p-6 bg-white rounded-xl border border-gray-200" style="border-radius:16px">
        <div class="text-center mb-6">
          <div class="text-4xl mb-2">✨</div>
          <h3 class="font-bold text-lg">Let's create your first post with AI</h3>
          <p class="text-xs text-gray-400 mt-1">See the power of Zynovexa in action</p>
        </div>
        <div class="space-y-3">
          <textarea id="ob-ai-topic" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="What do you want to post about? (e.g. 'morning routine tips')"></textarea>
          <button onclick="generateOnboardingPost()" id="ob-ai-btn" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-brand-600 text-white text-sm rounded-lg font-semibold">
            <i class="fas fa-wand-magic-sparkles mr-2"></i>Generate My First Post
          </button>
        </div>
        <div id="ob-ai-result" class="hidden mt-4">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto" id="ob-ai-content"></div>
          <div class="flex items-center gap-2 mt-3">
            <div class="flex-1 text-xs text-gray-400" id="ob-ai-score"></div>
            <button onclick="copyObPost()" class="text-xs text-brand-600 hover:underline"><i class="fas fa-copy mr-1"></i>Copy</button>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 5: Choose Plan -->
    <div class="step-panel" id="step-5">
      <div class="grid md:grid-cols-3 gap-4">
        <div onclick="selectPlan(this,'free')" class="plan-card selected cursor-pointer border-2 border-brand-600 bg-brand-50 rounded-xl p-5 text-center">
          <div class="text-sm font-semibold text-gray-500 mb-1">FREE</div>
          <div class="text-3xl font-bold mb-1">$0</div>
          <div class="text-xs text-gray-400 mb-3">Start exploring</div>
          <div class="text-xs text-gray-500 space-y-1"><p>2 accounts</p><p>10 posts/mo</p><p>20 AI gens</p></div>
        </div>
        <div onclick="selectPlan(this,'pro')" class="plan-card cursor-pointer border-2 border-gray-200 rounded-xl p-5 text-center bg-white">
          <div class="text-sm font-semibold text-brand-600 mb-1">PRO</div>
          <div class="text-3xl font-bold mb-1">$19</div>
          <div class="text-xs text-gray-400 mb-3">Per month</div>
          <div class="text-xs text-gray-500 space-y-1"><p>10 accounts</p><p>100 posts/mo</p><p>500 AI gens</p></div>
        </div>
        <div onclick="selectPlan(this,'business')" class="plan-card cursor-pointer border-2 border-gray-200 rounded-xl p-5 text-center bg-white">
          <div class="text-sm font-semibold text-gray-500 mb-1">BUSINESS</div>
          <div class="text-3xl font-bold mb-1">$49</div>
          <div class="text-xs text-gray-400 mb-3">Per month</div>
          <div class="text-xs text-gray-500 space-y-1"><p>Unlimited</p><p>Unlimited</p><p>Unlimited</p></div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between mt-8">
      <button onclick="prevStep()" id="btn-back" class="hidden px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
        <i class="fas fa-arrow-left mr-2"></i>Back
      </button>
      <div></div>
      <button onclick="nextStep()" id="btn-next" class="px-8 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
        Continue <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>

    <button onclick="skipOnboarding()" class="block mx-auto mt-4 text-sm text-gray-400 hover:text-gray-600 transition">
      Skip for now
    </button>
  </div>

  <script>
    let currentStep = 1;
    let onboardData = { niche: '', goals: [], plan: 'free' };
    const titles = ['', 'What type of creator are you?', 'Connect your social accounts', 'What are your goals?', 'Create your first AI post!', 'Choose your plan'];
    const descs = ['', 'This helps us personalize your AI recommendations.', 'We\\'ll sync your analytics and enable publishing. Skip any for now.', 'Select all that apply — AI will prioritize these.', 'See the magic. Generate a real post in seconds.', 'Start free. Upgrade anytime.'];

    function goToStep(n) {
      document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById('step-'+n).classList.add('active');
      document.getElementById('step-title').textContent=titles[n];
      document.getElementById('step-desc').textContent=descs[n];
      for(let i=1;i<=5;i++){document.getElementById('bar-'+i).className='h-1.5 rounded-full flex-1 transition-all '+(i<=n?'bg-brand-600':'bg-gray-200');}
      document.getElementById('btn-back').classList.toggle('hidden', n===1);
      document.getElementById('btn-next').innerHTML = n===5 ? 'Launch Dashboard <i class="fas fa-rocket ml-2"></i>' : 'Continue <i class="fas fa-arrow-right ml-2"></i>';
      currentStep = n;
    }
    function nextStep(){if(currentStep<5)goToStep(currentStep+1);else completeOnboarding();}
    function prevStep(){if(currentStep>1)goToStep(currentStep-1);}
    function selectNiche(el,v){document.querySelectorAll('.niche-card').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');onboardData.niche=v;}
    function connectPlatform(btn,p){btn.textContent='Connected';btn.className='px-4 py-2 text-sm bg-green-500 text-white rounded-lg font-medium cursor-default';btn.disabled=true;}
    function toggleGoal(el){el.classList.toggle('selected');const t=el.querySelector('span').textContent;if(onboardData.goals.includes(t))onboardData.goals=onboardData.goals.filter(g=>g!==t);else onboardData.goals.push(t);}
    function selectPlan(el,p){document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');onboardData.plan=p;}
    
    async function generateOnboardingPost() {
      const topic = document.getElementById('ob-ai-topic').value.trim();
      if (!topic) { alert('Enter a topic first!'); return; }
      const btn = document.getElementById('ob-ai-btn');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/ai-engine/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ input: topic, type: 'caption', platform: 'instagram', audience: 'general', tone: 'casual', niche: onboardData.niche || 'general' })
        });
        const d = (await res.json()).data || {};
        document.getElementById('ob-ai-result').classList.remove('hidden');
        document.getElementById('ob-ai-content').textContent = d.content || 'AI is warming up! Try again.';
        const s = d.score || {};
        document.getElementById('ob-ai-score').textContent = 'Score: ' + (s.overall || '—') + '/100 | Hook: ' + (s.hook || '—') + ' | Engagement: ' + (s.engagement || '—');
      } catch(e) {
        document.getElementById('ob-ai-result').classList.remove('hidden');
        document.getElementById('ob-ai-content').textContent = 'Could not generate right now. You can try this in the dashboard!';
      }
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-wand-magic-sparkles mr-2"></i>Regenerate';
    }
    function copyObPost() { navigator.clipboard.writeText(document.getElementById('ob-ai-content').textContent); alert('Copied!'); }
    
    async function completeOnboarding() {
      const token = localStorage.getItem('token');
      try {
        await fetch('/api/auth/onboard', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body:JSON.stringify(onboardData) });
        const user = JSON.parse(localStorage.getItem('user')||'{}');
        user.onboarded = 1;
        user.niche = onboardData.niche;
        user.plan = onboardData.plan;
        localStorage.setItem('user', JSON.stringify(user));
      } catch(e) {}
      window.location.href = '/app';
    }
    function skipOnboarding() { completeOnboarding(); }
  </script>
</body>
</html>`;
}
