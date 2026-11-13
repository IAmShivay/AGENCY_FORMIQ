# Monetag ads (blog articles only)

Monetag ads run **only on blog article pages** (`/blog/<slug>`), **only in the In-Page Push format**, and **only after the visitor gives advertising consent**. They are off by default.

## How it works

| Piece | File |
| --- | --- |
| Env parsing and validation (zod), allowed and excluded formats | `lib/ads/config.ts` |
| Route allow/deny check (articles only; never `/`, `/admin`, `/user`, `/employee`, `/manager`, `/login`, `/signup`, `/services`, `/contact`, `/quote`, blog index, category or tag pages) | `lib/ads/routes.ts` |
| Script injection, idle scheduling, cleanup | `lib/ads/inject.ts` |
| Client component mounted only on the article page | `app/(routes)/blog/components/BlogAds.tsx` |
| Consent storage (cookie `formiq_consent`, SameSite=Lax, 180 days, plus a localStorage mirror) | `lib/consent-storage.ts`, `lib/consent.ts` |
| `useConsent()` hook | `hooks/use-consent.ts` |
| Consent banner (existing, extended) and copy | `components/CookieConsent.tsx`, `lib/consent-copy.ts` |
| Site verification meta tag | `app/layout.tsx` (added only when the env value is set) |
| `ads.txt` (served only when the env value is set, 404 otherwise) | `app/ads.txt/route.ts` |
| Privacy policy "Advertising" section | `app/(routes)/privacy/page.tsx` (`#advertising`) |

The script loads only when **all** of these are true:

1. `NEXT_PUBLIC_MONETAG_ENABLED=true`;
2. `NEXT_PUBLIC_MONETAG_INPAGE_SRC` is a valid `https://` URL;
3. the visitor turned on "Blog advertising" or clicked "Accept advertising";
4. the current path is a blog article.

It is injected once per article view, after the page `load` event and when the browser is idle, so it stays off the critical rendering path. It is never added in the root layout.

### Consent

- Everyone (EU or not) is treated as **denied** until they choose. Nothing is pre-ticked and there is no cookie wall.
- The banner offers **Necessary only** and **Accept advertising** with the same styling, plus **Manage** for per-purpose choices (Meta Pixel ad measurement, and Monetag blog advertising when ads are enabled).
- The footer's **Cookie settings** link reopens the banner to change the choice at any time.
- The choice is stored as `{ version, measurement, advertising, updatedAt }`. Bumping `CONSENT_VERSION` in `lib/tracking-config.ts` re-asks everyone. If ads are turned on later, visitors who were never asked about advertising are asked again.
- **Withdrawing consent:** the script element is removed straight away, and no ads load from the next page load on. A script that has already run cannot be unloaded from memory on the current page, so ads it has already shown may stay until the visitor navigates or refreshes.
- The consent version moved from 1 to 2 in this change, so every returning visitor sees the banner once more.

### Content-Security-Policy

The project currently sends **no** CSP header (neither `next.config.js` nor `middleware.ts` sets one), so nothing needs to change. If a CSP is added later, allow `MONETAG_CONFIG.origin` (the origin of `NEXT_PUBLIC_MONETAG_INPAGE_SRC`, derived at build time) in `script-src`, ideally only for `/blog/:slug`. In-Page Push then loads creatives and tracking from other ad domains as well, so check the browser console for blocked requests and widen `img-src`, `connect-src` and `frame-src` only as needed.

## Excluded formats

Only **In-Page Push** is used. These are deliberately **not** implemented:

- **OnClick / Popunder:** opens new windows on click, hijacks navigation;
- **Interstitial and Vignette Banner:** full-screen overlays that cover the article;
- **Direct Link / SmartLink:** sends visitors off-site;
- **MultiTag:** bundles several formats, including the ones above;
- **Push Notifications:** asks for browser notification permission and needs a `sw.js` service worker at the site root.

They hurt trust with the EU and Dubai clients the site is aimed at, damage Core Web Vitals, and compete with the contact call to action. Do not paste their tags into this project.

## Setup in the Monetag dashboard

