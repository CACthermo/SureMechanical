import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.env.TEST_STATIC_DIR || 'out');
const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
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
const { projects } = JSON.parse(await readFile('src/lib/generated/content.json', 'utf8'));
const galleries = projects.filter(p => p.photos.length);
const messageFor = (kind) => ({ general: 'Contact SURE Mechanical', hr: 'Human resources inquiry', project: 'Start a project' })[kind];
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
    for (const cta of projectCTAs) assert.equal(await cta.getAttribute('href'), '#project-form');
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
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
    const cards = page.getByRole('button', { name: /^View project:/ });
    assert.equal(await cards.count(), Math.min(6, projects.length));
    if (projects.length > 6) {
      await page.getByRole('button', {name: 'View More', exact: true}).click();
      assert.equal(await cards.count(), projects.length);
      await page.getByRole('button', {name: 'View Less', exact: true}).click();
    }
    await page.getByRole('button', {name: 'Grid View', exact: true}).click();
    assert.equal(await cards.count(), projects.length);
    const search = page.getByRole('searchbox', {name: 'Search projects or customers'});
    await search.fill('no-such-project-zz');
    assert.equal(await cards.count(), 0);
    await page.getByRole('button', {name: 'Clear project search', exact: true}).click();
    await page.getByRole('button', {name: /^Project list/}).click();
    assert.equal(await cards.count(), projects.length);
    const dialog = page.getByRole('dialog');
    for (const project of projects) {
      const button = page.getByRole('button', {name: 'View project: ' + project.title, exact:true}).filter({hasText:project.customer || ''}).first();
      await search.fill(project.title);
      await button.click();
      await dialog.waitFor();
      assert.equal(await dialog.locator('h3').innerText(), project.title);
      if (project.customer) assert.ok((await dialog.innerText()).includes(project.customer));
      if (project.scope) assert.ok((await dialog.innerText()).includes(project.scope));
      const count = project.photos.length;
      for (const [i,photo] of project.photos.entries()) {
        if (i) await dialog.getByRole('button', {name:'Next photo',exact:true}).click();
        const image = dialog.locator('.touch-pan-y img');
        assert.equal(await image.getAttribute('src'),photo.src);
        assert.equal(await image.getAttribute('alt'),photo.alt);
        await image.evaluate(img => img.decode());
        assert.equal(await dialog.getByRole('status').innerText(), 'Photo ' + (i+1) + ' of ' + count);
      }
      if (count > 1) {
        await page.keyboard.press('ArrowRight');
        assert.equal(await dialog.getByRole('status').innerText(), 'Photo 1 of ' + count);
        await page.keyboard.press('ArrowLeft');
        await dialog.getByRole('button', {name:'Show photo 1 of ' + count}).click();
        const area=dialog.locator('.touch-pan-y');
        await area.dispatchEvent('pointerdown', {pointerType:'touch',clientX:250,clientY:200});
        await area.dispatchEvent('pointerup', {pointerType:'touch',clientX:100,clientY:200});
        assert.equal(await dialog.getByRole('status').innerText(), 'Photo 2 of ' + count);
      }
      await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)));
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'detached'});
      assert.equal(await button.evaluate(el => el === document.activeElement),true);
    }
    await search.fill('');
    await page.getByRole('button', {name: 'Regular View ' + galleries.length, exact:true}).click();
    assert.equal(await page.locator('img[src*="/projects/2026/"]:not(#projects img)').count(), 0);
    const cac = page.locator('img[alt="Cincinnati Air Conditioning Co."]').first();
    assert.equal(await cac.evaluate(img => getComputedStyle(img.parentElement).backgroundColor), 'rgba(0, 0, 0, 0)');
    for (const [kind, endpoint] of [['general', 'mkjjzrrw'], ['hr', 'mpppldpv'], ['project', 'mkjjzrrw']]) {
      const form = page.getByRole('form', { name: messageFor(kind), exact: true });
      assert.equal(await form.getAttribute('action'), 'https://formspree.io/f/' + endpoint);
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
    console.log(`PASS ${width}px: themes, navigation, portfolio, modal, all three forms`);
  }
  // Normal-motion smoke checks also exercise the existing GSAP sections.
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#hero h1').getBoundingClientRect().height > 0);
    await page.locator('#safety').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#safety h2').getBoundingClientRect().height > 0);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/safety-motion-${width}.png` });
    await context.close();
    console.log(`PASS ${width}px: hero and people sections`);
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
