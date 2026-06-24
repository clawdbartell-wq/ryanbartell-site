// Ryan Bartell — Personal Site
// Multi-viewport smoke tests matching wordpress-webpage-builder-tester pattern

const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

const liveUrl = process.env.SITE_URL || null;

const previewPath = path.resolve(process.cwd(), 'index.html');

if (!liveUrl && !require('node:fs').existsSync(previewPath)) {
  throw new Error(`Preview file not found at ${previewPath}. Set SITE_URL env or generate index.html.`);
}

const previewUrl = liveUrl ? new URL('/', liveUrl).href : pathToFileURL(previewPath).href;

const viewports = [
  { name: 'desktop',         width: 1440, height: 900 },
  { name: 'mid-desktop',     width: 1280, height: 800 },
  { name: 'tablet',          width: 1024, height: 768 },
  { name: 'tablet-portrait', width: 820,  height: 1180 },
  { name: 'large-phone',     width: 414,  height: 896 },
  { name: 'small-phone',     width: 360,  height: 780 },
  { name: 'tiny-phone',      width: 320,  height: 640 },
];

test.describe('Homepage essentials', () => {
  test('hero title is visible and not empty', async ({ page }) => {
    await page.goto(previewUrl);
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).not.toHaveText(/^\s*$/);
  });

  test('all three work cards render', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.locator('.work-card')).toHaveCount(3);
  });

  test('all build cards present', async ({ page }) => {
    await page.goto(previewUrl);
    // 6 build cards + 1 "see all" = 7
    await expect(page.locator('.build-card')).toHaveCount(7);
  });

  test('both company cards render', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.locator('.company-card')).toHaveCount(2);
  });

  test('connect section has 4 contact links', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.locator('.connect-link')).toHaveCount(4);
  });

  test('parallax section is visible', async ({ page }) => {
    await page.goto(previewUrl);
    const parallax = page.locator('.parallax-section');
    await parallax.scrollIntoViewIfNeeded();
    await expect(parallax).toBeVisible();
  });

  test('Providence RI is mentioned (location)', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.locator('.hero-location')).toContainText(/Providence/i);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text); });
    await page.goto(previewUrl);
    expect(errors).toEqual([]);
  });
});

for (const vp of viewports) {
  test.describe(`Homepage responsive – ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(previewUrl);
      const fits = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 1);
      expect(fits).toBeTruthy();
    });

    test('hero is visible above the fold', async ({ page }) => {
      await page.goto(previewUrl);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
      const heroTop = await hero.evaluate(el => el.getBoundingClientRect().top);
      // Hero should start near the top (nav is fixed, ~60-80px high)
      expect(heroTop).toBeLessThan(100);
    });

    test('primary CTA button is visible', async ({ page }) => {
      await page.goto(previewUrl);
      const cta = page.locator('.btn-primary').first();
      await expect(cta).toBeVisible();
    });
  });
}