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

const browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE_PATH, args:['--no-sandbox','--disable-dev-shm-usage']});
const base = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
try {
 const samples=[['founder-hold',1.4],['founder-lift',2.3],['founder-duct20',2.62],['founder-duct40',2.79],['founder-duct60',2.96],['founder-duct80',3.13],['founder-connected',3.5],['group-hold',5.5],['group-lift',6.5],['branch20',6.9],['branch40',7.04],['branch60',7.2],['branch80',7.34],['branches-connected',7.85],['affiliate-hold',10.7],['return20',12.22],['return40',12.39],['return60',12.56],['return80',12.73],['return-connected',13.55],['finale',16.1]];
 for(const width of [390,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#sure-system[data-enhanced="true"]').waitFor();
  const bounds=await page.locator('.foundation-track').evaluate(e=>{
    const inset=parseFloat(getComputedStyle(document.querySelector('.foundation-stage')).top);
    return {top:e.getBoundingClientRect().top+scrollY-inset,range:e.clientHeight-innerHeight+inset};
  });
  for(const [name,time] of samples) {
    await page.evaluate(({top,range,time})=>scrollTo({top:top+range*time/16.75,behavior:'instant'}),{...bounds,time});
    await page.waitForTimeout(850);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(await page.locator('.foundation-panel').evaluateAll(es=>es.some(e=>+getComputedStyle(e).opacity>.5)),true,`${width}: no empty stage at ${name}`);
    // The airflow and every metallic surface must share the same clipping path.
    assert.equal(await page.locator('[data-route]').evaluateAll(groups=>groups.every(g=>{
      const mask=document.querySelector(`[data-draw="${g.dataset.route}"]`);
      return [...g.querySelectorAll('path')].every(p=>p.getAttribute('d')===mask.getAttribute('d')) && g.hasAttribute('mask');
    })),true,`${width}: unified duct layers at ${name}`);
    await page.locator('.foundation-stage').screenshot({path:`docs/qa/duct-${width}-${name}.png`});
    if(['founder-hold','group-hold'].includes(name)) {
      const sel=name==='founder-hold'?'.foundation-founder':'.foundation-group';
      const b=await page.locator(sel+' img').boundingBox();
      const stage=await page.locator('.foundation-stage').boundingBox();
      assert.ok(Math.abs(b.x+b.width/2-width/2)<2,`${width}: centered logo`);
      assert.ok(Math.abs(b.y+b.height/2-stage.y-stage.height/2)<3,`${width}: vertical hold`);
      assert.ok(await page.locator(sel+' .foundation-copy').evaluate(e=>+getComputedStyle(e).opacity)>.99);
    }
  }
  await page.evaluate(({top,range})=>scrollTo({top:top+range*2.96/16.75,behavior:'instant'}),bounds);await page.waitForTimeout(850);
  const inspect=()=>page.evaluate(()=>{
   const s=document.querySelector('.foundation-stage').getBoundingClientRect();
   const logo=document.querySelector('.foundation-founder img').getBoundingClientRect();
   const p=document.querySelector('[data-draw="founder"]');const first=p.getPointAtLength(0);
   return {dx:first.x-(logo.x+logo.width/2-s.x),dy:first.y-(logo.bottom-s.y),length:p.getTotalLength(),offset:+p.getAttribute('stroke-dashoffset')};
  });
  let a=await inspect();assert.ok(Math.abs(a.dx)<1&&Math.abs(a.dy-5)<1);assert.ok(a.offset>0&&a.offset<a.length);
  await page.setViewportSize({width:width===390?430:width-50,height:820});await page.waitForTimeout(850);
  a=await inspect();assert.ok(Math.abs(a.dx)<1&&Math.abs(a.dy-5)<1,`${width}: resize attachment`);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('#sure-system').hasAttribute('data-enhanced'));
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.foundation-ducts').isVisible(),false);
  for(const sel of ['.foundation-founder','.foundation-group','.foundation-cac','.foundation-thermo','.foundation-finale']) {
    const visible=await page.locator(sel+' .foundation-copy').isVisible();
    if(!visible)console.log(await page.locator(sel+' .foundation-copy').evaluate(e=>({sel:e.parentElement.className,style:e.getAttribute('style'),parentStyle:e.parentElement.getAttribute('style'),css:getComputedStyle(e).visibility})));
    assert.equal(visible,true,sel+' reduced motion');
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}: forward sequence, centered holds, reverse, attached source after resize, reduced motion, overflow.`);
 }
}finally{await browser.close();server.close();}
