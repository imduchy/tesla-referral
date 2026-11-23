# Tesla Referral Code

Source of **[teslareferralcode.eu](https://teslareferralcode.eu)**, a small independent page where I share my Tesla referral code with people ordering a new Model 3 or Model Y in Europe. Available in English, German and Spanish.

It is a plain static site: HTML, CSS and a few lines of JavaScript, with no framework and no dependencies. A tiny build script turns the text files into pages, and GitHub Pages hosts them.

> Not affiliated with Tesla, Inc. Tesla, Model 3, Model Y and Supercharger are trademarks of Tesla, Inc.

## Project layout

```
site.json            Referral code, offer status, km amount, analytics, domain
content/<lang>.json  All page text, one file per language (en, de, es)
src/                 CSS, JS, fonts, favicon and generated images
build.mjs            Builds everything into dist/
scripts/             Image helpers (photo crops, social share images)
assets/              Source photo (not published)
docs/research/       Notes on the Tesla referral program and its terms
GLOSSARY.md          Terms used in this project
```

## Run it locally

Requires Node.js 18 or newer.

```bash
node build.mjs
```

```bash
python3 -m http.server -d dist 8000
```

Then open http://localhost:8000.

## Updating the offer

Everyday changes only touch `site.json`:

| Field | Meaning |
| --- | --- |
| `referralCode`, `referralUrl` | The code and its `ts.la` link |
| `offerStatus` | `active`, `ended` (Tesla paused buyer benefits) or `capReached` (yearly referral limit reached) |
| `offerCheckedOn` | Date the offer was last checked (`YYYY-MM-DD`). Drives the "Updated" line, the month in the page title and the sitemap |
| `superchargingKm` | Free Supercharging distance for the buyer |
| `termsUrl` | Fallback link to Tesla's referral terms (each language sets its own) |
| `goatcounterCode` | [GoatCounter](https://www.goatcounter.com) site code. Leave empty to disable analytics |
| `siteUrl` | Public URL, used for canonical links, hreflang and the sitemap |
| `photoCredit` | Photographer name and link shown under the photo (empty name = no credit line) |

Pushing to `main` deploys automatically via `.github/workflows/static.yml`, which afterwards notifies search engines through [IndexNow](https://www.indexnow.org) (`indexNowKey` in `site.json`; the key is public by design).

## Adding a language

Copy `content/en.json` to e.g. `content/fr.json`. Set `lang`, `locale`, `langName` and `termsUrl`, translate the text, then regenerate the share images (see below). The language switcher, hreflang tags and sitemap pick it up automatically.

## Images

Both scripts write their output to `src/`, and the results are committed:

- `python3 scripts/photo-crops.py` crops and compresses `assets/hero-source.jpg` into `src/img/`. Needs [Pillow](https://pypi.org/project/pillow/).
- `node scripts/og-images.cjs` renders the 1200×630 share image for each language into `src/og/`. Needs [Playwright](https://playwright.dev) with Chromium. Re-run it after changing the km amount, the code or the `og` texts.

## Want a page like this for your own code?

Fork the repo, put your code in `site.json`, adjust the texts, and enable GitHub Pages (**Settings → Pages → Source: GitHub Actions**). Please follow [Tesla's referral rules](https://www.tesla.com/support/referral-program). Sharing on your own site or social media is fine. Paid ads, spam, posting codes on deal or aggregator sites, and offering extra incentives for using your code are not allowed.

## License

The code is under the [MIT License](LICENSE). This does **not** cover:

- **The photo**, which is from [Unsplash](https://unsplash.com/photos/KSAG1EYQ2UY) under the [Unsplash License](https://unsplash.com/license).
- **The Inter font**, which is under the [SIL Open Font License](src/fonts/LICENSE-Inter.txt).
- **Tesla's trademarks.**

Issues and pull requests that fix bugs or translations are welcome.
