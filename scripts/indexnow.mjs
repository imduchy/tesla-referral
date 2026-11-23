// Tells IndexNow search engines (Bing, Yandex, Seznam, …) that the pages changed.
// Bing's index also feeds DuckDuckGo and Ecosia. Run after a deploy: `node scripts/indexnow.mjs`.
import { readFileSync, readdirSync } from 'node:fs';

const site = JSON.parse(readFileSync('site.json', 'utf8'));
const siteUrl = (site.siteUrl || '').replace(/\/$/, '');
if (!siteUrl || !site.indexNowKey) {
  console.log('IndexNow skipped: siteUrl or indexNowKey missing in site.json');
  process.exit(0);
}

const langs = readdirSync('content').filter((n) => n.endsWith('.json')).map((n) => n.replace('.json', ''));
const urlList = langs.map((l) => (l === 'en' ? `${siteUrl}/` : `${siteUrl}/${l}/`));

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(siteUrl).host,
    key: site.indexNowKey,
    keyLocation: `${siteUrl}/${site.indexNowKey}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.join(', ')}`);
// 200/202 = accepted. Never fail the deploy over this.
