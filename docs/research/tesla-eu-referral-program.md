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
  - **Best guess: 1,000 km. Unverified.**
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

1. Does the EU `refer-and-earn` page (e.g. `tesla.com/de_DE/support/refer-and-earn`) still offer vehicle referral benefits?
2. Current km amount for Model 3 / Model Y.
3. Whether demo vehicles qualify.
