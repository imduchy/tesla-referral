# Tesla EU referral program — research notes

_Researched: 2026-11-23. **Not verified against tesla.com directly**: Tesla's site (Akamai) blocks automated access from the research environment, so everything below comes from search-result snippets of Tesla pages plus third-party coverage. Re-check before publishing._

## Headline risk

- **US:** since **30 Oct 2026**, "purchases of new Tesla vehicles are no longer eligible for buyer and referrer benefits" — replaced by an FSD (Supervised) trial referral for existing owners. ([Tesla](https://www.tesla.com/support/refer-and-earn), [Electrek](https://electrek.co/2026/10/30/tesla-referral-program-fsd-car-rewards-dropped/))
- **Canada:** same change on **12 Nov 2026**. ([Tesla CA](https://www.tesla.com/en_ca/support/refer-and-earn))
- **Europe:** reported unchanged as of 4 Nov 2026 (third-party only, [teslablog.eu](https://teslablog.eu/referral/)); Switzerland reportedly still showing 1,000 km on 10 Nov. **Status after that is unknown — Europe may follow at any time.**

## Buyer Benefit (if the EU program is still live)

- **Model 3 and Model Y only**, new vehicles (custom order or new inventory). Used / Certified Pre-Owned excluded. Demo vehicles: unknown.
- **Free Supercharging distance, not a cash discount.** Amount is disputed:
  - 2,000 km — doubled from 1,000 km around 22–30 Apr 2026 ([Not a Tesla App](https://www.notateslaapp.com/news/4070/tesla-updates-referral-program-in-europe-increases-rewards), [Basenor](https://www.basenor.com/blogs/news/tesla-doubles-europe-referral-rewards-to-2-000-km-free-supercharging))
  - 1,000 km — reportedly reverted on 1 May 2026 (German blogs); most Sep–Nov 2026 listings say 1,000 km.
  - **Confirmed 1,000 km** — confirmed by the site owner on 2026-11-23 (Tesla still advertises 1,000 km in Europe).
- No per-country differences found within the EU. Model S/X removed from the program in 2026. Cybertruck not sold in the EU.

## Referrer Reward

- Same Supercharging distance (or Tesla Credits).
- **Annual Referral Cap: 10 per calendar year**, resets 1 January. If the Referrer is at the cap, the Buyer reportedly gets nothing.
- Rewards expire 12 months after the Grant Date (Supercharging credit is extendable up to 36 months with more referrals).

## Terms & conditions that matter for this site

- Link must be used **before ordering**; it cannot be added after an order is placed.
- Buyer must be 18+. Benefits are non-transferable, have no cash value, are valid only at Tesla-owned Superchargers, and end if the vehicle is sold.
- **Promotion rules** ([Tesla](https://www.tesla.com/support/referral-program)):
  - Not OK: commercializing, **advertising (paid ads)**, mass distribution, spam, **aggregating codes on deal sites**, selling links, **offering incentives** for using your link.
  - OK: YouTube, **information/fan sites**, your own social media.
  - Tesla can withhold benefits for bad-faith use.
- No explicit Tesla clause found on trademarks or logos or on keyword bidding. General trademark law still applies, so: no Tesla logo, a clear "not affiliated" disclaimer, and avoid "tesla" in the domain.
- Tesla can change or end the program at any time without notice.

## Link format

`https://ts.la/<name><digits>` redirects to `tesla.com/<locale>/referral/<name><digits>`. The market you order in decides the benefit. Use across EU countries is likely but unverified.

## To verify manually (in a browser or the Tesla app)

1. Re-check periodically that EU buyer benefits are still offered (US ended them 30 Oct 2026, Canada 12 Nov 2026).
2. Whether demo vehicles qualify.

## Verification against Tesla's own pages (2026-11-23)

tesla.com blocks automated page fetches, so these were checked through search-engine excerpts of tesla.com pages, not full page reads.

### Claims on the site and their Tesla source

| Claim on the site | Status | Tesla source |
| --- | --- | --- |
| Link must be used when ordering; can't be added afterwards | ✅ "Referral links cannot be applied after the order has been placed." | [Refer and Earn (IE)](https://www.tesla.com/en_ie/support/refer-and-earn) |
| Credit expires 12 months after it is granted | ✅ "expire 12 months from their respective Grant Dates" (referrer may extend to 36 months) | [Refer and Earn (IE)](https://www.tesla.com/en_ie/support/refer-and-earn) |
| Shows in the Tesla app, around delivery | ✅ "will appear as 'pending' in the Tesla app until the Grant Date" | [Refer and Earn (IE)](https://www.tesla.com/en_ie/support/refer-and-earn) |
| Only usable at Tesla-owned Superchargers | ✅ | [Terms](https://www.tesla.com/legal/terms), [Supercharging](https://www.tesla.com/support/charging/supercharging) |
| Not transferable, no cash value | ✅ "non-transferable or redeemable for cash" | [Refer and Earn (IE)](https://www.tesla.com/en_ie/support/refer-and-earn) |
| 10 referrals per calendar year; at the cap, buyers get nothing | ✅ "If you have reached your referrer benefits limit, buyers … will not receive any buyer benefits." | [Refer and Earn (IE)](https://www.tesla.com/en_ie/support/refer-and-earn) |
| Used / Certified Pre-Owned cars don't qualify | ✅ | [Loyalty Benefits (GB)](https://www.tesla.com/en_gb/support/refer-and-earn/loyalty) |
| Model 3 and Model Y only (not S/X) | ✅ by implication: Tesla's eligible products are Model 3, Model Y, Cybertruck and Solar Panels | [Refer and Earn](https://www.tesla.com/support/refer-and-earn) |
| Credit ends when the car is sold | ✅ | [Terms](https://www.tesla.com/legal/terms) |
| Buyer gets 1,000 km | ⚠️ Confirmed by the site owner on 2026-11-23; no Tesla page excerpt with the amount was found | — |
| Ordering from another European country | ⚠️ Not stated by Tesla; the site hedges ("check your order summary") | — |
| Demo cars | ⚠️ Not stated by Tesla; the site hedges | — |

### ⚠️ Status warning

The localized titles of Tesla's **global** page ([/support/refer-and-earn](https://www.tesla.com/support/refer-and-earn): "Empfehlen und Verdienen", "Refiere y gana", "Parrainez et gagnez", "Refereren en verdienen") carry the text "As of October 30, 2026, purchases of new Tesla vehicles are no longer eligible to receive buyer and referrer benefits." That global page is the US program. Country pages such as [en_IE](https://www.tesla.com/en_ie/support/refer-and-earn) still describe the vehicle referral rules. Re-check the local page or the Tesla app regularly, and switch `offerStatus` to `ended` as soon as Europe changes.

### Tesla's own wording per language

| Language | Program name on tesla.com | Terms Tesla uses | Site uses |
| --- | --- | --- | --- |
| EN | Refer and Earn | referral link, Supercharging, Tesla Credits | ✅ same |
| DE | Empfehlen und Verdienen | Empfehlungsprogramm, Weiterempfehlung, Supercharging, Supercharger-Gebühren | ✅ Empfehlungscode/-link, Supercharging. Tesla addresses customers with "Sie"; the site uses "du" on purpose (owner site) |
| ES | Refiere y gana | programa de referidos, Supercarga | ✅ same |
| FR | Parrainez et gagnez | programme de parrainage, lien de parrainage, Superchargeur, Supercharge | ✅ same |
| NL | Refereren en verdienen | referral link, Supercharging | ✅ referral/referrallink. The site writes "Superchargen" (verb), which is common Dutch usage |
| IT | (no Italian page found) | — | "codice referral", "Supercharging" follow the common Italian usage |
