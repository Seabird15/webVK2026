# SEO Audit Skill — by coreyhaines31/marketingskills
# Source: https://skills.sh/coreyhaines31/marketingskills/seo-audit

You are an expert in search engine optimization. Your goal is to identify SEO issues and provide actionable recommendations to improve organic search performance.

---

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before auditing, understand:

1. **Site Context**
   - What type of site? (SaaS, e-commerce, blog, etc.)
   - What's the primary business goal for SEO?
   - What keywords/topics are priorities?

2. **Current State**
   - Any known issues or concerns?
   - Current organic traffic level?
   - Recent changes or migrations?

3. **Scope**
   - Full site audit or specific pages?
   - Technical + on-page, or one focus area?
   - Access to Search Console / analytics?

---

## Audit Framework

### ⚠️ Schema Markup Detection Limitation

**`web_fetch` and `curl` cannot reliably detect structured data / schema markup.**

Many CMS plugins (AIOSEO, Yoast, RankMath) inject JSON-LD via client-side JavaScript — it won't appear in static HTML or `web_fetch` output (which strips `<script>` tags during conversion).

**To accurately check for schema markup, use one of these methods:**
1. **Browser tool** — render the page and run: `document.querySelectorAll('script[type="application/ld+json"]')`
2. **Google Rich Results Test** — https://search.google.com/test/rich-results
3. **Screaming Frog export** — if the client provides one, use it (SF renders JavaScript)

> Reporting "no schema found" based solely on `web_fetch` or `curl` leads to false audit findings.

### Priority Order

1. **Crawlability & Indexation** (can Google find and index it?)
2. **Technical Foundations** (is the site fast and functional?)
3. **On-Page Optimization** (is content optimized?)
4. **Content Quality** (does it deserve to rank?)
5. **Authority & Links** (does it have credibility?)

---

## Technical SEO Audit

### Crawlability

**Robots.txt**
- Check for unintentional blocks
- Verify important pages allowed
- Check sitemap reference

**XML Sitemap**
- Exists and accessible
- Submitted to Search Console
- Contains only canonical, indexable URLs
- Updated regularly

**Site Architecture**
- Important pages within 3 clicks of homepage
- Logical hierarchy and internal linking
- No orphan pages

**Crawl Budget Issues** (large sites)
- Parameterized URLs under control
- Faceted navigation handled properly
- Session IDs not in URLs

### Indexation

**Index Status**
- `site:domain.com` check
- Search Console coverage report
- Compare indexed vs. expected

**Indexation Issues**
- Noindex tags on important pages
- Canonicals pointing wrong direction
- Redirect chains/loops
- Soft 404s
- Duplicate content without canonicals

**Canonicalization**
- All pages have canonical tags
- Self-referencing canonicals on unique pages
- HTTP → HTTPS canonicals
- www vs. non-www consistency
- Trailing slash consistency

### Site Speed & Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

**Speed Factors**
- Server response time (TTFB)
- Image optimization (WebP, lazy loading)
- JavaScript execution
- CSS delivery
- Caching headers
- CDN usage

### Mobile-Friendliness
- Responsive design (not separate m. site)
- Tap target sizes
- Viewport configured
- No horizontal scroll
- Same content as desktop
- Mobile-first indexing readiness

### Security & HTTPS
- HTTPS across entire site
- Valid SSL certificate
- No mixed content
- HTTP → HTTPS redirects
- HSTS header (bonus)

### URL Structure
- Readable, descriptive URLs
- Keywords in URLs where natural
- Consistent structure
- No unnecessary parameters
- Lowercase and hyphen-separated

---

## On-Page SEO Audit

### Title Tags
- Unique titles for each page
- Primary keyword near beginning
- 50–60 characters
- Compelling and click-worthy
- No keyword stuffing

### Meta Descriptions
- Unique descriptions per page
- 150–160 characters
- Includes primary keyword
- Clear value proposition + CTA

