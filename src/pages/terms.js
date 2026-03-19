export function termsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service | Zynovexa</title>
  <meta name="description" content="Zynovexa Terms of Service covering account use, social platform API compliance, acceptable use, subscriptions, content responsibility, and legal contact details.">
  <meta name="keywords" content="terms of service, zynovexa terms, social media api terms, oauth app legal terms, creator platform terms">
  <link rel="canonical" href="https://zynovexa.com/terms">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TermsOfService",
    "name": "Zynovexa Terms of Service",
    "url": "https://zynovexa.com/terms",
    "dateModified": "2026-03-19"
  }
  </script>
  <style>
    body { font-family: 'Manrope', sans-serif; }
    h1, h2, h3, .brand-font { font-family: 'Space Grotesk', sans-serif; }
    .hero-mesh {
      background-image:
        radial-gradient(circle at 15% 15%, rgba(251, 191, 36, 0.18), transparent 24%),
        radial-gradient(circle at 85% 10%, rgba(59, 130, 246, 0.16), transparent 22%),
        linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800">
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/" class="brand-font text-lg font-bold text-slate-950">Zynovexa</a>
      <nav class="text-sm flex items-center gap-4">
        <a href="/about" class="text-slate-600 hover:text-slate-950">About</a>
        <a href="/privacy" class="text-slate-600 hover:text-slate-950">Privacy</a>
        <a href="mailto:legal@zynovexa.com" class="hidden sm:inline-flex px-4 py-2 rounded-full bg-slate-950 text-white font-semibold">Contact Legal</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero-mesh border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
            Public Terms of Service
          </div>
          <h1 class="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-slate-950">Clear platform terms for customers and social media API reviewers.</h1>
          <p class="mt-6 max-w-3xl text-base md:text-lg leading-8 text-slate-700">These Terms of Service govern the use of Zynovexa websites, dashboards, APIs, connected platform integrations, and related services. By using Zynovexa, you agree to these Terms and the <a href="/privacy" class="font-semibold text-blue-700">Privacy Policy</a>.</p>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Effective Date</p>
              <p class="mt-2 text-lg font-semibold text-slate-950">March 19, 2026</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Legal Contact</p>
              <a href="mailto:legal@zynovexa.com" class="mt-2 block text-lg font-semibold text-blue-700">legal@zynovexa.com</a>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Applies To</p>
              <p class="mt-2 text-lg font-semibold text-slate-950">Web, app, APIs, integrations</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside class="lg:sticky lg:top-24 h-max rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Contents</h2>
          <nav class="mt-5 space-y-3 text-sm text-slate-600">
            <a href="#acceptance" class="block hover:text-slate-950">Acceptance</a>
            <a href="#service" class="block hover:text-slate-950">Service scope</a>
            <a href="#accounts" class="block hover:text-slate-950">Account responsibilities</a>
            <a href="#platforms" class="block hover:text-slate-950">Platform API compliance</a>
            <a href="#billing" class="block hover:text-slate-950">Billing</a>
            <a href="#use" class="block hover:text-slate-950">Acceptable use</a>
            <a href="#content" class="block hover:text-slate-950">Content and IP</a>
            <a href="#termination" class="block hover:text-slate-950">Termination</a>
            <a href="#liability" class="block hover:text-slate-950">Liability</a>
            <a href="#contact" class="block hover:text-slate-950">Contact</a>
          </nav>
        </aside>

        <div class="space-y-5">
          <section class="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-50 to-white p-6 text-sm leading-7 text-slate-700 shadow-lg shadow-slate-200/70">
            <strong class="text-slate-950">Quick summary:</strong> You may use Zynovexa only in compliance with applicable laws, these Terms, and the rules of any connected social platform. Users remain responsible for their content, permissions, and account activity.
          </section>

          <section id="acceptance" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">1. Eligibility and acceptance</h2>
            <p class="mt-4 text-slate-600 leading-7">You must be legally capable of entering into a binding agreement and must provide accurate registration and business information when using Zynovexa. If you use the service on behalf of a company, agency, or other entity, you represent that you have authority to bind that entity to these Terms.</p>
          </section>

          <section id="service" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">2. Service scope</h2>
            <p class="mt-4 text-slate-600 leading-7">Zynovexa provides creator workflow tools that may include content planning, AI assistance, publishing support, scheduling, social account connections, analytics, notifications, revenue operations, and related administrative tools. Features may change, improve, or be retired over time.</p>
          </section>

          <section id="accounts" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">3. Account responsibilities</h2>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
              <li>You are responsible for all activity occurring under your account or organization workspace.</li>
              <li>You must maintain the confidentiality of credentials, tokens, and connected integration permissions.</li>
              <li>You must promptly notify Zynovexa if you suspect unauthorized access, token compromise, or misuse.</li>
              <li>You must ensure that collaborators, team members, and clients using your workspace follow these Terms.</li>
            </ul>
          </section>

          <section id="platforms" class="rounded-3xl border border-blue-200 bg-blue-50 p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">4. Social platform API compliance</h2>
            <p class="mt-4 text-slate-700 leading-7">If you connect a social media account to Zynovexa, you remain responsible for complying with the terms, developer rules, content policies, and API limitations of that third-party platform. Zynovexa does not grant rights to use a platform beyond the permissions directly approved by that platform and the user.</p>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-700">
              <li>You may not use Zynovexa to bypass platform restrictions, automate prohibited behavior, or obtain unauthorized data.</li>
              <li>You may not use Zynovexa for spam, fake engagement, misleading impersonation, or unlawful scraping.</li>
              <li>Where a platform does not permit a specific publishing action through its API, Zynovexa may limit, refuse, or convert that action into a manual workflow.</li>
              <li>Connected platform access may be suspended or removed if required by the platform, law, security needs, or abuse-prevention measures.</li>
            </ul>
          </section>

          <section id="billing" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">5. Billing and subscriptions</h2>
            <p class="mt-4 text-slate-600 leading-7">Paid plans, if offered, are billed in advance on the pricing schedule presented at purchase. Unless otherwise stated, subscriptions renew automatically until canceled. Payment processing may be handled by authorized third-party processors, and your use of their services may be subject to their separate terms.</p>
          </section>

          <section id="use" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">6. Acceptable use</h2>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
              <li>No unlawful, fraudulent, deceptive, abusive, harassing, or infringing activity.</li>
              <li>No malware, credential attacks, reverse engineering beyond legal allowances, or service interference.</li>
              <li>No use of the service to distribute spam, manipulate engagement, or violate intellectual property rights.</li>
              <li>No attempt to access data or platform functionality without authorization.</li>
            </ul>
          </section>

          <section id="content" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">7. Content and intellectual property</h2>
            <p class="mt-4 text-slate-600 leading-7">You retain ownership of content you upload, draft, connect, or publish through Zynovexa. You grant Zynovexa a limited, non-exclusive license to host, process, transform, display, and transmit that content only as needed to operate the service for you.</p>
            <p class="mt-3 text-slate-600 leading-7">Zynovexa software, product interfaces, documentation, trademarks, and related brand assets remain the property of Zynovexa or its licensors.</p>
          </section>

          <section id="termination" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">8. Suspension, termination, and changes</h2>
            <p class="mt-4 text-slate-600 leading-7">We may suspend, restrict, or terminate access if we reasonably believe there is a violation of these Terms, a legal requirement, a platform enforcement action, a security threat, payment non-compliance, or abuse of the service. We may also update these Terms from time to time by posting a revised version on this page.</p>
          </section>

          <section id="liability" class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
            <h2 class="text-2xl font-bold text-slate-950">9. Disclaimer and liability limits</h2>
            <p class="mt-4 text-slate-600 leading-7">To the extent permitted by law, Zynovexa is provided on an "as is" and "as available" basis without guarantees of uninterrupted operation, third-party platform availability, or specific commercial outcomes. Zynovexa is not responsible for losses caused by third-party platform outages, account enforcement actions by external services, or user content violations.</p>
          </section>

          <section id="contact" class="rounded-3xl border border-slate-950 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-400/30">
            <h2 class="text-2xl font-bold">10. Contact</h2>
            <p class="mt-4 text-slate-300 leading-7">Legal inquiries: <a href="mailto:legal@zynovexa.com" class="font-semibold text-amber-300">legal@zynovexa.com</a></p>
            <p class="mt-2 text-slate-300 leading-7">Support: <a href="mailto:support@zynovexa.com" class="font-semibold text-amber-300">support@zynovexa.com</a></p>
            <p class="mt-2 text-slate-300 leading-7">Privacy: <a href="mailto:privacy@zynovexa.com" class="font-semibold text-amber-300">privacy@zynovexa.com</a></p>
          </section>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`;
}
