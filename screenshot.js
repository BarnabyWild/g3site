const { chromium } = require('playwright');

async function screenshotSite() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const baseUrl = 'https://www.g3innovative.com';
  const visitedUrls = new Set();
  const screenshots = [];

  // Start with the homepage
  console.log('Visiting homepage...');
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
  console.log('Saved: screenshots/homepage.png');
  screenshots.push({ name: 'homepage', url: baseUrl });
  visitedUrls.add(baseUrl);
  visitedUrls.add(baseUrl + '/');

  // Get all internal links
  const links = await page.evaluate((base) => {
    const anchors = document.querySelectorAll('a[href]');
    const urls = [];
    anchors.forEach(a => {
      const href = a.href;
      if (href.startsWith(base) && !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:')) {
        urls.push({ url: href, text: a.textContent.trim() });
      }
    });
    return urls;
  }, baseUrl);

  console.log(`Found ${links.length} internal links`);

  // Visit each unique internal page
  for (const link of links) {
    const normalizedUrl = link.url.replace(/\/$/, '');
    if (visitedUrls.has(normalizedUrl) || visitedUrls.has(normalizedUrl + '/')) continue;
    visitedUrls.add(normalizedUrl);

    try {
      console.log(`Visiting: ${link.url}`);
      await page.goto(link.url, { waitUntil: 'networkidle', timeout: 30000 });

      const pageName = normalizedUrl.replace(baseUrl, '').replace(/\//g, '-').replace(/^-/, '') || 'home';
      const filename = `screenshots/${pageName}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`Saved: ${filename}`);
      screenshots.push({ name: pageName, url: link.url, linkText: link.text });
    } catch (e) {
      console.log(`Error visiting ${link.url}: ${e.message}`);
    }
  }

  // Save a summary
  const fs = require('fs');
  fs.writeFileSync('screenshots/summary.json', JSON.stringify(screenshots, null, 2));

  await browser.close();
  console.log('\nDone! Screenshots saved to /screenshots folder');
  console.log(`Total pages captured: ${screenshots.length}`);
}

// Create screenshots folder
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

screenshotSite().catch(console.error);
