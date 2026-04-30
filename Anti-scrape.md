# Complete Anti-AI Scraping & Training Prevention System

**Last Updated:** April 29, 2026  
**Purpose:** Maximum protection against AI crawlers, scrapers, and unauthorized data collection

This document provides comprehensive, multi-layered defense against AI companies scraping your content for training data. Implement ALL layers for maximum protection.

---

## LAYER 1: robots.txt (Complete AI Crawler Blocking)

Place this at `/robots.txt`:

```txt
# Block ALL AI crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GoogleOther
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Scrapy
Disallow: /

User-agent: python-requests
Disallow: /

User-agent: curl
Disallow: /

User-agent: wget
Disallow: /

User-agent: puppeteer
Disallow: /

User-agent: playwright
Disallow: /

User-agent: selenium
Disallow: /

# Legitimate search engines (ALLOWED)
User-agent: Googlebot
Disallow:

User-agent: Bingbot
Disallow:

Crawl-delay: 10
```


---

## LAYER 2: HTML Meta Tags

Add to every page `<head>`:

```html
<meta name="robots" content="noai, noimageai">
<meta name="robots" content="max-image-preview:none">
<meta name="openai" content="noindex, nofollow">
<meta name="anthropic" content="noindex, nofollow">
<meta name="google-extended" content="noindex">
<meta http-equiv="Cache-Control" content="no-cache, no-store">
```

---

## LAYER 3: Server Headers

### Nginx:
```nginx
location / {
    add_header X-Robots-Tag "noai, noimageai, noarchive" always;
    
    if ($http_user_agent ~* (GPTBot|ChatGPT|CCBot|anthropic|Claude|Google-Extended|PerplexityBot|Scrapy|python|curl|wget|puppeteer|playwright|selenium)) {
        return 403;
    }
    
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/m;
    limit_req zone=general burst=20;
}
```

### Apache (.htaccess):
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ChatGPT|CCBot|anthropic|Claude|Google-Extended|Scrapy|python-requests|curl|wget|puppeteer|playwright|selenium) [NC]
RewriteRule .* - [F,L]
</IfModule>

<IfModule mod_headers.c>
Header set X-Robots-Tag "noai, noimageai, noarchive"
</IfModule>
```


---

## LAYER 4: Legal Terms of Service

Add this to your Terms of Service:

```markdown
## AI TRAINING & SCRAPING PROHIBITION

### Absolute Prohibition
ALL content on this Service is STRICTLY PROHIBITED from being used for:
- Training AI systems, machine learning models, or LLMs
- Creating training datasets or benchmarks
- Fine-tuning or adapting pre-trained models
- Automated data collection, scraping, or crawling

### Prohibited Activities
You may NOT:
- Use robots, spiders, scrapers, or automated tools
- Systematically retrieve data through automated queries
- Use headless browsers or automation tools (Puppeteer, Playwright, Selenium)
- Mirror, replicate, or create derivative databases
- Exceed 10 requests per minute per IP address

### Enforcement
Upon detection of prohibited activity, we will:
- Immediately terminate access without notice
- Permanently ban IP addresses
- Report violations to ISP and law enforcement
- Pursue civil and criminal remedies
- Seek injunctive relief and statutory damages

### Liquidated Damages
You agree to liquidated damages of:
- $100,000 USD per incident of automated data collection
- $50,000 USD per AI model trained using our content
- $25,000 USD per day of continued violation

### Monitoring
We actively monitor through:
- User-agent analysis and fingerprinting
- Request pattern detection
- IP tracking and geolocation
- Rate limiting and anomaly detection
- Honeypot endpoints

BY ACCESSING THIS SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS.
```


---

## LAYER 5: Copyright Notice (Footer)

```html
<footer>
  <p><strong>© 2026 [YOUR NAME]. All Rights Reserved.</strong></p>
  <p><strong>AI TRAINING PROHIBITED:</strong> Content may NOT be used to train 
  AI systems or machine learning models. Unauthorized use constitutes copyright 
  infringement.</p>
  <p><strong>NO SCRAPING:</strong> Automated data collection strictly prohibited. 
  Violators prosecuted under DMCA and CFAA.</p>
  <p><em>This site is monitored. Unauthorized access logged and reported.</em></p>