1. Sign up as a publisher at https://monetag.com and complete any KYC checks Monetag asks for.
2. **Websites → Add website**, then enter `formiqstudio.in`.
3. Verify the site. Choose the **meta tag** method (do **not** use the `sw.js` file method; it installs a push service worker). Copy only the `content="..."` value of the tag into `NEXT_PUBLIC_MONETAG_SITE_VERIFICATION`, redeploy, then click **Verify**.
   - The code writes `<meta name="monetag" content="...">`. **Not confirmed:** Monetag's help page does not show the exact tag. If the tag the dashboard gives you uses a different `name`, change `MONETAG_VERIFICATION_META_NAME` in `lib/ads/config.ts`.
4. **Add Zone → In-Page Push (Banner) → Get tag.**
5. From the tag, take the full script URL and put it in `NEXT_PUBLIC_MONETAG_INPAGE_SRC`:
   - if the tag is `<script src="https://<domain>/<path>" data-zone="1234567" ...>`, use the `src` value, and put the `data-zone` number in `NEXT_PUBLIC_MONETAG_INPAGE_ZONE`;
   - if the tag is an inline snippet that builds the URL (for example `s.src='https://'+d+'/400/'+z` called with a domain and a zone number), write the finished URL out, e.g. `https://<domain>/400/<zone>`, and leave the zone variable empty.
   - The domain is different for each account. Never hardcode it; it lives only in env.
   - **Not confirmed:** the exact tag shape. Monetag's help article shows it only in screenshots.
6. If the dashboard asks for an `ads.txt` line, put it in `MONETAG_ADS_TXT` (server-only). Separate several lines with real newlines or `\n`. It is served at `https://formiqstudio.in/ads.txt`. **Not confirmed:** Monetag's help centre has no ads.txt article, so only add it if the dashboard shows a line.
7. Set `NEXT_PUBLIC_MONETAG_ENABLED=true` and redeploy. `NEXT_PUBLIC_*` values are baked in at build time.
8. Open a blog article, click **Accept advertising** in the cookie banner, then run Monetag's **Installation Check**. The check fails if consent has not been given, because the script never loads without it.
   - Monetag advises putting the tag high in `<head>`. This site loads it after consent and once the page is idle instead, which is required for GDPR and protects Core Web Vitals. Ad fill may be slightly lower as a result.

## Env variables

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_MONETAG_ENABLED` | `true` | Anything else, or unset, means off. |
| `NEXT_PUBLIC_MONETAG_INPAGE_SRC` | `https://<account-domain>/400/<zone>` | Must be `https://`; invalid values are ignored. |
| `NEXT_PUBLIC_MONETAG_INPAGE_ZONE` | `1234567` | Optional, digits only; set as `data-zone`. |
| `NEXT_PUBLIC_MONETAG_SITE_VERIFICATION` | `abc123...` | The meta tag's `content` value only. |
| `MONETAG_ADS_TXT` | `example.com, 123, DIRECT` | Optional, server-only. |

## Turning it off

Set `NEXT_PUBLIC_MONETAG_ENABLED=false` (or remove it) and redeploy. The script stops loading everywhere, and the advertising option disappears from the banner. You can leave the verification and `ads.txt` values in place.

## After enabling

- Watch **blog-to-contact conversions** (blog visits that go on to `/contact`, WhatsApp, email or bookings) for the next 2–4 weeks. If they drop, the ad revenue is probably not worth it, so turn ads off.
- Watch **Core Web Vitals** (LCP, INP, CLS) for `/blog/*` in Search Console and PageSpeed Insights.
- Check that no ads appear on any non-article page.

## Facts and sources

Checked on 2026-11-13:

- In-Page Push goes in `<head>`, needs no subscription, and shows as a banner (top-right on desktop, top on mobile): https://help.monetag.com/en/articles/6959534-in-page-push-ipp and https://help.monetag.com/en/articles/6726318-how-do-i-get-started-as-a-publisher-paste-the-ad-tag-into-your-website
- Push Notifications and MultiTag need a file uploaded to the site root: same article.
- Site verification is by the `sw.js` file, a meta tag in `<head>`, or the WordPress plugin: https://help.monetag.com/en/articles/6726312-how-do-i-get-started-as-a-publisher-add-and-verify-your-website-s
- Zone creation (**Add Zone → In-Page Push (Banner) → Get tag**): https://help.monetag.com/en/articles/6726314-how-do-i-get-started-as-a-publisher-creating-ad-zones
- Privacy policy: https://monetag.com/privacy/. Monetag is operated by Propeller Ads Ltd (Cyprus) and its group companies. The ad-serving data it lists is the page URL, referrer, IP address, country or region, browser and OS. Cookies are covered by its separate cookie policy.
