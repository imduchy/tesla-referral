// Renders the static site into dist/. No dependencies: `node build.mjs`.
// Each content/<lang>.json becomes a page (en at the root, others at /<lang>/).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist';
const STATUSES = ['active', 'ended', 'capReached'];
const DEFAULT_LANG = 'en';

const site = JSON.parse(readFileSync('site.json', 'utf8'));
if (!STATUSES.includes(site.offerStatus)) {
  throw new Error(`site.json offerStatus must be one of ${STATUSES.join(', ')}`);
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function renderPage(t) {
  const vars = {
    km: new Intl.NumberFormat(t.locale).format(site.superchargingKm),
    code: escapeHtml(site.referralCode),
    termsUrl: escapeHtml(site.termsUrl),
    checkedOn: new Intl.DateTimeFormat(t.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(site.offerCheckedOn)),
  };
  // Content strings are trusted (authored in this repo) and may contain inline HTML.
  const f = (s) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const plain = (s) => f(s).replace(/<[^>]+>/g, '');

  const status = t.status[site.offerStatus];
  const active = site.offerStatus === 'active';
  const prefix = t.lang === DEFAULT_LANG ? '' : '../';
  const canonical = site.siteUrl ? site.siteUrl.replace(/\/$/, '') + (t.lang === DEFAULT_LANG ? '/' : `/${t.lang}/`) : '';

  const goatcounter = site.goatcounterCode
    ? `<script data-goatcounter="https://${escapeHtml(site.goatcounterCode)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
    : '';

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${plain(t.meta.title)}</title>
<meta name="description" content="${escapeHtml(plain(t.meta.description))}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(plain(t.meta.title))}">
<meta property="og:description" content="${escapeHtml(plain(t.meta.description))}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111214" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${prefix}fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}styles.css">
<script src="${prefix}app.js" defer></script>
${goatcounter}
</head>
<body class="status-${site.offerStatus}">
<header class="nav">
  <a class="nav-name" href="./">${f(t.nav.siteName)}</a>
  <a class="nav-link" href="${vars.termsUrl}" rel="noopener" target="_blank">${f(t.nav.terms)} <span aria-hidden="true">↗</span></a>
</header>

<main>
  <section class="hero">
    <p class="eyebrow">${f(t.hero.eyebrow)}</p>
    <h1>${f(status.headline)}</h1>
    <p class="subline">${f(status.subline)}</p>
    ${status.notice ? `<p class="notice" role="status">${f(status.notice)}</p>` : ''}

    <div class="code-card${active ? '' : ' is-muted'}">
      <span class="code-label">${f(t.hero.codeLabel)}</span>
      <code class="code" id="referral-code">${vars.code}</code>
      <button type="button" class="btn-copy" data-copy="${vars.code}" data-copied-label="${escapeHtml(t.hero.copied)}">${f(t.hero.copy)}</button>
    </div>

    <div class="actions">
      ${active ? `<a class="btn btn-primary" href="${escapeHtml(site.referralUrl)}" rel="noopener" data-goatcounter-click="click-referral-link" data-goatcounter-title="Referral link clicked">${f(t.hero.cta)}</a>` : ''}
      <a class="btn btn-secondary" href="${active ? '#how-it-works' : vars.termsUrl}"${active ? '' : ' rel="noopener" target="_blank"'}>${active ? f(t.hero.secondary) : f(t.nav.terms)}</a>
    </div>

    <p class="independent">${f(t.hero.independent)}</p>
  </section>

  ${active ? `
  <section class="section" aria-labelledby="benefits-title">
    <h2 id="benefits-title">${f(t.benefits.title)}</h2>
    <div class="tiles">
      ${t.benefits.items.map((b) => `
      <div class="tile">
        <p class="tile-value">${f(b.value)}</p>
        <p class="tile-label">${f(b.label)}</p>
        <p class="tile-text">${f(b.text)}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="section" id="how-it-works" aria-labelledby="steps-title">
    <h2 id="steps-title">${f(t.steps.title)}</h2>
    <ol class="steps">
      ${t.steps.items.map((s) => `
      <li class="step">
        <p class="step-title">${f(s.title)}</p>
        <p class="step-text">${f(s.text)}</p>
      </li>`).join('')}
    </ol>
  </section>` : ''}

  <section class="section" aria-labelledby="faq-title">
    <h2 id="faq-title">${f(t.faq.title)}</h2>
    <div class="faq">
      ${t.faq.items.map((q) => `
      <details>
        <summary>${f(q.q)}</summary>
        <p>${f(q.a)}</p>
      </details>`).join('')}
    </div>
  </section>
</main>

<footer class="footer">
  <p>${f(t.footer.checked)}</p>
  <p class="disclaimer">${f(t.footer.disclaimer)}</p>
</footer>
</body>
</html>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const asset of ['styles.css', 'app.js', 'favicon.svg', 'fonts']) {
  cpSync(join('src', asset), join(OUT, asset), { recursive: true });
}

for (const file of readdirSync('content').filter((n) => n.endsWith('.json'))) {
  const t = JSON.parse(readFileSync(join('content', file), 'utf8'));
  const dir = t.lang === DEFAULT_LANG ? OUT : join(OUT, t.lang);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderPage(t));
  console.log(`built ${join(dir, 'index.html')} (${site.offerStatus})`);
}
