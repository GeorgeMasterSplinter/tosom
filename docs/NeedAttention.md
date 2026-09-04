Issues need attention
21 open findings require attention

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** 14 tap targets too small (< 48px)
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Mobile Friendliness (`mobile-friendliness`)
**First seen:** 2026-09-03T21:40:15.825Z
**Last seen:** 2026-09-03T21:40:15.825Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
Found 14 interactive elements on https://tosom.no smaller than the 48px minimum.

## Analysis
The website https://tosom.no has 14 interactive elements that are smaller than the recommended minimum size of 48x48 pixels, which can lead to usability issues on mobile devices. This matters because small tap targets can frustrate users, potentially causing them to abandon the site, which negatively impacts engagement and conversion rates.

## Suggested fix
To resolve this issue, update the CSS for the identified elements to ensure they meet the minimum size requirement. For example, locate the following selectors in your CSS files and adjust their styles:

1. For `a.flex-shrink-0`, set `padding: 10px 20px;` to increase the tap target size.
2. For `a.underline.underline-offset-4`, set `padding: 10px 20px;`.
3. For `a.text-base.transition-all`, set `padding: 10px 20px;` for each instance.

Ensure that the total clickable area, including padding, reaches at least 48x48 pixels.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "count": 14,
 "pageUrl": "https://tosom.no",
 "examples": [
  {
   "size": "69x27px",
   "text": "Tosom",
   "selector": "a.flex-shrink-0"
  },
  {
   "size": "53x15px",
   "text": "Les mer",
   "selector": "a.underline.underline-offset-4"
  },
  {
   "size": "116x19px",
   "text": "Hvorfor Tosom",
   "selector": "a.text-base.transition-all"
  },
  {
   "size": "133x19px",
   "text": "Slik fungerer det",
   "selector": "a.text-base.transition-all"
  },
  {
   "size": "142x19px",
   "text": "Metoder vi bruker",
   "selector": "a.text-base.transition-all"
  }
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1tmq93da8zfpcotguw2fn`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `mobile-friendliness`
- Fingerprint: `mobile-friendly:small-tap-targets:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** 14 tap targets too small (< 48px)
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Mobile Friendliness (`mobile-friendliness`)
**First seen:** 2026-09-03T21:40:15.825Z
**Last seen:** 2026-09-03T21:40:15.825Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
Found 14 interactive elements on https://tosom.no smaller than the 48px minimum.

## Analysis
The website https://tosom.no has 14 interactive elements that are smaller than the recommended minimum size of 48x48 pixels, which can lead to usability issues on mobile devices. This matters because small tap targets can frustrate users, potentially causing them to abandon the site, which negatively impacts engagement and conversion rates.

## Suggested fix
To resolve this issue, update the CSS for the identified elements to ensure they meet the minimum size requirement. For example, locate the following selectors in your CSS files and adjust their styles:

1. For `a.flex-shrink-0`, set `padding: 10px 20px;` to increase the tap target size.
2. For `a.underline.underline-offset-4`, set `padding: 10px 20px;`.
3. For `a.text-base.transition-all`, set `padding: 10px 20px;` for each instance.

Ensure that the total clickable area, including padding, reaches at least 48x48 pixels.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "count": 14,
 "pageUrl": "https://tosom.no",
 "examples": [
  {
   "size": "69x27px",
   "text": "Tosom",
   "selector": "a.flex-shrink-0"
  },
  {
   "size": "53x15px",
   "text": "Les mer",
   "selector": "a.underline.underline-offset-4"
  },
  {
   "size": "116x19px",
   "text": "Hvorfor Tosom",
   "selector": "a.text-base.transition-all"
  },
  {
   "size": "133x19px",
   "text": "Slik fungerer det",
   "selector": "a.text-base.transition-all"
  },
  {
   "size": "142x19px",
   "text": "Metoder vi bruker",
   "selector": "a.text-base.transition-all"
  }
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1tmq93da8zfpcotguw2fn`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `mobile-friendliness`
- Fingerprint: `mobile-friendly:small-tap-targets:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Missing canonical URL
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Seo Meta Tags (`seo-meta-tags`)
**First seen:** 2026-09-03T21:38:51.291Z
**Last seen:** 2026-09-03T22:01:12.864Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
No canonical link element found.

## Analysis
The website is missing a canonical URL, which is essential for SEO as it helps search engines understand the preferred version of a page. This oversight could lead to duplicate content issues, negatively impacting search rankings and ultimately affecting website traffic and visibility.

## Suggested fix
To resolve this issue, add the following line within the  section of your HTML file for the target site: . This will inform search engines that the specified URL is the preferred version of the page.

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1rti33bfdzfpc2dyldyry`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `seo-meta-tags`
- Fingerprint: `seo:no-canonical:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Inconsistent AI crawler policy
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.293Z
**Last seen:** 2026-09-03T21:39:31.293Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
6 AI crawlers are blocked while 2 are allowed. An inconsistent policy means some AI systems can index your content while others cannot.

## Analysis
The website has an inconsistent policy regarding AI crawlers, allowing some while blocking others. This inconsistency can lead to missed opportunities for content visibility and engagement, potentially impacting traffic and revenue.

## Suggested fix
To resolve this issue, update the robots.txt file located at the root of the website. Choose a consistent policy: either allow all AI crawlers or block all of them. For example, to allow all AI crawlers, add the following lines: `User-agent: *` and `Allow: /`. If you prefer to block all, use `User-agent: *` and `Disallow: /`. Ensure to remove any conflicting rules for specific bots.

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sod93cbkzfpcakonipyh`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:ai-crawlers-inconsistent`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Inconsistent AI crawler policy
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.293Z
**Last seen:** 2026-09-03T21:39:31.293Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
6 AI crawlers are blocked while 2 are allowed. An inconsistent policy means some AI systems can index your content while others cannot.

## Analysis
The website has an inconsistent policy regarding AI crawlers, allowing some while blocking others. This inconsistency can lead to missed opportunities for content visibility and engagement, potentially impacting traffic and revenue.

## Suggested fix
To resolve this issue, update the robots.txt file located at the root of the website. Choose a consistent policy: either allow all AI crawlers or block all of them. For example, to allow all AI crawlers, add the following lines: `User-agent: *` and `Allow: /`. If you prefer to block all, use `User-agent: *` and `Disallow: /`. Ensure to remove any conflicting rules for specific bots.

## Raw evidence (JSON)
```json
{
 "allowed": [
  "Anthropic AI (anthropic-ai)",
  "Perplexity Bot (PerplexityBot)"
 ],
 "blocked": [
  "OpenAI GPTBot (GPTBot)",
  "Google AI (Gemini) (Google-Extended)",
  "Anthropic ClaudeBot (ClaudeBot)",
  "Common Crawl Bot (CCBot)",
  "ByteDance Bytespider (Bytespider)",
  "Apple AI (Applebot-Extended)"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sod93cbkzfpcakonipyh`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:ai-crawlers-inconsistent`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No JSON-LD structured data
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Seo Meta Tags (`seo-meta-tags`)
**First seen:** 2026-09-03T21:38:51.300Z
**Last seen:** 2026-09-03T22:01:12.873Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
No structured data (JSON-LD) found.

## Analysis
The website currently lacks JSON-LD structured data, which is essential for enhancing search engine visibility and enabling rich search results. This absence can lead to lower click-through rates and missed opportunities for attracting potential customers, ultimately impacting business growth.

## Suggested fix
To implement JSON-LD structured data, add the following script within the  section of your HTML file (e.g., index.html):

```html

{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tosom",
  "url": "https://tosom.no",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tosom.no/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

```

This code snippet provides basic structured data for your website, which can be expanded based on your content and offerings.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no"
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1rtic3bfezfpchm5nb4xi`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `seo-meta-tags`
- Fingerprint: `seo:no-jsonld:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Description too short (81 chars)
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Seo Meta Tags (`seo-meta-tags`)
**First seen:** 2026-09-03T21:38:51.265Z
**Last seen:** 2026-09-03T22:01:12.853Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
Description is 81 chars, recommended minimum 120.

## Analysis
The website's meta description is currently only 81 characters long, which is below the recommended minimum of 120 characters. This is important because a longer, more descriptive meta tag can improve search engine visibility and attract more visitors, ultimately impacting traffic and potential revenue.

## Suggested fix
Update the meta description in the HTML of the target site. Locate the `` tag in the `index.html` file or equivalent. Modify the content to ensure it is at least 120 characters long, providing a clear and engaging summary of the page's content.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no",
 "length": 81
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1rthc3bfczfpc7n7zarjn`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `seo-meta-tags`
- Fingerprint: `seo:desc-short:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Meta description too short for AI snippets
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.364Z
**Last seen:** 2026-09-03T21:39:31.364Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
Meta description is 81 characters. For optimal AI search snippet extraction, aim for 120-160 characters with a clear, keyword-rich summary.

## Analysis
The current meta description for this website is only 81 characters long, which is below the optimal range of 120-160 characters. This is important because a well-crafted meta description can improve visibility in search results and enhance click-through rates, ultimately impacting traffic and engagement on the site.

## Suggested fix
Update the meta description in the HTML of the target site. Locate the `` tag in the site's header section. Rewrite the content to be between 120-160 characters, ensuring it includes primary keywords relevant to the site's offerings and presents a compelling summary that can be easily extracted by AI for search snippets.

## Raw evidence (JSON)
```json
{
 "length": 81,
 "optimal": "120-160"
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sof83cbrzfpcyj6n1cdj`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:meta-desc-length`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Heading hierarchy has issues
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.352Z
**Last seen:** 2026-09-03T21:39:31.352Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
The page heading structure has 1 issue(s): Skipped heading level: H2 → H4 (near "Produkt"). A clear hierarchy helps AI crawlers understand content structure.

## Analysis
The heading structure on this website has a significant issue where it skips a level from H2 to H4. This matters because a clear heading hierarchy is crucial for search engines and AI crawlers to effectively understand the content, which can impact the site's visibility and ranking in search results.

## Suggested fix
To fix the heading hierarchy, locate the section of the HTML code where the heading 'Produkt' is defined. Change the H4 tag to an H3 tag to ensure a logical progression from H1 to H2 to H3. For example, if the current code is `Some TitleProdukt`, update it to `Some TitleProdukt`.

## Raw evidence (JSON)
```json
{
 "issues": [
  "Skipped heading level: H2 → H4 (near \"Produkt\")"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1soew3cbqzfpcj6wz3bn2`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:heading-hierarchy`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No sameAs knowledge graph links
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.333Z
**Last seen:** 2026-09-03T21:39:31.333Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No sameAs links found in structured data. These links connect your brand to Wikipedia, social profiles, and other knowledge graph entities — critical for AI search entity recognition.

## Analysis
The website currently lacks 'sameAs' links in its structured data, which are essential for enhancing visibility in AI-driven search results. This oversight could hinder the site's recognition and credibility, impacting potential traffic and engagement from search engines that utilize knowledge graphs.

## Suggested fix
To resolve this, update the Organization JSON-LD structured data in your website's code. Add a 'sameAs' array that includes URLs to your social media profiles, Wikipedia page, and other authoritative listings. For example: 

```json
"sameAs": [
  "https://www.facebook.com/yourprofile",
  "https://twitter.com/yourprofile",
  "https://www.linkedin.com/in/yourprofile",
  "https://en.wikipedia.org/wiki/Your_Brand"
]
``` 
Ensure this is placed within the existing JSON-LD script in your HTML.

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1soed3cbpzfpcydjmt6td`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:no-sameas`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No sameAs knowledge graph links
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.333Z
**Last seen:** 2026-09-03T21:39:31.333Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No sameAs links found in structured data. These links connect your brand to Wikipedia, social profiles, and other knowledge graph entities — critical for AI search entity recognition.

## Analysis
The website currently lacks 'sameAs' links in its structured data, which are essential for enhancing visibility in AI-driven search results. This oversight could hinder the site's recognition and credibility, impacting potential traffic and engagement from search engines that utilize knowledge graphs.

## Suggested fix
To resolve this, update the Organization JSON-LD structured data in your website's code. Add a 'sameAs' array that includes URLs to your social media profiles, Wikipedia page, and other authoritative listings. For example: 

```json
"sameAs": [
  "https://www.facebook.com/yourprofile",
  "https://twitter.com/yourprofile",
  "https://www.linkedin.com/in/yourprofile",
  "https://en.wikipedia.org/wiki/Your_Brand"
]
``` 
Ensure this is placed within the existing JSON-LD script in your HTML.

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1soed3cbpzfpcydjmt6td`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:no-sameas`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Missing WebSite structured data
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.317Z
**Last seen:** 2026-09-03T21:39:31.317Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No WebSite schema.org markup found. This website should have WebSite JSON-LD for rich results and AI search visibility.

## Analysis
The website is missing essential structured data markup (WebSite schema) that helps search engines understand its content better. This is important because without it, the site may miss out on rich search results, which can lead to lower visibility and traffic, ultimately impacting business growth.

## Suggested fix
To resolve this issue, add the following JSON-LD script to the  section of your website's HTML: 

```json

{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Website Name",
  "url": "https://tosom.no",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tosom.no/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

```

Make sure to replace "Your Website Name" with the actual name of your site.

## Raw evidence (JSON)
```json
{
 "siteType": "WEBSITE",
 "foundTypes": [],
 "expectedTypes": [
  "WebSite"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sodx3cbnzfpcz83n4do1`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:missing-schema:website`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Missing Article/BlogPosting structured data
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.310Z
**Last seen:** 2026-09-03T21:39:31.310Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No Article/BlogPosting schema.org markup found. This website should have Article or BlogPosting or NewsArticle JSON-LD for rich results and AI search visibility.

## Analysis
The website is missing important structured data for articles or blog posts, which is crucial for enhancing visibility in search engine results and improving engagement with potential visitors. Without this markup, the site may miss out on rich search results, leading to lower traffic and reduced business opportunities.

## Suggested fix
To resolve this issue, add the following JSON-LD script to the  section of your HTML on the target site:

```json

{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2023-10-01",
  "image": "https://tosom.no/path/to/image.jpg",
  "articleBody": "The main content of your article goes here."
}

```

Make sure to replace the placeholders with actual content relevant to your articles.

## Raw evidence (JSON)
```json
{
 "siteType": "WEBSITE",
 "foundTypes": [],
 "expectedTypes": [
  "Article",
  "BlogPosting",
  "NewsArticle"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sodq3cbmzfpc83c8cde5`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:missing-schema:article/blogposting`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Missing Organization structured data
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.302Z
**Last seen:** 2026-09-03T21:39:31.302Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No Organization schema.org markup found. This website should have Organization or LocalBusiness or Corporation JSON-LD for rich results and AI search visibility.

## Analysis
The website is missing important structured data that helps search engines understand its identity as an organization. This is crucial for improving visibility in search results and enhancing the chances of appearing in rich snippets, which can drive more traffic and engagement to the site.

## Suggested fix
To resolve this, add the following JSON-LD script to the  section of your website's HTML:

```json

{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Organization Name",
  "url": "https://tosom.no",
  "logo": "https://tosom.no/path/to/logo.png",
  "sameAs": [
    "https://www.facebook.com/yourprofile",
    "https://twitter.com/yourprofile"
  ]
}

``` 

Make sure to replace "Your Organization Name" and the URLs with your actual organization details.

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sodi3cblzfpcgiu86zr5`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:missing-schema:organization`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No llms-full.txt file found
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.275Z
**Last seen:** 2026-09-03T21:39:31.275Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
The site does not have a /llms-full.txt file. This extended file provides AI crawlers with comprehensive site content in a single document, improving indexing depth and accuracy.

## Analysis
The absence of a /llms-full.txt file on this website limits the ability of AI crawlers to effectively index and understand the site's content. This could hinder visibility in search results, ultimately impacting traffic and potential revenue. Addressing this issue is important for enhancing the site's SEO performance and ensuring it is fully optimized for AI-driven search technologies.

## Suggested fix
To resolve this issue, create a /llms-full.txt file in the root directory of your website. This file should include the complete content of your most important pages formatted in markdown. Ensure that it is accessible at https://tosom.no/llms-full.txt and contains comprehensive information that provides AI models with better context about your site.

## Affected items (1)
- https://tosom.no/llms-full.txt

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no/llms-full.txt"
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1socr3cbizfpctr43xsgf`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:no-llms-full-txt`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No llms.txt file found
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.262Z
**Last seen:** 2026-09-03T21:39:31.262Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
The site does not have a /llms.txt file. This file helps AI crawlers understand your site structure and content. Adopted by Anthropic, OpenAI, and other AI providers.

## Analysis
The absence of a /llms.txt file on this website means that AI crawlers may struggle to understand the site's structure and content, which can hinder visibility and indexing by AI-driven platforms. This could limit potential traffic and engagement from users who rely on AI for content discovery, ultimately affecting the site's reach and business opportunities.

## Suggested fix
Create a /llms.txt file at the root of your website. Follow the llmstxt.org specification by including a title, a brief description, and markdown links to your most important pages. For example:

```
# Title of Your Site

A brief description of what your site offers.

- [Homepage](https://tosom.no)
- [About Us](https://tosom.no/about)
- [Contact](https://tosom.no/contact)
```

Once created, ensure the file is accessible at https://tosom.no/llms.txt.

## Affected items (1)
- https://tosom.no/llms.txt

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no/llms.txt"
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1soce3cbhzfpcbawyxzdf`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:no-llms-txt`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Accessibility: Ensure the order of headings is semantically correct
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Accessibility Scan (`accessibility-scan`)
**First seen:** 2026-09-03T21:40:54.166Z
**Last seen:** 2026-09-03T22:03:23.658Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
1 element(s) affected on https://tosom.no. Impact: moderate.

## Analysis
The website has an accessibility issue with the order of headings, which can hinder users with disabilities from navigating the content effectively. This matters because it impacts user experience and may lead to non-compliance with accessibility standards, potentially affecting the website's reputation and reach.

## Suggested fix
To fix the heading order issue, change the heading tag from `` to `` for the affected element located at `div:nth-child(1) > h4`. This can be done by editing the HTML code in the relevant template file to ensure a proper semantic structure. The updated code should look like this: `Produkt`.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no",
 "pages": [
  "https://tosom.no"
 ],
 "impact": "moderate",
 "ruleId": "heading-order",
 "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/heading-order?application=axeAPI",
 "totalAffected": 1,
 "affectedElements": [
  {
   "html": "<h4 class=\"text-[10px] uppercase tracking-[0.2em] font-semibold mb-5\" style=\"color:rgba(212,175,55,0.55)\">Produkt</h4>",
   "selector": "div:nth-child(1) > h4"
  }
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1ugba3dd9zfpcwkh1hfsk`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `accessibility-scan`
- Fingerprint: `a11y:heading-order:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Missing Permissions-Policy header
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Security Headers (`security-headers`)
**First seen:** 2026-09-03T21:38:31.160Z
**Last seen:** 2026-09-04T02:01:02.820Z
**Detected 4x** (re-confirmed on every scan since first seen)

## Summary
The Permissions-Policy header is not present in the response.

## Analysis
The target site is missing a Permissions-Policy header, which is important for controlling which browser features can be accessed by the site. This omission can lead to potential security vulnerabilities, as it allows unauthorized access to sensitive features, impacting user privacy and trust.

## Suggested fix
To address this issue, add the following line to your web server configuration file (e.g., Nginx or Apache) to include the Permissions-Policy header:

For Nginx:
```
add_header Permissions-Policy "geolocation=(self), microphone=()";
```

For Apache:
```
Header set Permissions-Policy "geolocation=(self), microphone=()"
```

Adjust the features and origins as necessary based on your site's requirements.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no",
 "header": "permissions-policy",
 "present": false
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1rdyw3bd2zfpchnjz51t1`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `security-headers`
- Fingerprint: `security-headers:missing:permissions-policy`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** No accessibility statement (tilgjengelighetserklæring) found
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Legal Compliance No (`legal-compliance-no`)
**First seen:** 2026-09-03T21:39:51.297Z
**Last seen:** 2026-09-03T21:39:51.297Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No tilgjengelighetserklæring or uustatus.no link was found. Norwegian regulations (WCAG via likestillings- og diskrimineringsloven, enforced by Uu-tilsynet) require many organisations to publish one — public sector strictly, and requirements for private business are expanding under the EU Accessibility Act.

## Analysis
The target site does not have an accessibility statement, which is required by Norwegian regulations to ensure compliance with accessibility standards. This oversight could lead to legal repercussions and damage the organization's reputation, especially as regulations are tightening for private businesses under the EU Accessibility Act.

## Suggested fix
Create an accessibility statement (tilgjengelighetserklæring) and host it on uustatus.no. Once created, add a link to this statement in the footer of the target site. Use standard text: 'Tilgjengelighetserklæring' to ensure visibility and compliance.

## Affected items (5)
- https://tosom.no
- https://tosom.no/personvern
- https://tosom.no/vilkar
- https://tosom.no/om-oss
- https://tosom.no/kontakt

## Raw evidence (JSON)
```json
{
 "pages": [
  "https://tosom.no",
  "https://tosom.no/personvern",
  "https://tosom.no/vilkar",
  "https://tosom.no/om-oss",
  "https://tosom.no/kontakt"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1t3sx3cfazfpcp1o48772`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `legal-compliance-no`
- Fingerprint: `legal-no:a11y-statement:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Organisasjonsnummer not found on the site
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Legal Compliance No (`legal-compliance-no`)
**First seen:** 2026-09-03T21:39:51.288Z
**Last seen:** 2026-09-03T21:39:51.288Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
No valid Norwegian organisasjonsnummer was found on the homepage or 4 legal/contact pages. Ehandelsloven §8 requires commercial sites to display the org.nr and Foretaksregisteret affiliation — and its absence erodes customer trust.

## Analysis
The website is missing a valid Norwegian organisasjonsnummer, which is a legal requirement for commercial sites under Ehandelsloven §8. This absence can diminish customer trust and potentially lead to legal repercussions, impacting the business's reputation and operations.

## Suggested fix
To comply with legal requirements, add the organisasjonsnummer to the footer of the website or on the contact page. For example, include the following text: 'Org.nr: 123 456 789' and state 'Registered in Foretaksregisteret' to ensure transparency and build customer trust.

## Affected items (5)
- https://tosom.no
- https://tosom.no/personvern
- https://tosom.no/vilkar
- https://tosom.no/om-oss
- https://tosom.no/kontakt

## Raw evidence (JSON)
```json
{
 "pages": [
  "https://tosom.no",
  "https://tosom.no/personvern",
  "https://tosom.no/vilkar",
  "https://tosom.no/om-oss",
  "https://tosom.no/kontakt"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1t3so3cf9zfpc076k78j9`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `legal-compliance-no`
- Fingerprint: `legal-no:orgnr:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Compressed responses missing Vary: Accept-Encoding
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Compression Check (`compression-check`)
**First seen:** 2026-09-03T21:39:41.205Z
**Last seen:** 2026-09-03T22:11:03.237Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
Responses are compressed but lack Vary: Accept-Encoding. Shared caches may serve a compressed body to clients that did not ask for it (or vice versa).

## Analysis
The website is currently compressing responses, which is good for performance, but it is missing the 'Vary: Accept-Encoding' header. This is important because without it, shared caches may incorrectly serve compressed content to users who did not request it, potentially leading to display issues or errors. This could negatively impact user experience and site reliability, ultimately affecting customer satisfaction and retention.

## Suggested fix
To resolve this issue, update the server configuration to include the 'Vary: Accept-Encoding' header in the responses. If you are using Nginx, add the following line to your server block in the configuration file (usually located at /etc/nginx/nginx.conf or /etc/nginx/sites-available/default):

```
add_header Vary "Accept-Encoding";
```

For Apache, you can add the following line to your .htaccess file:

```
Header add Vary "Accept-Encoding"
```

After making these changes, restart your web server to apply the new configuration.

## Affected items (2)
- https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM
- https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM

## Raw evidence (JSON)
```json
{
 "count": 2,
 "pages": [
  "https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM",
  "https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sw0l3cd3zfpcenpiht11`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `compression-check`
- Fingerprint: `compression:vary:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Compressed responses missing Vary: Accept-Encoding
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Compression Check (`compression-check`)
**First seen:** 2026-09-03T21:39:41.205Z
**Last seen:** 2026-09-03T22:11:03.237Z
**Detected 2x** (re-confirmed on every scan since first seen)

## Summary
Responses are compressed but lack Vary: Accept-Encoding. Shared caches may serve a compressed body to clients that did not ask for it (or vice versa).

## Analysis
The website is currently compressing responses, which is good for performance, but it is missing the 'Vary: Accept-Encoding' header. This is important because without it, shared caches may incorrectly serve compressed content to users who did not request it, potentially leading to display issues or errors. This could negatively impact user experience and site reliability, ultimately affecting customer satisfaction and retention.

## Suggested fix
To resolve this issue, update the server configuration to include the 'Vary: Accept-Encoding' header in the responses. If you are using Nginx, add the following line to your server block in the configuration file (usually located at /etc/nginx/nginx.conf or /etc/nginx/sites-available/default):

```
add_header Vary "Accept-Encoding";
```

For Apache, you can add the following line to your .htaccess file:

```
Header add Vary "Accept-Encoding"
```

After making these changes, restart your web server to apply the new configuration.

## Affected items (2)
- https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM
- https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM

## Raw evidence (JSON)
```json
{
 "count": 2,
 "pages": [
  "https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM",
  "https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_9pgfcHCfh7Ym4pVNJ61zPv7wcTWM"
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1sw0l3cd3zfpcenpiht11`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `compression-check`
- Fingerprint: `compression:vary:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

Vi har samlet alle 21 Teste.no‑findings. Neste steg er å fikse tap‑targets, canonical, meta‑description, JSON‑LD, robots.txt, sameAs‑links, llms-full.txt og heading‑hierarki. Etter endringene kjører vi commit → CI → CD → Teste.no re‑scan for å verifisere at alt er grønt.»