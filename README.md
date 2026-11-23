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
| `termsUrl` | Tesla's official referral terms page |
| `goatcounterCode` | Your GoatCounter site code (e.g. `mysite` for `mysite.goatcounter.com`); empty disables analytics |
| `siteUrl` | Public URL, used for the canonical link (optional) |

All page text lives in **`content/en.json`**. To add a language, copy it to e.g. `content/sk.json`, set `"lang": "sk"` / `"locale": "sk-SK"` and translate — it builds to `/sk/`.

## Build

```bash
node build.mjs
```

Output goes to `dist/` (no dependencies). Pushing to `main` deploys to GitHub Pages via `.github/workflows/static.yml` (Settings → Pages → Source: GitHub Actions) and is served at https://teslareferralcode.eu.

## Rules we follow

Tesla allows sharing codes on owner/fan sites but forbids paid ads, posting codes on deal/aggregator sites, spam and offering extra incentives. The site uses no Tesla logos or imagery and states it is not affiliated with Tesla.

Inter font © The Inter Project Authors, SIL Open Font License 1.1 (`src/fonts/LICENSE-Inter.txt`).
