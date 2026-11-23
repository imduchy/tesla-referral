// Generates the 1200×630 social share images in src/og/ (one per language).
// Needs Playwright: `node scripts/og-images.cjs`. Re-run when the km amount,
// the code or the og.* texts change, and commit the PNGs.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'site.json'), 'utf8'));
const fontUrl = 'file://' + path.join(root, 'src/fonts/inter-latin-wght-normal.woff2');
const fontExtUrl = 'file://' + path.join(root, 'src/fonts/inter-latin-ext-wght-normal.woff2');
// Embedded as a data URI: a page created with setContent can't load file:// images.
const photoUrl = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'src/img/photo-og-500.jpg')).toString('base64');
const domain = (site.siteUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function html(t) {
  const vars = { km: new Intl.NumberFormat(t.locale).format(site.superchargingKm), code: site.referralCode };
  const f = (s) => esc(s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; font-weight: 100 900; src: url(${fontExtUrl}) format("woff2"); unicode-range: U+0100-024F; }
@font-face { font-family: Inter; font-weight: 100 900; src: url(${fontUrl}) format("woff2"); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: Inter; color: #16181c;
  background: linear-gradient(180deg, #e9ebee 0%, #ffffff 85%);
  display: grid; grid-template-columns: 1fr 480px; }
.text { display: flex; flex-direction: column; justify-content: space-between; padding: 60px 48px 56px 72px; }
.photo { width: 480px; height: 630px; object-fit: cover; object-position: 40% 50%; display: block; }
.kicker { font-size: 26px; font-weight: 500; color: #62656b; }
h1 { font-size: 72px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.05; margin-top: 18px; }
.sub { font-size: 26px; color: #62656b; margin-top: 24px; }
.foot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 24px; color: #62656b; }
.domain { font-weight: 500; color: #16181c; }
.bolt { width: 56px; height: 56px; }
</style></head><body>
<div class="text">
<div><p class="kicker">${f(t.og.kicker)}</p><h1>${f(t.og.headline)}</h1><p class="sub">${f(t.og.sub)}</p></div>
<div class="foot"><span class="domain">${esc(domain)}</span>
<svg class="bolt" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#16181c"/><path d="M17.5 5 9 18h6l-1.5 9L22 14h-6z" fill="#fff"/></svg></div>
</div>
<img class="photo" src="${photoUrl}" alt="">
</body></html>`;
}

(async () => {
  const outDir = path.join(root, 'src/og');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const file of fs.readdirSync(path.join(root, 'content')).filter((n) => n.endsWith('.json'))) {
    const t = JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
    await page.setContent(html(t), { waitUntil: 'load' });
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode())); });
    const out = path.join(outDir, `og-${t.lang}.png`);
    await page.screenshot({ path: out });
    console.log('wrote', path.relative(root, out));
  }
  await browser.close();
})();
