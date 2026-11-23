# Tesla Referral Code

A single static page offering a Tesla referral code to buyers in Europe. See [GLOSSARY.md](GLOSSARY.md) for the terms used, and [docs/research](docs/research/tesla-eu-referral-program.md) for the referral program research.

## Editing

Everyday changes only touch **`site.json`**:

| Field | Meaning |
| --- | --- |
| `referralCode`, `referralUrl` | Your code and `ts.la` link |
| `offerStatus` | `active`, `ended` (Tesla paused buyer benefits) or `capReached` (you hit the 10 referrals/year cap) |
| `offerCheckedOn` | Date you last checked the offer (`YYYY-MM-DD`), shown in the footer |
| `superchargingKm` | Free Supercharging distance for the buyer |
| `termsUrl` | Fallback link to Tesla's referral terms (each language can set its own) |
| `goatcounterCode` | Your GoatCounter site code (e.g. `mysite` for `mysite.goatcounter.com`); empty disables analytics |
| `siteUrl` | Public URL, used for the canonical link (optional) |

All page text lives in **`content/<lang>.json`** (`en` at `/`, `de` at `/de/`, `es` at `/es/`). To add a language, copy `content/en.json` to e.g. `content/sk.json`, set `lang`, `locale`, `langName` and `termsUrl`, translate, and run the share-image script below. The language switcher, hreflang tags and sitemap pick it up automatically.

When you re-check the offer, update `offerCheckedOn`: it drives the "Updated" line, the month in the page title and the sitemap `lastmod`.

### Share images

`src/og/og-<lang>.png` (1200×630) are generated from the `og` texts and committed. Re-run after changing the km amount, the code or those texts:

```bash
node scripts/og-images.cjs
```

(needs Playwright with Chromium installed).

## Build

```bash
node build.mjs
```

Output goes to `dist/` (no dependencies): one page per language, `404.html`, `robots.txt` and `sitemap.xml`. Pushing to `main` deploys to GitHub Pages via `.github/workflows/static.yml` (Settings → Pages → Source: GitHub Actions) and is served at https://teslareferralcode.eu.

## Rules we follow

Tesla allows sharing codes on owner/fan sites but forbids paid ads, posting codes on deal/aggregator sites, spam and offering extra incentives. The site uses no Tesla logos or imagery and states it is not affiliated with Tesla.

Inter font © The Inter Project Authors, SIL Open Font License 1.1 (`src/fonts/LICENSE-Inter.txt`).
