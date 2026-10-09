#!/usr/bin/env node
// Preview, CV and checks for yeonsu-jung.github.io.
//
//     node tools/site.mjs preview [--portfolio DIR] [--port N]
//         Serve this folder at http://127.0.0.1:N/ with the portfolio at /portfolio/, as GitHub
//         Pages does (there the portfolio is the separate repository yeonsu-jung/portfolio).
//         DIR defaults to ~/Documents/portfolio, N to 4173.
//     node tools/site.mjs cv
//         Print cv.html to Yeonsu_Jung_CV.pdf (US Letter) and say how many pages it took.
//     node tools/site.mjs check [--portfolio DIR]
//         Open every page in headless Chrome and report console errors, pictures that did not
//         load, links within the site that lead nowhere, and a CV that is not two pages or is
//         older than cv.html.
//     node tools/site.mjs check --url https://yeonsu-jung.github.io
//         The same against the published site, portfolio included.
//
// Needs Node 22 or later, and google-chrome for cv and check. Nothing to install.

import { spawn } from 'node:child_process';
import { createReadStream, existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir, tmpdir } from 'node:os';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'publications.html', 'cv.html'];
const CV = 'Yeonsu_Jung_CV.pdf';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const option = (args, name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };

// ------------------------------------------------------------------ the site, served as Pages serves it

// What Jekyll leaves out: names that start with "_" or ".", and the entries of exclude: in _config.yml.
function unpublished() {
  const cfg = existsSync(join(ROOT, '_config.yml')) ? readFileSync(join(ROOT, '_config.yml'), 'utf8') : '';
  const block = cfg.split(/^exclude:\s*$/m)[1] || '';
  return [...block.matchAll(/^\s*-\s*(\S+)\s*$/gm)].map(m => m[1].replace(/\/$/, ''));
}

function fileFor(path, portfolio) {
  const parts = decodeURIComponent(path).split('/').filter(Boolean);
  let base = ROOT, rel = parts;
  if (parts[0] === 'portfolio') { base = portfolio; rel = parts.slice(1); }
  else if (!parts.length || unpublished().includes(parts[0]) || parts.some(p => /^[_.]/.test(p))) rel = parts.length ? null : [];
  if (rel === null) return null;
  let f = resolve(base, ...rel);
  if (f !== base && !f.startsWith(base + sep)) return null;
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  return existsSync(f) && statSync(f).isFile() ? f : null;
}

function serve(portfolio, port = 0) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
                  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.pdf': 'application/pdf' };
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/portfolio') { res.writeHead(301, { location: '/portfolio/' }).end(); return; }
    const f = fileFor(url.pathname, portfolio);
    if (!f) { res.writeHead(404, { 'content-type': 'text/plain' }).end('404: not on the site\n'); return; }
    res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream', 'content-length': statSync(f).size, 'cache-control': 'no-store' });
    createReadStream(f).pipe(res);
  });
  return new Promise((res, rej) => { server.once('error', rej); server.listen(port, '127.0.0.1', () => res(server)); });
}

// ------------------------------------------------------------------ Chrome, over its DevTools protocol

