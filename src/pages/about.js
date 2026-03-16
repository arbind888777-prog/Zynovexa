export function aboutPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Zynovexa | Creator Revenue OS</title>
  <meta name="description" content="Learn about Zynovexa, an advanced Creator Revenue OS for planning, publishing, analytics, and monetization in one secure platform.">
  <meta name="keywords" content="about zynovexa, creator revenue os, creator platform, social media automation, creator growth software">
  <link rel="canonical" href="https://zynovexa.com/about">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Zynovexa",
    "url": "https://zynovexa.com/about",
    "description": "Zynovexa is a Creator Revenue OS that unifies content planning, publishing, analytics, and monetization."
  }
  </script>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .hero { background: linear-gradient(135deg, #e0ecff 0%, #ffffff 50%, #f4f7ff 100%); }
  </style>
</head>
<body class="bg-slate-50 text-slate-800">
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/" class="font-bold text-slate-900">Zynovexa</a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="/privacy" class="text-slate-600 hover:text-slate-900">Privacy</a>
        <a href="/terms" class="text-slate-600 hover:text-slate-900">Terms</a>
        <a href="/signup" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold">Start Free</a>
      </nav>
    </div>
  </header>

  <section class="hero py-16 px-5 border-b border-slate-200">
    <div class="max-w-5xl mx-auto">
      <p class="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-3">About</p>
      <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">Built for serious creators who want business-level operations.</h1>
      <p class="mt-5 text-slate-600 text-lg max-w-3xl">Zynovexa combines AI content workflows, publishing automation, analytics intelligence, and monetization systems in one powerful platform so creators can scale with confidence.</p>
    </div>
  </section>

  <main class="max-w-5xl mx-auto px-5 py-14 space-y-10">
    <section class="bg-white rounded-2xl border border-slate-200 p-7">
      <h2 class="text-2xl font-bold text-slate-900">Our Mission</h2>
      <p class="mt-3 text-slate-600">Our mission is to make advanced creator infrastructure accessible to everyone, not only enterprise media teams. We help creators move from random posting to measurable growth and repeatable revenue operations.</p>
    </section>

    <section class="grid md:grid-cols-2 gap-5">
      <article class="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 class="font-bold text-slate-900">What the platform does</h3>
        <ul class="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>AI-assisted caption, script, and idea generation</li>
          <li>Content scheduling and cross-platform publishing workflows</li>
          <li>Performance analytics and trend-based optimization</li>
          <li>Monetization workflows including deals and media-kit data</li>
        </ul>
      </article>
      <article class="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 class="font-bold text-slate-900">Why teams trust Zynovexa</h3>
        <ul class="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>Role-aware access controls and secure account workflows</li>
          <li>Reliability checks and operational health monitoring</li>
          <li>Structured workflows that reduce manual overhead</li>
          <li>Clear roadmap focused on creator outcomes</li>
        </ul>
      </article>
    </section>

    <section class="bg-white rounded-2xl border border-slate-200 p-7">
      <h2 class="text-2xl font-bold text-slate-900">What makes us different</h2>
      <div class="mt-4 grid md:grid-cols-3 gap-4 text-sm">
        <div class="rounded-xl border border-slate-200 p-4">
          <h4 class="font-semibold text-slate-900">Unified Stack</h4>
          <p class="mt-2 text-slate-600">Create, publish, analyze, and monetize without switching between multiple tools.</p>
        </div>
        <div class="rounded-xl border border-slate-200 p-4">
          <h4 class="font-semibold text-slate-900">Execution + Intelligence</h4>
          <p class="mt-2 text-slate-600">Beyond reports, Zynovexa gives workflow actions creators can execute immediately.</p>
        </div>
        <div class="rounded-xl border border-slate-200 p-4">
          <h4 class="font-semibold text-slate-900">Revenue Focus</h4>
          <p class="mt-2 text-slate-600">Growth metrics are connected to monetization outcomes, not vanity metrics only.</p>
        </div>
      </div>
    </section>

    <section class="bg-slate-900 text-white rounded-2xl p-8">
      <h2 class="text-2xl font-bold">Ready to build your creator business?</h2>
      <p class="mt-3 text-slate-300">Join creators using Zynovexa to run content operations with clarity, speed, and trust.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="/signup" class="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold">Create Free Account</a>
        <a href="/terms" class="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-200">Read Terms</a>
      </div>
    </section>
  </main>
</body>
</html>`;
}