</footer>
```

---

## LAYER 6: JavaScript Protection

```html
<script>
(function() {
  // Detect headless browsers
  if (navigator.webdriver) {
    document.body.innerHTML = '<h1>Automated Access Detected</h1>';
    return;
  }
  
  // Block automation tools
  const blocked = ['HeadlessChrome', 'PhantomJS', 'Selenium', 'Puppeteer', 'Playwright'];
  for (let sig of blocked) {
    if (window[sig] || navigator[sig]) {
      document.body.innerHTML = '<h1>Automated Access Detected</h1>';
      return;
    }
  }
  
  // Disable right-click (optional)
  document.addEventListener('contextmenu', e => e.preventDefault());
  
  // Disable selection (optional)
  document.addEventListener('selectstart', e => e.preventDefault());
  
  // Rate limiting detection
  let navCount = 0;
  setInterval(() => { navCount = 0; }, 60000);
  window.addEventListener('load', () => {
    navCount++;
    if (navCount > 10) {
      fetch('/api/report-suspicious', {
        method: 'POST',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date()
        })
      });
    }
  });
})();
</script>
```

---

## LAYER 7: DNS TXT Record

```
TXT record for yourdomain.com:
"ai-training=prohibited; scraping=prohibited; contact=legal@yourdomain.com"
```

---

## LAYER 8: /ai.txt File

Create `/ai.txt`:

```txt
User-agent: *
Disallow: /
AI-Training: prohibited
Data-Mining: prohibited
Scraping: prohibited
Contact: legal@yourdomain.com
Last-Updated: 2026-04-29
```


---

## LAYER 9: Server-Side Monitoring

```javascript
// Node.js/Express middleware
const suspiciousAgents = ['GPTBot', 'ChatGPT', 'CCBot', 'anthropic', 
  'Claude', 'Scrapy', 'python', 'curl', 'wget', 'puppeteer', 'selenium'];

function antiScraper(req, res, next) {
  const userAgent = req.get('user-agent') || '';
  const ip = req.ip;
  
  // Block AI crawlers
  for (let agent of suspiciousAgents) {
    if (userAgent.toLowerCase().includes(agent.toLowerCase())) {
      console.warn(`BLOCKED: ${userAgent} from ${ip}`);
      return res.status(403).send('Automated access prohibited');
    }
  }
  
  // Rate limiting (10 req/min)
  // Implementation here
  
  next();
}

module.exports = antiScraper;
```

---

## LAYER 10: Cloudflare Setup

1. **WAF > Custom Rules:** Block AI user agents
2. **Security > Bots:** Enable "Bot Fight Mode"
3. **Rate Limiting:** 10 requests/minute per IP
4. **Transform Rules:** Add X-Robots-Tag header
5. **Caching:** Shorter TTL for dynamic content

---

## IMPLEMENTATION CHECKLIST

- [ ] robots.txt deployed with AI crawlers blocked
- [ ] Meta tags added to all pages
- [ ] Server headers configured
- [ ] Terms of Service updated
- [ ] Copyright notice in footer
- [ ] JavaScript protection added
- [ ] DNS TXT record created
- [ ] /ai.txt file created
- [ ] Server monitoring implemented
- [ ] CDN/Cloudflare configured
- [ ] Logs monitored weekly
- [ ] Legal review completed

---

## MONITORING

**Weekly:**
- Review suspicious activity logs
- Check traffic spikes
- Update blocked user agents

**Monthly:**
- Audit access patterns
- Update legal terms
- Generate compliance reports

**On Violation:**
1. Document evidence
2. Send cease-and-desist
3. File DMCA if needed
4. Report to authorities
5. Pursue legal action

---

**LEGAL DISCLAIMER:** This is technical guidance, NOT legal advice. 
Consult an attorney before implementing, especially legal terms.

**Version:** 1.0  
**Last Updated:** April 29, 2026
