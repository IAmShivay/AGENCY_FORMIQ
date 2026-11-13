# After publishing a blog post: step-by-step checklist

Site: **https://formiqstudio.in**. Blog URL pattern: `https://formiqstudio.in/blog/<slug>`.

The site already does a lot of this automatically:
- `app/sitemap.ts` adds every post to `https://formiqstudio.in/sitemap.xml`;
- `robots.txt` allows Google, Bing and AI crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.) and points to the sitemap;
- each post page outputs `BlogPosting` structured data;
- Google Search Console verification is set through `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

Your job after publishing is to **check it, submit it and promote it.**

---

## 0. One-time setup (do once, then skip)

1. **Google Search Console:** go to https://search.google.com/search-console, add a **Domain** property for `formiqstudio.in`, and verify it through DNS (GoDaddy → DNS → TXT record) or the existing meta tag.
2. **Submit the sitemap in GSC:** Indexing → Sitemaps → enter `sitemap.xml` → Submit. You only do this once; Google re-reads it regularly.
3. **Bing Webmaster Tools:** at https://www.bing.com/webmasters, choose **Import from Google Search Console** (fastest). Bing also feeds **ChatGPT search, Copilot and DuckDuckGo**, so don't skip it.
4. **Google Analytics 4** (not installed yet): create a GA4 property, then add the tag (ideally loaded only after cookie consent for EU visitors).
5. **Google Business Profile:** make sure the agency profile exists. Each post can be shared as a profile "Update" for local visibility.
6. **Monetag ads (optional):** follow `docs/MONETAG.md` to set up In-Page Push on blog articles only, behind cookie consent; they stay off until `NEXT_PUBLIC_MONETAG_ENABLED=true`.

---

## 1. Before you publish (about 5 minutes)

- [ ] **Title** is 50–60 characters, with the main keyword near the start.
- [ ] **Meta description** is 140–160 characters and gives a clear reason to click.
- [ ] **Slug** is short, lowercase and hyphenated, e.g. `/blog/shopify-cod-app-guide`. Never change it after publishing.
- [ ] **One H1** (the title), with H2/H3 subheadings in a logical order.
- [ ] **Featured image** is 1200×630 and compressed (WebP, under 200 KB), with descriptive **alt text** on every image.
- [ ] **Internal links:** 2–4 links to related posts and **at least one service page** (e.g. `/shopify`, `/web`, `/marketing`), plus a link back from an older related post to this one.
- [ ] **External links** go to 1–2 genuinely authoritative sources.
- [ ] **A call to action** at the end, linking to `/contact` or a relevant service.
- [ ] **Category and tags** are set; they feed the category and tag pages in the sitemap.
- [ ] **Author and date** are shown. Real expertise counts for Google's E-E-A-T.
- [ ] **No unverified claims** (stats, client names, awards), in line with the current positioning.

---

## 2. Right after publishing (about 10 minutes)

1. **Open the live URL** in a private window, on both phone and desktop. Check that images, links and layout are fine.
2. **Check the sitemap:** open `https://formiqstudio.in/sitemap.xml` and search for the new slug. If it's missing, redeploy or check that the post is set to *published*.
3. **Google Search Console → URL Inspection:**
   - paste the full post URL;
   - click **Test live URL** and confirm "URL is available to Google";
   - click **Request indexing**. There's a small daily quota, so use it only for new or updated posts.
4. **Bing Webmaster Tools → URL Submission:** paste the URL and **Submit**.
5. **Check the structured data:** run the URL through https://search.google.com/test/rich-results. It should detect **Article / BlogPosting** with no errors.
6. **Check the social previews** (this also refreshes their cache):
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - X/Twitter: paste the link into a draft post and check that the card image shows.
7. **Check page speed:** run the URL through https://pagespeed.web.dev, aiming for green Core Web Vitals on mobile.

---

## 3. Promote it (same day)

- [ ] **LinkedIn**, from both your profile and the Formiq page, as a native post with 3–5 key points. Put the link in the first comment, which usually gets more reach than a link in the post itself.
- [ ] **Google Business Profile:** add an "Update" with the image and link.
- [ ] **Email or WhatsApp** to relevant clients or prospects, only if it's genuinely useful to them.
- [ ] **Communities:** answer related questions on Quora, Shopify Community or relevant forums, linking only where it truly helps and disclosing that you're from Formiq.
- [ ] **Repurpose:** turn the post into a short reel or carousel (the reel templates are in `D:\PERSONAL\PROJECTS\REEL_TEMPLATES`).

---

## 4. After 7 days

- **GSC → URL Inspection:** is it **Indexed**? If not, check the coverage reason, improve internal links to the post, and request indexing again.
- **GSC → Performance → filter by the page:** see which **search queries** show it. Add those exact phrases as an FAQ or subheading if they're missing.

## 5. After 30 days

- **Update the post** with any query you rank for in positions 8–20 by adding a section for it. Change the post's updated date (it flows into the sitemap's `lastModified`), then **request indexing again**.
- **Add links to it** from newer posts.
- **Check leads:** did anyone reach `/contact` from this post (GA4 → Pages → path exploration)?

---

## 6. Monthly site health (15 minutes)

- GSC → **Pages**: fix "Not indexed" errors and any 404s.
- GSC → **Core Web Vitals** and **Enhancements**: fix any new issues.
- Bing → **Site Explorer**: crawl errors.
- Make sure the sitemap still submits with no errors.

---

## Optional improvements (ask Claude to add these)

- **IndexNow:** pings Bing, Yandex and Seznam the moment a post is published, which means faster indexing on Bing and ChatGPT search. One API route plus a key file.
- **GA4 with cookie consent:** proper analytics, GDPR-safe for EU and Dubai visitors.
- **RSS feed** (`/blog/rss.xml`): helps aggregators and newsletter tools pick up posts.
- **`llms.txt` update:** list the best posts so AI assistants cite them.
