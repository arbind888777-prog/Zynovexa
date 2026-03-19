export function dataDeletionPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Deletion Instructions | Zynovexa</title>
  <meta name="description" content="Zynovexa data deletion instructions for users and social platform reviewers. Learn how to request account deletion, what data is removed, retention timelines, and support contacts.">
  <meta name="keywords" content="data deletion, account deletion, zynovexa delete account, social media app deletion instructions, oauth data deletion">
  <link rel="canonical" href="https://zynovexa.com/data-deletion">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Zynovexa Data Deletion Instructions",
    "url": "https://zynovexa.com/data-deletion",
    "dateModified": "2026-03-19"
  }
  </script>
  <style>
    body { font-family: 'Manrope', sans-serif; }
    h1, h2, h3, .brand-font { font-family: 'Space Grotesk', sans-serif; }
    .page-bg {
      background-image:
        radial-gradient(circle at 0% 0%, rgba(14, 165, 233, 0.14), transparent 26%),
        radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.14), transparent 22%),
        linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%);
    }
  </style>
</head>
<body class="page-bg min-h-screen text-slate-800">
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/" class="brand-font text-lg font-bold text-slate-950">Zynovexa</a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="/privacy" class="text-slate-600 hover:text-slate-950">Privacy</a>
        <a href="/terms" class="text-slate-600 hover:text-slate-950">Terms</a>
        <a href="mailto:privacy@zynovexa.com" class="hidden sm:inline-flex rounded-full bg-slate-950 px-4 py-2 font-semibold text-white">Email Privacy Team</a>
      </nav>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-5 py-12 md:py-16">
    <section class="rounded-[2rem] border border-cyan-100 bg-white/90 p-8 shadow-xl shadow-cyan-100/70 md:p-10">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-800">
          Public Data Deletion URL
        </div>
        <h1 class="mt-6 text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">How to request deletion of your Zynovexa account and connected social data.</h1>
        <p class="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">This page is intended for users, partners, and social platform reviewers who need a public explanation of Zynovexa's account deletion process. If you want your account or connected social integration data removed, follow the steps below.</p>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Primary URL</p>
            <p class="mt-2 text-sm font-semibold text-slate-950">/data-deletion</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Contact</p>
            <a href="mailto:privacy@zynovexa.com" class="mt-2 block text-sm font-semibold text-cyan-700">privacy@zynovexa.com</a>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Processing Window</p>
            <p class="mt-2 text-sm font-semibold text-slate-950">Typically within 7-30 days</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-5">
        <section class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
          <h2 class="text-2xl font-bold text-slate-950">1. How to submit a deletion request</h2>
          <ol class="mt-4 list-decimal list-inside space-y-3 text-sm leading-7 text-slate-600">
            <li>Email <a href="mailto:privacy@zynovexa.com" class="font-semibold text-cyan-700">privacy@zynovexa.com</a> from the address associated with your Zynovexa account.</li>
            <li>Use a clear subject line such as "Account Deletion Request" or "Delete My Data".</li>
            <li>Include your account email, workspace or profile name if relevant, and any connected social platform you want disconnected.</li>
            <li>If we need to verify identity for security reasons, we may request limited confirmation before completing deletion.</li>
          </ol>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
          <h2 class="text-2xl font-bold text-slate-950">2. What data is deleted</h2>
          <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
            <li>Zynovexa account profile data such as name, email, settings, and account metadata.</li>
            <li>Connected social account tokens and related integration credentials stored by Zynovexa.</li>
            <li>User-generated drafts, scheduled workflow records, and associated app content where deletion is operationally supported.</li>
            <li>Support-side references or uploaded materials unless a legal or fraud-prevention retention obligation applies.</li>
          </ul>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
          <h2 class="text-2xl font-bold text-slate-950">3. What may be retained for a limited period</h2>
          <ul class="mt-4 list-disc list-inside space-y-2 text-sm leading-7 text-slate-600">
            <li>Billing, invoice, tax, security, abuse-prevention, and audit records where retention is legally required or reasonably necessary.</li>
            <li>Temporary backup copies that expire according to backup rotation schedules.</li>
            <li>Minimal logs needed to confirm deletion completion, investigate fraud, or comply with legal requests.</li>
          </ul>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
          <h2 class="text-2xl font-bold text-slate-950">4. Connected social platform access</h2>
          <p class="mt-4 text-sm leading-7 text-slate-600">Deleting your Zynovexa account removes or invalidates integration tokens stored by Zynovexa, but you may also need to revoke app permissions directly from the connected social platform account settings. This is especially relevant for OAuth-based connections such as Google, Facebook, Instagram, LinkedIn, YouTube, TikTok, or similar services.</p>
        </section>
      </div>

      <div class="space-y-5">
        <section class="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-lg shadow-emerald-100/70">
          <h2 class="text-2xl font-bold text-slate-950">Reviewer summary</h2>
          <p class="mt-4 text-sm leading-7 text-slate-700">Zynovexa provides this public page so third-party platforms can verify that users have a clear deletion channel. Users can request deletion by emailing the privacy team, and associated tokens and account data are removed according to the Privacy Policy and applicable legal obligations.</p>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
          <h2 class="text-2xl font-bold text-slate-950">Quick links</h2>
          <div class="mt-4 space-y-3 text-sm">
            <a href="/privacy" class="block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Privacy Policy</a>
            <a href="/terms" class="block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Terms of Service</a>
            <a href="mailto:privacy@zynovexa.com" class="block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">privacy@zynovexa.com</a>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-950 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-300/40">
          <h2 class="text-2xl font-bold">Need deletion help?</h2>
          <p class="mt-4 text-sm leading-7 text-slate-300">If you cannot access your account or need help identifying connected social integrations, email the privacy team with the details you still have available.</p>
          <a href="mailto:privacy@zynovexa.com?subject=Account%20Deletion%20Request" class="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Request deletion by email</a>
        </section>
      </div>
    </section>
  </main>
</body>
</html>`;
}