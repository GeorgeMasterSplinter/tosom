# Website issue detected by Teste.no (website monitoring platform)

**Finding:** INP needs improvement: 384ms
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Core Web Vitals (`core-web-vitals`)
**First seen:** 2026-09-06T15:17:11.148Z
**Last seen:** 2026-09-06T15:17:11.148Z
**Detected 1x** (re-confirmed on every scan since first seen)

## Summary
Interaction to Next Paint on https://tosom.no is 384ms (good: <200ms).

## Analysis
The Interaction to Next Paint (INP) metric for this website is currently at 384ms, which exceeds the ideal threshold of 200ms. This delay can lead to a frustrating user experience, potentially causing visitors to leave the site, which can negatively impact engagement and conversions.

## Suggested fix
To improve the INP score, review and optimize the JavaScript event handlers in your code. Specifically, check the main-thread blocking scripts in the 'main.js' file and ensure that any long-running tasks are broken into smaller, asynchronous operations. Additionally, consider deferring non-essential scripts and using 'requestIdleCallback' for less critical tasks to enhance responsiveness.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "inp": 384,
 "pageUrl": "https://tosom.no",
 "threshold": 200
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtpygjn0vzhrzfpc9q7xw711`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `core-web-vitals`
- Fingerprint: `cwv:inp-needs-improvement:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.
# Website issue detected by Teste.no (website monitoring platform)

**Finding:** Compressed responses missing Vary: Accept-Encoding
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Compression Check (`compression-check`)
**First seen:** 2026-09-03T21:39:41.205Z
**Last seen:** 2026-09-06T15:15:30.270Z
**Detected 6x** (re-confirmed on every scan since first seen)

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
- https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_6cb9BZjhpgeCG9JFNsNTMLv4yCCk
- https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_6cb9BZjhpgeCG9JFNsNTMLv4yCCk

## Raw evidence (JSON)
```json
{
 "count": 2,
 "pages": [
  "https://tosom.no/_next/static/chunks/5d015edf-9c43547a96334e31.js?dpl=dpl_6cb9BZjhpgeCG9JFNsNTMLv4yCCk",
  "https://tosom.no/_next/static/chunks/app/not-found-b93a64be66924d99.js?dpl=dpl_6cb9BZjhpgeCG9JFNsNTMLv4yCCk"
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

**Finding:** Inconsistent AI crawler policy
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.293Z
**Last seen:** 2026-09-06T15:16:30.649Z
**Detected 3x** (re-confirmed on every scan since first seen)

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

**Finding:** 3 AI crawler(s) blocked by server (HTTP 403)
**Severity:** WARNING — status OPEN
**Website:** tosom.no
**Detected by test:** Ai Search Readiness (`ai-search-readiness`)
**First seen:** 2026-09-03T21:39:31.283Z
**Last seen:** 2026-09-06T15:16:30.599Z
**Detected 3x** (re-confirmed on every scan since first seen)

## Summary
GPTBot, ClaudeBot, PerplexityBot received HTTP 403 Forbidden when requesting the site. This is different from robots.txt — a proxy, WAF, or server config is actively blocking these bots. Your content is invisible to these AI systems regardless of your robots.txt policy.

## Analysis
The website is currently blocking important AI crawlers (GPTBot, ClaudeBot, PerplexityBot) from accessing its content, resulting in a 403 Forbidden error. This is critical because it prevents potential customers from discovering your offerings through AI-driven search tools, which could significantly impact your visibility and traffic.

## Suggested fix
Review the configuration of your reverse proxy or Web Application Firewall (WAF) to ensure that the user agents for GPTBot, ClaudeBot, and PerplexityBot are allowed access. Specifically, update the WAF rules or proxy settings to permit these user agents, similar to how Googlebot is treated. This may involve modifying settings in your WAF configuration file or adjusting rules in your hosting provider's control panel.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "url": "https://tosom.no",
 "blocked": [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot"
 ],
 "accessible": []
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1socz3cbjzfpcn6y6xras`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `ai-search-readiness`
- Fingerprint: `ai-ready:ai-crawlers-http-blocked`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.

# Website issue detected by Teste.no (website monitoring platform)

**Finding:** 4 text elements below 12px
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Mobile Friendliness (`mobile-friendliness`)
**First seen:** 2026-09-03T21:40:15.833Z
**Last seen:** 2026-09-06T15:17:26.407Z
**Detected 4x** (re-confirmed on every scan since first seen)

## Summary
Found 4 text elements on https://tosom.no with font size smaller than 12px.

## Analysis
There are four text elements on the website with a font size smaller than 12px, which can negatively impact readability on mobile devices. This issue is important because it can lead to a poor user experience, potentially driving away visitors and affecting engagement and conversions.

## Suggested fix
To resolve this issue, update the CSS for the identified text elements to ensure a minimum font size of 12px. Locate the relevant CSS file and add the following styles:

```css
span {
    font-size: 12px;
}
h4 {
    font-size: 12px;
}
```

Make sure to test the changes on mobile devices to confirm improved readability.

## Affected items (1)
- https://tosom.no

## Raw evidence (JSON)
```json
{
 "count": 4,
 "pageUrl": "https://tosom.no",
 "examples": [
  {
   "text": "Made in Norway",
   "fontSize": "10px",
   "selector": "span"
  },
  {
   "text": "Produkt",
   "fontSize": "10px",
   "selector": "h2"
  },
  {
   "text": "Regler",
   "fontSize": "10px",
   "selector": "h2"
  },
  {
   "text": "Om Tosom",
   "fontSize": "10px",
   "selector": "h2"
  }
 ]
}
```

## Machine references (Teste.no MCP)
- Finding ID: `cmtm1tmqh3da9zfpckb5zx1eq`
- Target ID: `cmtm1rbrz000mz4pc6x41cusl`
- Test slug: `mobile-friendliness`
- Fingerprint: `mobile-friendly:small-fonts:https://tosom.no`

If a Teste.no MCP server is connected: call `get_finding` with the finding ID above for live details and full evidence. After implementing a fix, call `trigger_test` with the test slug + target ID, then check `list_runs` to verify the issue is resolved.

Task: investigate this issue on the website, implement a fix, and verify it.
# Website issue detected by Teste.no (website monitoring platform)

**Finding:** 2 tap targets too small (< 48px)
**Severity:** INFO — status OPEN
**Website:** tosom.no
**Detected by test:** Mobile Friendliness (`mobile-friendliness`)
**First seen:** 2026-09-03T21:40:15.825Z
**Last seen:** 2026-09-06T15:17:26.389Z
**Detected 4x** (re-confirmed on every scan since first seen)

## Summary
Found 2 interactive elements on https://tosom.no smaller than the 48px minimum.

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
 "count": 2,
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