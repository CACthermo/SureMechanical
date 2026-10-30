import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.env.TEST_STATIC_DIR || 'out');
const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = process.env.TEST_BASE_URL ? null : createServer(async (request, response) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path += '/index.html';
    response.setHeader('Content-Type', mimeTypes[extname(path)] || 'application/octet-stream');
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end('Not found'); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

// Run against a local dev server or the static export. Formspree requests are
// intercepted: this suite never sends test messages to company recipients.
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {}),
});
const baseURL = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
const failures = [];
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.equal(await page.locator('#fabrication').count(), 0);
    assert.equal(await page.locator('.timeline-node, .sw-craft-label').count(), 0);
    assert.equal(await page.locator('a[href="#"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}px`);
    const badAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.getAttribute('href').slice(1))).map(link => link.getAttribute('href')));
    assert.deepEqual(badAnchors, []);
    const projectCTAs = await page.getByRole('link', { name: 'Start a Project', exact: true }).all();
    for (const cta of projectCTAs) assert.match(await cta.getAttribute('href'), /^mailto:bidinvites@suremechanical.com/);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    if (width < 1024) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Careers / HR' }).click();
      assert.equal(await page.getByRole('navigation', { name: 'Mobile navigation' }).count(), 0);
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
    }
    await page.getByRole('button', { name: 'Research', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: /^View preliminary project:/ }).count(), 1);
    await page.getByRole('button', { name: /^View preliminary project:/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    assert.match(await dialog.innerText(), /Advanced Research Laboratory/);
    assert.match(await dialog.innerText(), /require SURE leadership confirmation/);
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true, 'Dialog must retain focus');
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.match(await page.locator(':focus').getAttribute('aria-label'), /View preliminary project/);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: /^View preliminary project:/ }).count(), 6);
    const photos = await page.locator('#projects img').evaluateAll(images => images.map(image => image.getAttribute('src')));
    assert.equal(new Set(photos).size, photos.length);
    assert.equal(await page.locator('img[src*="/projects/photos/"]:not(#projects img)').count(), 0);
    // Bring lazy images into view before requiring successful decoding.
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      assert.equal(await image.evaluate(image => image.naturalWidth > 0), true);
    }
    const cac = page.locator('img[alt="Cincinnati Air Conditioning Co."]').first();
    assert.equal(await cac.evaluate(img => getComputedStyle(img.parentElement).backgroundColor), 'rgb(255, 255, 255)');
    for (const [kind, endpoint] of [['general', 'mkjjzrrw'], ['hr', 'mpppldpv']]) {
      const form = page.getByRole('form', { name: kind === 'hr' ? 'Human resources inquiry' : 'Contact SURE Mechanical', exact: true });
      let requests = 0;
      let responseMode = 'success';
      let release;
      await page.route(`https://formspree.io/f/${endpoint}`, async route => {
        requests++;
        assert.equal(route.request().method(), 'POST');
        assert.match(route.request().postData(), /Website verification/);
        if (responseMode === 'success') await new Promise(resolve => { release = resolve; });
        if (responseMode === 'network') return route.abort();
        await route.fulfill({ status: responseMode === 'error' ? 422 : 200, contentType: 'application/json', body: JSON.stringify(responseMode === 'error' ? { errors: [{ message: 'Test rejection' }] } : { ok: true }) });
      });
      await form.getByRole('button', { name: /Send/ }).click();
      assert.equal(requests, 0, 'Empty form must not send');
      const fillForm = async () => {
        await form.locator('[name="name"]').fill('Website verification');
        await form.locator('[name="email"]').fill('verification@example.com');
        await form.locator('[name="message"]').fill('Website verification: intercepted browser test only.');
      };
      await fillForm();
      await form.locator('[name="email"]').fill('invalid');
      await form.getByRole('button', { name: /Send/ }).click();
      assert.equal(requests, 0, 'Invalid email must not send');
      await fillForm();
      await form.locator('[name="name"]').fill('   ');
      await form.getByRole('button', { name: /Send/ }).click();
      assert.equal(requests, 0, 'Whitespace-only required fields must not send');
      await fillForm();
      await form.getByRole('button', { name: /Send/ }).click();
      await form.getByRole('button', { name: 'Sending…' }).waitFor();
      assert.equal(await form.getByRole('button', { name: 'Sending…' }).isDisabled(), true);
      await page.waitForFunction(() => document.querySelector('form[aria-busy="true"]') !== null);
      while (!release) await new Promise(resolve => setTimeout(resolve, 10));
      release();
      await form.getByRole('status').waitFor();
      assert.equal(await form.locator('[name="name"]').inputValue(), '');
      responseMode = 'error';
      await fillForm();
      await form.getByRole('button', { name: /Send/ }).click();
      await form.getByRole('alert').waitFor();
      assert.match(await form.getByRole('alert').innerText(), /could not send/);
      assert.equal(await form.locator('[name="name"]').inputValue(), 'Website verification');
      responseMode = 'network';
      await form.getByRole('button', { name: /Send/ }).click();
      await form.getByRole('alert').waitFor();
      assert.equal(await form.getByRole('button', { name: /Send/ }).isEnabled(), true);
      assert.equal(requests, 3);
    }
    if (process.env.SCREENSHOT_DIR) {
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/light-${width}.png`, fullPage: false });
      for (const image of await page.locator('#projects img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(img => img.decode()); }
      await page.locator('#projects').screenshot({ path: `${process.env.SCREENSHOT_DIR}/projects-${width}.png` });
      await page.locator('#cta').screenshot({ path: `${process.env.SCREENSHOT_DIR}/contact-${width}.png` });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Switch to dark mode' }).click();
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/dark-${width}.png`, fullPage: false });
    }
    await context.close();
    console.log(`PASS ${width}px: themes, navigation, portfolio, modal, both forms`);
  }
  // Normal-motion smoke checks also exercise the existing GSAP sections.
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hero-content')).opacity) === 1);
    await page.locator('#safety').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.sw-title')).opacity) === 1);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/safety-motion-${width}.png` });
    await context.close();
    console.log(`PASS ${width}px: normal-motion hero and scroll sections`);
  }
  // Verify theme controls remain functional when browser storage is unavailable.
  const context = await browser.newContext();
  await context.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); }; Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); }; });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await context.close();
  assert.deepEqual(failures, [], 'No uncaught application errors');
  console.log('PASS blocked storage fallback and application errors');
} finally {
  await browser.close();
  server?.close();
}
