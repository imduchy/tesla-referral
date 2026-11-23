// Renders the static site into dist/. No dependencies: `node build.mjs`.
// Each content/<lang>.json becomes a page (en at the root, others at /<lang>/),
// plus sitemap.xml, robots.txt and 404.html.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist';
const STATUSES = ['active', 'ended', 'capReached'];
const DEFAULT_LANG = 'en';

const site = JSON.parse(readFileSync('site.json', 'utf8'));
if (!STATUSES.includes(site.offerStatus)) {
  throw new Error(`site.json offerStatus must be one of ${STATUSES.join(', ')}`);
}
const siteUrl = (site.siteUrl || '').replace(/\/$/, '');

const languages = readdirSync('content')
  .filter((n) => n.endsWith('.json'))
  .map((n) => JSON.parse(readFileSync(join('content', n), 'utf8')))
  .sort((a, b) => (a.lang === DEFAULT_LANG ? -1 : b.lang === DEFAULT_LANG ? 1 : a.lang.localeCompare(b.lang)));

const pathFor = (lang) => (lang === DEFAULT_LANG ? '/' : `/${lang}/`);
const absUrl = (path) => siteUrl + path;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function helpers(t) {
  const date = new Date(site.offerCheckedOn);
  const vars = {
    km: new Intl.NumberFormat(t.locale).format(site.superchargingKm),
    code: escapeHtml(site.referralCode),
    termsUrl: escapeHtml(t.termsUrl || site.termsUrl),
    checkedOn: new Intl.DateTimeFormat(t.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date),
    monthYear: new Intl.DateTimeFormat(t.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date),
  };
  // Content strings are trusted (authored in this repo) and may contain inline HTML.
  const f = (s) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const plain = (s) => f(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  return { vars, f, plain };
}

function renderPage(t) {
  const { vars, f, plain } = helpers(t);
  const status = t.status[site.offerStatus];
  const active = site.offerStatus === 'active';
  const prefix = t.lang === DEFAULT_LANG ? '' : '../';
  const path = pathFor(t.lang);
  const title = plain(status.title || t.meta.title);
  const description = plain(status.description || t.meta.description);
  const ogImage = siteUrl ? absUrl(`/og/og-${t.lang}.png`) : '';

  const alternates = siteUrl
    ? [
        ...languages.map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${absUrl(pathFor(l.lang))}">`),
        `<link rel="alternate" hreflang="x-default" href="${absUrl('/')}">`,
      ].join('\n')
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': absUrl(path),
        url: absUrl(path),
        name: title,
        description,
        inLanguage: t.lang,
        dateModified: site.offerCheckedOn,
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.items.map((q) => ({
          '@type': 'Question',
          name: plain(q.q),
          acceptedAnswer: { '@type': 'Answer', text: plain(q.a) },
        })),
      },
    ],
  };

  const langSwitch = languages
    .map((l) =>
      l.lang === t.lang
        ? `<span aria-current="page">${l.lang.toUpperCase()}</span>`
        : `<a href="${prefix}${l.lang === DEFAULT_LANG ? '' : `${l.lang}/`}" hreflang="${l.lang}" lang="${l.lang}" title="${escapeHtml(l.langName)}">${l.lang.toUpperCase()}</a>`,
    )
    .join('');

  const goatcounter = site.goatcounterCode
    ? `<script data-goatcounter="https://${escapeHtml(site.goatcounterCode)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
    : '';

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${siteUrl ? `<link rel="canonical" href="${absUrl(path)}">` : ''}
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(plain(t.nav.siteName))}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:locale" content="${t.locale.replace('-', '_')}">
${siteUrl ? `<meta property="og:url" content="${absUrl(path)}">` : ''}
${ogImage ? `<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(plain(t.og.alt))}">
<meta name="twitter:card" content="summary_large_image">` : ''}
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111214" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${prefix}fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
<script src="${prefix}app.js" defer></script>
${goatcounter}
</head>
<body class="status-${site.offerStatus}">
<header class="nav">
  <a class="nav-name" href="./">${f(t.nav.siteName)}</a>
  <nav class="nav-right" aria-label="${escapeHtml(t.nav.languageLabel)}">
    <span class="lang-switch">${langSwitch}</span>
    <a class="nav-link" href="${vars.termsUrl}" rel="noopener" target="_blank">${f(t.nav.terms)} <span aria-hidden="true">↗</span></a>
  </nav>
</header>

<main>
  <section class="hero">
    <h1><span class="eyebrow">${f(t.hero.eyebrow)}</span> <span class="headline">${f(status.headline)}</span></h1>
    <p class="subline">${f(status.subline)}</p>
    ${status.notice ? `<p class="notice" role="status">${f(status.notice)}</p>` : ''}

    <div class="code-card${active ? '' : ' is-muted'}">
      <span class="code-label">${f(t.hero.codeLabel)}</span>
      <code class="code" id="referral-code">${vars.code}</code>
      <button type="button" class="btn-copy" data-copy="${vars.code}" data-copied-label="${escapeHtml(t.hero.copied)}">${f(t.hero.copy)}</button>
    </div>

    <div class="actions">
      ${active ? `<a class="btn btn-primary" href="${escapeHtml(site.referralUrl)}" rel="noopener" data-goatcounter-click="click-referral-link-${t.lang}" data-goatcounter-title="Referral link clicked (${t.lang})">${f(t.hero.cta)}</a>` : ''}
      <a class="btn btn-secondary" href="${active ? '#how-it-works' : vars.termsUrl}"${active ? '' : ' rel="noopener" target="_blank"'}>${active ? f(t.hero.secondary) : f(t.nav.terms)}</a>
    </div>

    <p class="independent"><time datetime="${site.offerCheckedOn}">${f(t.hero.updated)}</time> · ${f(t.hero.independent)}</p>
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
        <h3 class="step-title">${f(s.title)}</h3>
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

function render404() {
  const links = languages
    .map((l) => `<a class="btn btn-secondary" href="${pathFor(l.lang)}" lang="${l.lang}">${escapeHtml(l.notFound.link)}</a>`)
    .join('\n      ');
  const en = languages.find((l) => l.lang === DEFAULT_LANG) || languages[0];
  return `<!doctype html>
<html lang="${en.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(en.notFound.title)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main>
  <section class="hero">
    <h1><span class="headline">${escapeHtml(en.notFound.title)}</span></h1>
    <div class="actions">
      ${links}
    </div>
  </section>
</main>
</body>
</html>
`;
}

function renderSitemap() {
  const alt = languages
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l.lang}" href="${absUrl(pathFor(l.lang))}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl('/')}"/>`)
    .join('\n');
  const urls = languages
    .map((l) => `  <url>\n    <loc>${absUrl(pathFor(l.lang))}</loc>\n    <lastmod>${site.offerCheckedOn}</lastmod>\n${alt}\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const asset of ['styles.css', 'app.js', 'favicon.svg', 'fonts', 'og']) {
  if (existsSync(join('src', asset))) cpSync(join('src', asset), join(OUT, asset), { recursive: true });
}

for (const t of languages) {
  const dir = t.lang === DEFAULT_LANG ? OUT : join(OUT, t.lang);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderPage(t));
  console.log(`built ${join(dir, 'index.html')} (${site.offerStatus})`);
}

writeFileSync(join(OUT, '404.html'), render404());
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${absUrl('/sitemap.xml')}\n` : ''}`);
if (siteUrl) writeFileSync(join(OUT, 'sitemap.xml'), renderSitemap());
console.log('built 404.html, robots.txt' + (siteUrl ? ', sitemap.xml' : ''));