async function chrome() {
  const profile = mkdtempSync(join(tmpdir(), 'site-chrome-'));
  const proc = spawn('google-chrome', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1440,900',
    '--hide-scrollbars', '--mute-audio', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150 && !existsSync(portFile); i++) await sleep(100);
  if (!existsSync(portFile)) { proc.kill(); throw new Error('google-chrome did not start'); }
  const [port, path] = readFileSync(portFile, 'utf8').trim().split('\n');
  const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('no DevTools connection')); });
  let id = 0;
  const pending = new Map(), listeners = [];
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
    } else for (const l of listeners) l(msg);
  };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    pending.set(++id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  async function page({ w = 1440, h = 900, scheme = 'light' } = {}) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const S = (m, p) => send(m, p, sessionId);
    const logs = [];
    listeners.push(msg => {
      if (msg.sessionId !== sessionId) return;
      const p = msg.params;
      if (msg.method === 'Runtime.consoleAPICalled' && p.type === 'error') logs.push('console.error: ' + p.args.map(a => a.value ?? a.description ?? '').join(' '));
      if (msg.method === 'Runtime.exceptionThrown') logs.push('exception: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text));
      if (msg.method === 'Log.entryAdded' && p.entry.level === 'error') logs.push(`error: ${p.entry.text} ${p.entry.url || ''}`);
    });
    await S('Page.enable'); await S('Runtime.enable'); await S('Log.enable');
    await S('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
    const evaluate = async expression => {
      const r = await S('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    return {
      logs, eval: evaluate,
      async goto(url) {
        let timer;
        const loaded = new Promise(res => listeners.push(msg => { if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') res(); }));
        await S('Page.navigate', { url });
        await Promise.race([loaded, new Promise(res => { timer = setTimeout(res, 60000); })]);
        clearTimeout(timer);
        await evaluate('document.fonts ? document.fonts.ready.then(() => true) : true');
      },
      // the page as a PDF, at the size and margins its own @page rule asks for
      async pdf() {
        const { data } = await S('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
        return Buffer.from(data, 'base64');
      },
      close: () => send('Target.closeTarget', { targetId }),
    };
  }
  async function close() {
    await send('Browser.close').catch(() => {});
    await sleep(300);
    try { proc.kill(); } catch {}
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
  return { page, close };
}

const pagesOf = pdf => (pdf.toString('latin1').match(/\/Type\s*\/Page(?![a-zA-Z])/g) || []).length;

// ------------------------------------------------------------------ commands

async function preview(args) {
  const portfolio = resolve(option(args, '--portfolio', join(homedir(), 'Documents', 'portfolio')));
  const server = await serve(portfolio, +option(args, '--port', 4173));
  console.log(`http://127.0.0.1:${server.address().port}/   (this folder; /portfolio/ is ${portfolio})\nCtrl+C to stop.`);
  await new Promise(() => {});
}

async function cv() {
  const server = await serve(ROOT), b = await chrome();
  try {
    const p = await b.page();
    await p.goto(`http://127.0.0.1:${server.address().port}/cv.html`);
    const pdf = await p.pdf();
    writeFileSync(join(ROOT, CV), pdf);
    console.log(`${CV}: ${pagesOf(pdf)} page(s), ${(pdf.length / 1e3).toFixed(0)} kB`);
    for (const line of p.logs) console.log('  ' + line);
  } finally { await b.close(); server.close(); }
}

async function check(args) {
  const portfolio = resolve(option(args, '--portfolio', join(homedir(), 'Documents', 'portfolio')));
  const published = option(args, '--url', '').replace(/\/$/, '');
  const bad = [];
  const fail = msg => { bad.push(msg); console.log('  FAIL  ' + msg); };
  const ok = msg => console.log('  ok    ' + msg);
  const server = published ? null : await serve(portfolio), b = await chrome();
  const base = published || `http://127.0.0.1:${server.address().port}`;
  // the text of what a path within the site leads to, or null: from the folders, or from the published site
  const texts = new Map();
  const reach = async path => {
    if (!published) { const f = fileFor(path, portfolio); return f ? readFileSync(f, 'latin1') : null; }
    if (!texts.has(path)) { const r = await fetch(base + path); texts.set(path, r.ok ? Buffer.from(await r.arrayBuffer()).toString('latin1') : null); }
    return texts.get(path);
  };
  try {
    for (const name of PAGES) {
      console.log(name);
      const p = await b.page();
      await p.goto(`${base}/${name}`);
      await sleep(500);
      const seen = await p.eval(`({
        title: document.title,
        current: [...document.querySelectorAll('.tabs a[aria-current="page"]')].map(a => a.textContent),
        broken: [...document.images].filter(i => !(i.complete && i.naturalWidth)).map(i => i.currentSrc || i.src),
        links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))],
        wide: document.documentElement.scrollWidth - innerWidth,
      })`);
      for (const src of seen.broken) fail(`${name}: picture did not load: ${src}`);
      if (seen.wide > 0) fail(`${name}: the page is ${seen.wide}px wider than the window`);
      let inside = 0;
      for (const href of seen.links) {
        if (/^(https?:|mailto:)/.test(href)) continue;
        if (href.startsWith('#')) { if (!await p.eval(`!!document.getElementById(${JSON.stringify(href.slice(1))})`)) fail(`${name}: nothing on the page is called ${href}`); continue; }
        if (!href.startsWith('/')) { fail(`${name}: ${href} is neither a full address nor a path from the site's root`); continue; }
        const [path, hash] = href.split('#');
        const text = await reach(path);
        if (text === null) fail(`${name}: ${href} leads nowhere`);
        else if (hash && !new RegExp(`id="${hash}"`).test(text)) fail(`${name}: ${path} has nothing called #${hash}`);
        else inside++;
      }
      for (const line of p.logs) fail(`${name}: ${line}`);
      ok(`"${seen.title}", ${inside} links within the site, tab: ${seen.current.join() || 'none'}`);
      await p.close();
    }
    console.log('what is kept out');
    for (const path of ['/_notes/notes.md', '/_config.yml', '/tools/site.mjs', '/README.md'])
      (await fetch(base + path)).status === 404 ? ok(`${path} is not served`) : fail(`${path} is served`);
    console.log(CV);
    const pdfFile = join(ROOT, CV);
    if (published) {
      const there = await reach('/' + CV);
      if (there === null) fail(`${CV} is not on the published site`);
      else {
        pagesOf(Buffer.from(there, 'latin1')) === 2 ? ok('2 pages') : fail('not 2 pages');
        existsSync(pdfFile) && readFileSync(pdfFile).equals(Buffer.from(there, 'latin1')) ? ok('the same file as in this folder') : fail('differs from the file in this folder (not pushed yet?)');
      }
    } else if (!existsSync(pdfFile)) fail(`${CV} is missing: node tools/site.mjs cv`);
    else {
      const n = pagesOf(readFileSync(pdfFile));
      n === 2 ? ok('2 pages') : fail(`${n} pages, not 2`);
      statSync(pdfFile).mtimeMs >= statSync(join(ROOT, 'cv.html')).mtimeMs ? ok('not older than cv.html') : fail('older than cv.html: node tools/site.mjs cv');
    }
  } finally { await b.close(); if (server) server.close(); }
  console.log(bad.length ? `\n${bad.length} problem(s)` : '\nall good');
  return bad.length ? 1 : 0;
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'preview') await preview(rest);
  else if (cmd === 'cv') await cv();
  else if (cmd === 'check') process.exitCode = await check(rest);
  else { console.log('usage: node tools/site.mjs preview [--portfolio DIR] [--port N] | cv | check [--portfolio DIR]'); process.exitCode = 2; }
} catch (e) { console.error(String(e.message || e)); process.exitCode = 1; }
