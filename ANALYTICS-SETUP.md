# Google Analytics setup — 1 October 2026

## Active properties

| Website | Account | Property | Measurement ID |
| --- | --- | --- | --- |
| goproject.com.pl | GOPROJECT — 410404796 | 557012053 | G-38PL1XHPN5 |
| antonyui.com | antonyui.com — 410333411 | 556918593 | G-21HKTHSJEH |

The old accounts `Test` (215589279) and `Default Account for Firebase` (213444451) were moved to Google's Bin and are recoverable for 35 days. They remain visible with crossed-out names until final deletion.

## GOPROJECT local changes

- `js/analytics.js` is included once on all 20 HTML pages containing a head element.
- Basic consent: no Google Analytics tag loads before acceptance or after refusal.
- Polish banner has equal accept/refuse actions and a Cookie settings control on the privacy page only; no persistent button on other pages (local change pending upload).
- Choice is remembered for 180 days. Withdrawal disables tracking, removes accessible GA cookies, and reloads if a tag was running.
- Only production hostnames `goproject.com.pl` and `www.goproject.com.pl` send analytics; local previews do not.
- `contact_click` records phone/email type without sending the address or phone number.
- `generate_lead` is sent after a successful server response on the home/contact forms, only with consent. It is marked as a key event in GA4; no monetary value was assigned.
- Enhanced measurement: page views, scrolls and downloads. Automatic outbound clicks, form interactions, site search and video events are disabled.
- The privacy page explains Google Analytics and consent withdrawal.

## Validation and outstanding work

Syntax and focused consent/event checks passed. Desktop browser check confirmed the banner, remembered refusal, reopening settings and remembered acceptance. Mobile viewport testing was unavailable in the current browser.

**Live homepage checked on 2026-10-01 after the user upload.** The homepage includes `/js/analytics.js` with measurement ID `G-38PL1XHPN5`, and the matching external Google tag is present after analytics consent. Other pages have not been checked live. GA4 Realtime verified later on 2026-10-01: 2 active users, 7 page views, and session/engagement/scroll events. A real successful enquiry still needs verification.

The user subsequently authorized portfolio updates. Its 13 production HTML pages now include `/assets/js/analytics.js` using `G-21HKTHSJEH`; old inline `G-E00KKWQY65` snippets were removed. Added `privacy.html`. Basic consent and footer settings use the same approach as GOPROJECT. Syntax, diff whitespace, focused consent checks, and browser checks for acceptance/refusal, remembered choice and reopening passed. Localhost does not load the external tag. Portfolio changes are local only: no commit, push, or live deployment performed. Existing unrelated staged/unstaged work and `manrope-preview/` were preserved.

No SEO-company access has been granted. The property owner can later grant access to the agency's named Google account. Limit it to the relevant property.

The user requested removal of portfolio Analytics: all production HTML tracking includes and the consent script were removed locally; privacy notice now states no analytics cookies. This removal has not been published.
