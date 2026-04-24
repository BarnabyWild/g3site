const { chromium } = require('playwright');

async function previewSite() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Open the local HTML file
  await page.goto(`file:///${process.cwd().replace(/\\/g, '/')}/index.html`, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Wait for fonts to load
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({
    path: 'screenshots/new-site-full.png',
    fullPage: true
  });
  console.log('Saved: screenshots/new-site-full.png');

  // Take above-the-fold screenshot
  await page.screenshot({
    path: 'screenshots/new-site-hero.png'
  });
  console.log('Saved: screenshots/new-site-hero.png');

  await browser.close();
  console.log('\nPreview screenshots saved!');
}

previewSite().catch(console.error);
