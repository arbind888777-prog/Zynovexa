export function privacyPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy | Zynovexa</title>
  <meta name="description" content="Zynovexa Privacy Policy for website visitors, customers, and social platform API reviewers. Learn what data we collect, how OAuth permissions are used, retention periods, security controls, and deletion rights.">
  <meta name="keywords" content="privacy policy, zynovexa privacy, social media api privacy policy, oauth privacy, data deletion, creator platform privacy">
  <link rel="canonical" href="https://zynovexa.com/privacy">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    "name": "Zynovexa Privacy Policy",
    "url": "https://zynovexa.com/privacy",
    "dateModified": "2026-03-19"
  }
  </script>
  <style>
    body { font-family: 'Manrope', sans-serif; }
    h1, h2, h3, .brand-font { font-family: 'Space Grotesk', sans-serif; }
    .hero-grid {
      background-image:
        linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
      background-size: 28px 28px;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100">
  <header class="border-b border-white/10 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/" class="brand-font text-lg font-bold text-white">Zynovexa</a>
      <nav class="text-sm flex items-center gap-4">
        <a href="/about" class="text-slate-300 hover:text-white">About</a>
        <a href="/data-deletion" class="text-slate-300 hover:text-white">Data Deletion</a>
        <a href="/terms" class="text-slate-300 hover:text-white">Terms</a>
        <a href="mailto:privacy@zynovexa.com" class="hidden sm:inline-flex px-4 py-2 rounded-full bg-cyan-400 text-slate-950 font-semibold">Contact Privacy Team</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero-grid overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <div class="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Public Legal Page
          </div>
          <h1 class="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-white">Privacy Policy built for users, customers, and social platform API review.</h1>
          <p class="mt-6 max-w-3xl text-base md:text-lg leading-8 text-slate-300">This page explains how Zynovexa collects, uses, stores, and deletes information when someone visits our website, creates an account, or connects a social media profile through OAuth or other approved APIs.</p>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Last Updated</p>
              <p class="mt-2 text-lg font-semibold text-white">March 19, 2026</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Privacy Contact</p>
              <a href="mailto:privacy@zynovexa.com" class="mt-2 block text-lg font-semibold text-cyan-300">privacy@zynovexa.com</a>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Data Deletion</p>
              <a href="/data-deletion" class="mt-2 block text-lg font-semibold text-cyan-300">View deletion instructions</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside class="lg:sticky lg:top-24 h-max rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">On this page</h2>
          <nav class="mt-5 space-y-3 text-sm text-slate-300">
            <a href="#scope" class="block hover:text-white">Scope and controller</a>
            <a href="#collect" class="block hover:text-white">Data we collect</a>
            <a href="#apis" class="block hover:text-white">Social API and OAuth data</a>
            <a href="#use" class="block hover:text-white">How we use data</a>
            <a href="#sharing" class="block hover:text-white">Sharing and subprocessors</a>
            <a href="#retention" class="block hover:text-white">Retention and deletion</a>
            <a href="/data-deletion" class="block hover:text-white">Public deletion page</a>
            <a href="#rights" class="block hover:text-white">User rights</a>
            <a href="#security" class="block hover:text-white">Security controls</a>
            <a href="#contact" class="block hover:text-white">Contact</a>
          </nav>
        </aside>

        <div class="space-y-5">
          <section class="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-sm leading-7 text-cyan-50">
            <strong class="text-white">Plain-language summary:</strong> Zynovexa collects only the information required to provide creator workflow tools, authenticate users, connect approved social accounts, generate analytics, process subscriptions, and protect the service. We do not sell personal data. Users can request access, correction, export, revocation, and deletion through our privacy contact.
          </section>

          <section id="scope" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">1. Scope and data controller</h2>
            <p class="mt-4 text-slate-600 leading-7">This Privacy Policy applies to Zynovexa websites, product dashboards, APIs, connected applications, support workflows, and related services operated by Zynovexa Technologies.</p>
            <p class="mt-3 text-slate-600 leading-7">For privacy questions, platform reviewer requests, or data subject requests, contact <a href="mailto:privacy@zynovexa.com" class="font-semibold text-cyan-700">privacy@zynovexa.com</a>.</p>
          </section>

          <section id="collect" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">2. Data we collect</h2>
            <div class="mt-5 grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl bg-slate-50 p-5">
                <h3 class="text-lg font-bold text-slate-900">Account and profile data</h3>
                <ul class="mt-3 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
                  <li>Name, email address, profile photo, timezone, account settings, and login metadata.</li>
                  <li>Authentication details such as hashed credentials or approved sign-in provider identifiers.</li>
                </ul>
              </div>
              <div class="rounded-2xl bg-slate-50 p-5">
                <h3 class="text-lg font-bold text-slate-900">Usage and technical data</h3>
                <ul class="mt-3 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
                  <li>Browser, device, IP-derived diagnostics, logs, page events, feature usage, and performance metrics.</li>
                  <li>Cookies or equivalent session technologies used for authentication, security, and service continuity.</li>
                </ul>
              </div>
              <div class="rounded-2xl bg-slate-50 p-5">
                <h3 class="text-lg font-bold text-slate-900">Connected platform data</h3>
                <ul class="mt-3 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
                  <li>Platform account identifiers, usernames, avatars, follower counts, publishing metadata, and analytics returned by connected social APIs.</li>
                  <li>OAuth access tokens, refresh tokens, and token expiry data needed to maintain approved integrations.</li>
                </ul>
              </div>
              <div class="rounded-2xl bg-slate-50 p-5">
                <h3 class="text-lg font-bold text-slate-900">Billing and support data</h3>
                <ul class="mt-3 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
                  <li>Subscription status, invoice references, payment outcomes, and processor event records.</li>
                  <li>Messages, tickets, screenshots, or attachments voluntarily submitted to support.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="apis" class="rounded-3xl border border-amber-200 bg-amber-50 p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">3. Social API and OAuth data</h2>
            <p class="mt-4 text-slate-700 leading-7">When a user connects Instagram, YouTube, TikTok, LinkedIn, Facebook, X, or another supported platform, Zynovexa accesses only the permissions approved by the user and allowed by the platform. Access is used strictly for features such as account connection, content publishing, scheduling, analytics, moderation support, and related creator operations.</p>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-700">
              <li>We do not ask users to share social media passwords directly with Zynovexa when OAuth is available.</li>
              <li>We use tokens and granted scopes solely to provide the requested integration features.</li>
              <li>We do not sell, rent, or broker platform data obtained through social API integrations.</li>
              <li>Users can revoke platform access from the relevant social platform settings or by contacting us for disconnection and deletion assistance.</li>
            </ul>
          </section>

          <section id="use" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">4. How we use information</h2>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
              <li>To create and manage user accounts, sessions, and connected social profiles.</li>
              <li>To publish, schedule, analyze, and optimize content across supported platforms.</li>
              <li>To maintain security, detect abuse, troubleshoot incidents, and enforce service policies.</li>
              <li>To process billing, maintain financial records, and provide customer support.</li>
              <li>To improve product quality, reliability, and the user experience through aggregate diagnostics.</li>
              <li>To comply with legal obligations, platform requirements, and lawful requests.</li>
            </ul>
          </section>

          <section id="sharing" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">5. Sharing and subprocessors</h2>
            <p class="mt-4 text-slate-600 leading-7">We share data only with service providers and subprocessors that help us operate the platform, such as infrastructure hosting, email delivery, payment processing, customer communications, monitoring, and approved AI or analytics services. These providers receive only the information reasonably necessary for their role and are expected to protect it under contract or equivalent safeguards.</p>
            <p class="mt-3 text-slate-600 leading-7">We may also disclose information if required by law, to investigate fraud or abuse, or to protect the rights, safety, and security of Zynovexa, users, or the public.</p>
          </section>

          <section id="retention" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">6. Retention, deletion, and deauthorization</h2>
            <p class="mt-4 text-slate-600 leading-7">We retain personal data only for as long as needed to provide the service, maintain account continuity, comply with legal and tax obligations, resolve disputes, and enforce agreements.</p>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
              <li>Users may request account deletion and associated personal data deletion by emailing <a href="mailto:privacy@zynovexa.com" class="font-semibold text-cyan-700">privacy@zynovexa.com</a>.</li>
              <li>Public deletion instructions are available at <a href="/data-deletion" class="font-semibold text-cyan-700">/data-deletion</a> for users and platform reviewers.</li>
              <li>Connected social account tokens are removed or invalidated when a user disconnects the integration, closes the account, or requests deletion, subject to operational and legal requirements.</li>
              <li>Backup copies and limited records may persist temporarily for disaster recovery, fraud prevention, accounting, or legal compliance purposes.</li>
            </ul>
          </section>

          <section id="rights" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">7. User rights</h2>
            <p class="mt-4 text-slate-600 leading-7">Depending on applicable law, users may have the right to request access, correction, deletion, restriction, objection, export, or withdrawal of consent for certain personal data processing activities.</p>
            <p class="mt-3 text-slate-600 leading-7">To exercise these rights, send a request to <a href="mailto:privacy@zynovexa.com" class="font-semibold text-cyan-700">privacy@zynovexa.com</a>. We may request reasonable identity verification before processing privacy requests.</p>
          </section>

          <section id="security" class="rounded-3xl border border-white/10 bg-white p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">8. Security controls</h2>
            <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
              <li>Encrypted transport, access controls, authentication protections, and server-side validation.</li>
              <li>Monitoring, logging, rate limiting, and operational safeguards intended to reduce misuse.</li>
              <li>Reasonable administrative, technical, and organizational measures designed to protect stored data.</li>
            </ul>
            <p class="mt-4 text-slate-600 leading-7">No internet or storage system can be guaranteed to be perfectly secure, but we work to maintain protections appropriate to the nature of the data we process.</p>
          </section>

          <section id="contact" class="rounded-3xl border border-cyan-400/20 bg-[linear-gradient(135deg,_rgba(34,211,238,0.12),_rgba(255,255,255,1))] p-7 text-slate-800 shadow-2xl shadow-slate-950/20">
            <h2 class="text-2xl font-bold text-slate-950">9. Contact and complaints</h2>
            <p class="mt-4 text-slate-700 leading-7">Privacy team: <a href="mailto:privacy@zynovexa.com" class="font-semibold text-cyan-700">privacy@zynovexa.com</a></p>
            <p class="mt-2 text-slate-700 leading-7">Security reports: <a href="mailto:security@zynovexa.com" class="font-semibold text-cyan-700">security@zynovexa.com</a></p>
            <p class="mt-2 text-slate-700 leading-7">General support: <a href="mailto:support@zynovexa.com" class="font-semibold text-cyan-700">support@zynovexa.com</a></p>
            <p class="mt-5 text-sm leading-7 text-slate-600">If Zynovexa materially changes this policy, we will post the updated version on this page with a new effective date.</p>
          </section>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`;
}
