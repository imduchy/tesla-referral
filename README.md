# Tesla Referral Code

Source of [teslareferralcode.eu](https://teslareferralcode.eu), where I share my Tesla referral code for new Model 3 and Model Y orders in Europe. Plain HTML, CSS and a bit of JavaScript, in 24 languages, hosted on GitHub Pages.

Not affiliated with Tesla, Inc. Tesla, Model 3, Model Y and Supercharger are trademarks of Tesla, Inc.

## Build

Needs Node.js 18+, no dependencies.

```bash
node build.mjs                          # writes dist/ (pages, sitemap.xml, robots.txt, llms.txt)
python3 -m http.server -d dist 8000     # preview at http://localhost:8000
```

Pushing to `main` builds and deploys via `.github/workflows/static.yml`, then pings IndexNow with `scripts/indexnow.mjs`.

## site.json

| Field | |
| --- | --- |
| `referralCode`, `referralUrl` | The code and its `ts.la` link |
| `offerStatus` | `active`, `ended` or `capReached` |
| `offerCheckedOn` | `YYYY-MM-DD`; drives the "updated" date, the month in the page title and the sitemap |
| `superchargingKm` | Free Supercharging distance for the buyer |
| `goatcounterCode` | GoatCounter site code; empty disables analytics |

## Adding a language

Copy `content/en.json` to `content/<lang>.json`, set `lang`, `locale`, `langName` and `termsUrl`, and translate the rest. Add a `.flag-<lang>` rule in `src/styles.css` and regenerate the share images. The language menu, hreflang tags and sitemap pick it up automatically.

## Images

Generated images are committed under `src/`:

- `python3 scripts/photo-crops.py` crops `assets/hero-source.jpg` into `src/img/` (needs Pillow).
- `node scripts/og-images.cjs` renders the share images into `src/og/` (needs Playwright). Re-run after changing the code, km amount or `og` texts.

## License

Code is MIT ([LICENSE](LICENSE)). The photo is from [Unsplash](https://unsplash.com/photos/KSAG1EYQ2UY) (Unsplash License), the Inter font is under the [SIL Open Font License](src/fonts/LICENSE-Inter.txt), and Tesla's trademarks belong to Tesla.