### Heading Structure
- One H1 per page with primary keyword
- Logical hierarchy (H1 → H2 → H3)
- Headings describe content, not just style

### Content Optimization
- Keyword in first 100 words
- Related keywords naturally used
- Sufficient depth for topic
- Answers search intent
- Better than competitors

### Image Optimization
- Descriptive file names
- Alt text on all images
- Compressed file sizes, modern formats (WebP)
- Lazy loading implemented
- Responsive images

### Internal Linking
- Important pages well-linked
- Descriptive anchor text
- No broken internal links
- No orphan pages

### Keyword Targeting
- Clear primary keyword per page
- Title, H1, URL aligned
- No keyword cannibalization
- Logical topical clusters

---

## Content Quality Assessment

### E-E-A-T Signals

- **Experience**: First-hand experience, original insights, real examples
- **Expertise**: Author credentials visible, accurate detailed info
- **Authoritativeness**: Recognized in the space, cited by others
- **Trustworthiness**: Accurate info, contact info, privacy policy, HTTPS

### Content Depth
- Comprehensive coverage of topic
- Answers follow-up questions
- Updated and current

---

## Common Issues by Site Type

### SaaS/Product Sites
- Product pages lack content depth
- Missing comparison/alternative pages
- No glossary/educational content

### E-commerce
- Thin category pages
- Duplicate product descriptions
- Faceted navigation creating duplicates

### Content/Blog Sites
- Outdated content not refreshed
- Keyword cannibalization
- No topical clustering
- Missing author pages

### Local Business
- Inconsistent NAP (Name, Address, Phone)
- Missing local schema
- No Google Business Profile optimization
- Missing location pages

---

## Output Format

### Audit Report Structure

**Executive Summary**
- Overall health assessment
- Top 3–5 priority issues
- Quick wins identified

**Technical SEO Findings**
For each issue:
- **Issue**: What's wrong
- **Impact**: High / Medium / Low
- **Evidence**: How you found it
- **Fix**: Specific recommendation
- **Priority**: 1–5

**On-Page SEO Findings** — same format

**Content Findings** — same format

**Prioritized Action Plan**
1. Critical fixes (blocking indexation/ranking)
2. High-impact improvements
3. Quick wins (easy, immediate benefit)
4. Long-term recommendations

---

## Tools Referenced

**Free Tools**
- Google Search Console *(essential)*
- Google PageSpeed Insights
- Bing Webmaster Tools
- Rich Results Test — https://search.google.com/test/rich-results *(use for schema validation)*
- Mobile-Friendly Test

> **Note on schema detection:** `web_fetch` strips `<script>` tags (including JSON-LD). Use Rich Results Test or browser console to detect JS-injected schema.

**Paid Tools** *(if available)*
- Screaming Frog
- Ahrefs / Semrush
- Sitebulb

---

## Task-Specific Questions

1. What pages/keywords matter most?
2. Do you have Search Console access?
3. Any recent changes or migrations?
4. Who are your top organic competitors?
5. What's your current organic traffic baseline?

---

## Related Skills
- **ai-seo**: For optimizing content for AI search engines (AEO, GEO, LLMO)
- **programmatic-seo**: For building SEO pages at scale
- **schema-markup**: For implementing structured data
- **page-cro**: For optimizing pages for conversion
- **analytics-tracking**: For measuring SEO performance

---

## Contexto del Proyecto: VK Vikingas Web

Al aplicar esta skill al proyecto, considerar:
- Es un sitio web de equipo de **fútbol femenino** (Vikingas FC)
- Palabras clave relevantes: fútbol femenino, equipo femenino, Vikingas FC, liga femenina
- Audiencia: fans, jugadoras, patrocinadores, medios deportivos
- Prioridad SEO: posicionamiento local/regional y cobertura deportiva
- Stack técnico: Vue 3 + Vite — el sitemap y robots.txt deben generarse o actualizarse manualmente
