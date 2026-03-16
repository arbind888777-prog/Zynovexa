export function privacyPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy | Zynovexa</title>
  <meta name="description" content="Zynovexa Privacy Policy: what we collect, how we use data, security controls, retention periods, and user rights.">
  <meta name="keywords" content="privacy policy, zynovexa privacy, creator platform privacy, data rights">
  <link rel="canonical" href="https://zynovexa.com/privacy">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    "name": "Zynovexa Privacy Policy",
    "url": "https://zynovexa.com/privacy",
    "dateModified": "2026-03-07"
  }
  </script>
</head>
<body class="bg-slate-50 text-slate-800">
  <header class="border-b border-slate-200 bg-white sticky top-0 z-20">
    <div class="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/" class="font-bold text-slate-900">Zynovexa</a>
      <nav class="text-sm flex gap-4">
        <a href="/about" class="text-slate-600 hover:text-slate-900">About</a>
        <a href="/terms" class="text-slate-600 hover:text-slate-900">Terms</a>
      </nav>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-5 py-10">
    <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
    <p class="mt-3 text-slate-600">Last updated: March 7, 2026</p>

    <section class="mt-6 p-5 rounded-xl bg-blue-50 border border-blue-100 text-sm text-slate-700">
      <strong class="text-slate-900">Quick summary:</strong> We collect only the data needed to run the service securely, process billing, and improve reliability. We do not sell personal data. Users can request access, correction, export, or deletion.
    </section>

    <section class="mt-8 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">1. Scope and data controller</h2>
      <p class="mt-3 text-slate-600">This policy applies to Zynovexa websites, dashboards, APIs, and related creator services operated by Zynovexa Technologies.</p>
      <p class="mt-2 text-slate-600">Contact: privacy@zynovexa.com</p>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">2. Data we collect</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
        <li>Account information: name, email, login metadata, settings.</li>
        <li>Usage information: page events, feature usage, performance logs.</li>
        <li>Connected account data: authorized platform tokens and profile metadata.</li>
        <li>Billing information: subscription records and payment outcomes from processor events.</li>
      </ul>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">3. How we use data</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
        <li>Provide publishing, analytics, and monetization workflows.</li>
        <li>Protect accounts and detect abuse patterns.</li>
        <li>Operate billing and support services.</li>
        <li>Improve product reliability and user experience.</li>
      </ul>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">4. Sharing and subprocessors</h2>
      <p class="mt-3 text-slate-600">We share data only with trusted processors for hosting, email delivery, payment processing, and AI inference, under contractual safeguards.</p>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">5. Security controls</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
        <li>Transport encryption and secure session handling.</li>
        <li>Authentication protections, validation, and rate limiting.</li>
        <li>Operational monitoring and incident response workflow.</li>
      </ul>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">6. Your rights</h2>
      <p class="mt-3 text-slate-600">Depending on law, you may request access, correction, export, deletion, or restriction of your personal data. Send requests to privacy@zynovexa.com.</p>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">7. Retention and deletion</h2>
      <p class="mt-3 text-slate-600">We retain account data while services are active and remove personal data upon valid deletion requests, except records required for legal and tax obligations.</p>
    </section>

    <section class="mt-5 bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-xl font-bold text-slate-900">8. Contact and complaints</h2>
      <p class="mt-3 text-slate-600">Privacy requests: privacy@zynovexa.com</p>
      <p class="mt-1 text-slate-600">Security reports: security@zynovexa.com</p>
    </section>
  </main>
</body>
</html>`;
}
