#!/usr/bin/env node
// The whole site, the portfolio included, as one HTML file that opens from disk.
//
//   node tools/bundle.mjs                 # everything, offline: the live 3D viewers, the clips, fonts, three.js
//   node tools/bundle.mjs --lite          # text, pictures and fonts only; viewers and clips load from the live site
//   options: --out <file> (default ~/Downloads/Yeonsu_Jung_website[_lite].html)  --portfolio <dir> (default ~/Documents/portfolio)
//
// How it works. Every file a page needs is stored once, inside a <script type="text/x-vfs"> of the
// bundle. Pages and viewers are shown in <iframe srcdoc>, which shares the bundle's origin, so they
// can load the stored files as blob: URLs (Chrome refuses blob: subresources inside a blob: frame
// opened from file://, which rules out the simpler design). In the stored HTML:
//   vfs-res:<path>        a file the browser loads (picture, clip, stylesheet, script, font): it is
//                         replaced by a blob: URL when the document is put on screen
//   vfs:<path>#<frag>     a link to a page, a viewer or the CV PDF: a small router in each document
//                         hands it to the bundle, which swaps the page, opens the viewer in a tab of
//                         its own, or downloads the file
// The vendor files (three.js, IBM Plex) are downloaded once into ~/.cache/yeonsu-site-bundle.

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve, extname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const MAIN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (name, dflt) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : dflt; };
const LITE = argv.includes('--lite');
const PORT = resolve(opt('--portfolio', join(homedir(), 'Documents/portfolio')));
const OUT = resolve(opt('--out', join(homedir(), 'Downloads', LITE ? 'Yeonsu_Jung_website_lite.html' : 'Yeonsu_Jung_website.html')));
const CACHE = join(homedir(), '.cache/yeonsu-site-bundle');
const LIVE = 'https://yeonsu-jung.github.io';

// the tabs of the site, in the order of its top bar, plus the CV page
const PAGES = {
  home: 'index.html',
  robotics: 'portfolio/index.html',
  imaging: 'portfolio/imaging.html',
  experiments: 'portfolio/experiments.html',
  publications: 'publications.html',
  cv: 'cv.html',
};
const PAGE_KEY = Object.fromEntries(Object.entries(PAGES).map(([k, p]) => [p, k]));
const isViewer = p => /^portfolio\/(index_[\w-]+\.html|volumes\/index\.html)$/.test(p);
const isClip = p => /\.(mp4|webm|mov)$/i.test(p);

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.woff': 'font/woff',
};
const isText = p => /^(text\/|application\/json|image\/svg)/.test(TYPES[extname(p).toLowerCase()] || '');

const fileOf = p => p.startsWith('portfolio/') ? join(PORT, p.slice('portfolio/'.length))
  : p.startsWith('vendor/') ? join(CACHE, p.slice('vendor/'.length)) : join(MAIN, p);

const warnings = [];
const warn = m => { warnings.push(m); };

// ------------------------------------------------------------------ vendor files

const THREE_165 = 'https://cdn.jsdelivr.net/npm/three@0.165.0/';
const ADDONS = ['controls/OrbitControls.js', 'lines/LineMaterial.js', 'lines/LineSegments2.js', 'lines/LineSegmentsGeometry.js'];
const CLASSIC = {   // the r128 builds the X-ray viewers and the linking optimizer load as plain scripts
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': 'vendor/three@0.128.0/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js': 'vendor/three@0.128.0/examples/js/controls/OrbitControls.js',
};
const FONTS_CSS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap';
const CHROME_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function download(url, path, headers = {}) {
  const f = fileOf(path);
  if (existsSync(f)) return;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, Buffer.from(await r.arrayBuffer()));
}

async function vendor() {
  for (const [url, path] of Object.entries(CLASSIC)) await download(url, path);
  if (!LITE) {
    await download(THREE_165 + 'build/three.module.js', 'vendor/three@0.165.0/build/three.module.js');
    for (const a of ADDONS) await download(THREE_165 + 'examples/jsm/' + a, 'vendor/three@0.165.0/examples/jsm/' + a);
  }
  // IBM Plex: the Latin and Latin Extended subsets of every face the pages and viewers ask for
  const cssPath = 'vendor/fonts/plex.src.css';
  await download(FONTS_CSS, cssPath, { 'user-agent': CHROME_UA });
  const src = readFileSync(fileOf(cssPath), 'utf8');
  let out = '';
  for (const m of src.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)) {
    if (m[1] !== 'latin' && m[1] !== 'latin-ext') continue;
    let face = m[2];
    const url = face.match(/url\(([^)]+)\)/)[1];
    const name = 'vendor/fonts/' + url.split('/').slice(-3).join('-').replace(/[^\w.-]/g, '');
    await download(url, name);
    face = face.replace(url, 'vfs-res:' + name);
    out += `/* ${m[1]} */\n${face}\n`;
  }
  if (!out) throw new Error('no @font-face rules in the Google Fonts answer');
  writeFileSync(fileOf('vendor/fonts.css'), out);
}

// ------------------------------------------------------------------ the files of the bundle

const files = new Map();   // site path -> { data: string|Buffer, type }
const queue = [];
const want = p => { if (!files.has(p) && !queue.includes(p)) queue.push(p); };

function resolveRef(from, ref) {
  if (/^(https?:|mailto:|data:|javascript:|tel:|blob:|vfs)/i.test(ref) || ref.startsWith('#') || ref === '') return null;
  const u = new URL(ref, 'https://site.invalid/' + from);
  let path = decodeURIComponent(u.pathname.slice(1));
  if (path === '' || path.endsWith('/')) path += 'index.html';
  return { path, frag: u.hash };
}

// what a reference to a file of the site becomes inside the bundle
function rewriteRef(from, ref, attr) {
  const r = resolveRef(from, ref);
  if (!r) return ref;
  const { path, frag } = r;
  if (!existsSync(fileOf(path)) || !statSync(fileOf(path)).isFile()) {
    warn(`${from}: "${ref}" is not a file of the site; it points at the live site instead`);
    return LIVE + '/' + path.replace(/index\.html$/, '') + frag;
  }
  if (PAGE_KEY[path]) return 'vfs:' + path + frag;
  if (isViewer(path)) {
    if (LITE) return LIVE + '/' + path + frag;
    want(path);
    return 'vfs:' + path + frag;
  }
  if (LITE && isClip(path)) return LIVE + '/' + path + frag;
  want(path);
  // a link to a stored file (the CV PDF) is a download; anything the browser loads by itself is a resource
  return (attr === 'href' && !/\.css$/.test(path) ? 'vfs:' : 'vfs-res:') + path + frag;
}

function rewriteHtml(path, s) {
  const count = (re) => (s.match(re) || []).length;
  // fonts: the stored IBM Plex instead of Google's
  s = s.replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"( crossorigin)?>\s*/g, '');
  s = s.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*">/g, '<link rel="stylesheet" href="vfs-res:vendor/fonts.css">');
  want('vendor/fonts.css');
  // three.js, r128, as plain scripts
  for (const [url, vp] of Object.entries(CLASSIC)) {
    if (s.includes(`src="${url}"`)) { s = s.split(`src="${url}"`).join(`src="vfs-res:${vp}"`); want(vp); }
  }
  // three.js 0.165, as modules: one import-map entry per module, since blob: URLs have no folders
  s = s.replace(/<script type="importmap">([\s\S]*?)<\/script>/, (all, json) => {
    const map = JSON.parse(json).imports;
    if (map.three !== THREE_165 + 'build/three.module.js') { warn(`${path}: an import map this script does not know; left as is`); return all; }
    const imports = { three: 'vfs-res:vendor/three@0.165.0/build/three.module.js' };
    want('vendor/three@0.165.0/build/three.module.js');
    for (const a of ADDONS) { imports['three/addons/' + a] = 'vfs-res:vendor/three@0.165.0/examples/jsm/' + a; want('vendor/three@0.165.0/examples/jsm/' + a); }
    return `<script type="importmap">\n${JSON.stringify({ imports }, null, 2)}\n</script>`;
  });
  for (const m of s.matchAll(/https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|fonts\.googleapis\.com)[^"' )]*/g)) warn(`${path}: still loads ${m[0]}`);
  // the portfolio's slide loader: viewers go into <iframe srcdoc> through the bundle, and "Own tab" keeps their address
  if (path === PAGES.robotics || path === PAGES.imaging) {
    const before = count(/f\.src = this\.url\(this\.hash\);/g) + count(/this\.open\.href = f\.src;/g);
    if (before !== 2) throw new Error(`${path}: the slide loader changed; update the patch in tools/bundle.mjs`);
    s = s.replace('f.src = this.url(this.hash);', 'window.__vfsFrame(f, this.url(this.hash));')
      .replace('this.open.href = f.src;', 'this.open.href = this.url(this.hash);');
  }
  // the volume viewer picks its data file by name
  if (path === 'portfolio/volumes/index.html') {
    const tpl = 'tag.src = `data/${v.id}.js`;';
    if (!s.includes(tpl)) throw new Error(`${path}: the data loader changed; update the patch in tools/bundle.mjs`);
    s = s.replace(tpl, 'tag.src = window.__vfsRes(`portfolio/volumes/data/${v.id}.js`);');
    for (const f of ['alpha100', 'hourglass', 'macaque85', 'pigeon', 'weaver_kpb']) want(`portfolio/volumes/data/${f}.js`);
  }
  // every reference in an attribute
  s = s.replace(/(\s)(src|href|data-src|poster|srcset)="([^"]*)"/g, (all, sp, attr, val) => {
    if (val.startsWith('vfs')) return all;
    if (attr === 'srcset') return `${sp}${attr}="${val.split(',').map(part => {
      const [u, ...rest] = part.trim().split(/\s+/);
      return [rewriteRef(path, u.replace(/&amp;/g, '&'), attr), ...rest].join(' ');
    }).join(', ')}"`;
    const out = rewriteRef(path, val.replace(/&amp;/g, '&'), attr);
    return `${sp}${attr}="${out.replace(/&/g, '&amp;')}"`;
  });
  return s;
}

function rewriteCss(path, s) {
  return s.replace(/url\((['"]?)([^'")]+)\1\)/g, (all, q, u) => u.startsWith('vfs') || u.startsWith('data:') ? all : `url(${q}${rewriteRef(path, u, 'url')}${q})`);
}

function rewriteJs(path, s) {
  if (path.startsWith('vendor/three@0.165.0/examples/jsm/')) {
    // relative imports between add-ons become the bare names the import map knows
    const dir = path.slice('vendor/three@0.165.0/examples/jsm/'.length).split('/').slice(0, -1);
    s = s.replace(/(from\s*|import\s*)(['"])(\.{1,2}\/[^'"]+)\2/g, (all, kw, q, rel) => {
      const name = new URL(rel, 'https://x.invalid/' + dir.join('/') + '/').pathname.slice(1);
      if (!ADDONS.includes(name)) throw new Error(`${path} imports ${rel}, which is not stored`);
      return `${kw}${q}three/addons/${name}${q}`;
    });
  }
  if (path === 'portfolio/volumes/data/manifest.js') s = s.replace('"url": "/portfolio/imaging.html"', '"url": "vfs:portfolio/imaging.html"');
  return s;
}

function trackedFiles(repo) {
  try { return new Set(execFileSync('git', ['-C', repo, 'ls-files', '-z'], { encoding: 'utf8' }).split('\0')); } catch { return null; }
}

// ------------------------------------------------------------------ the bundle

const RUNTIME = String.raw`
(function () {
  'use strict';
  var PAGES = __PAGES__, KEY = {};
  Object.keys(PAGES).forEach(function (k) { KEY[PAGES[k]] = k; });
  var view = document.getElementById('view'), wait = document.getElementById('wait');
  var texts = Object.create(null), urls = Object.create(null);

  function node(p) {
    var e = document.getElementById('f:' + p);
    if (!e) throw new Error('This file is not in the bundle: ' + p);
    return e;
  }
  function bytes(b64) {
    var s = atob(b64), n = s.length, u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  function text(p) {
    if (!(p in texts)) {
      var e = node(p);
      texts[p] = e.dataset.e === 'j' ? JSON.parse(e.textContent) : new TextDecoder().decode(bytes(e.textContent));
      e.textContent = '';
    }
    return texts[p];
  }
  function sub(t) { return t.replace(/vfs-res:([\w.\/@~-]+)/g, function (m, p) { return res(p); }); }
  // a stored file as a blob: URL, made the first time it is asked for
  function res(p) {
    if (!(p in urls)) {
      var e = node(p), type = e.dataset.t, blob;
      if (e.dataset.k === 't') blob = new Blob([sub(text(p))], { type: type });
      else { blob = new Blob([bytes(e.textContent)], { type: type }); e.textContent = ''; }
      urls[p] = URL.createObjectURL(blob);
    }
    return urls[p];
  }
  function split(u) {
    var s = u.replace(/^vfs:/, ''), i = s.indexOf('#');
    return i < 0 ? { path: s, hash: '' } : { path: s.slice(0, i), hash: s.slice(i) };
  }

  // what goes at the top of every page and viewer: its #hash, a router for links, and the bundle's hooks
  function boot(hash, scroll) {
    return '<script>(' + function (hash, scroll) {
      try { if (hash) history.replaceState(null, '', location.href.split('#')[0] + hash); } catch (e) {}
      var V = function () {
        try { if (top.__vfs) return top.__vfs; } catch (e) {}
        try { return opener && opener.__vfs; } catch (e) {}
      };
      window.__vfsFrame = function (f, u) { var v = V(); if (v && u.slice(0, 4) === 'vfs:') v.frame(f, u); else f.src = u; };
      window.__vfsRes = function (p) { return V().res(p); };
      var link = function (e) { var t = e.target; return t && t.closest ? t.closest('a[href]') : null; };
      document.addEventListener('click', function (e) {
        var a = link(e), u = a && a.getAttribute('href') || '';
        if (/^https?:/i.test(u) && !a.target) { a.target = '_blank'; a.rel = 'noopener'; }
      }, true);
      window.addEventListener('click', function (e) {
        var a = link(e);
        if (!a || e.defaultPrevented) return;
        var u = a.getAttribute('href') || '';
        if (u.charAt(0) === '#') { e.preventDefault(); if (u.length > 1) location.hash = u; return; }
        if (u.slice(0, 4) !== 'vfs:') return;
        e.preventDefault();
        var v = V();
        if (v) v.go(u, e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank');
      });
      if (scroll) {
        var to = function () { var t = document.getElementById(scroll); if (t) t.scrollIntoView(); };
        document.addEventListener('DOMContentLoaded', to);
        addEventListener('load', to);
      }
    } + ')(' + JSON.stringify(hash) + ',' + JSON.stringify(scroll ? hash.slice(1) : '') + ');<\/script>';
  }
  function doc(p, hash, scroll) {
    var t = sub(text(p)), b = boot(hash || '', scroll);
    var m = /<head\b[^>]*>/i.exec(t) || /<html\b[^>]*>/i.exec(t) || /<!doctype[^>]*>/i.exec(t);
    return m ? t.slice(0, m.index + m[0].length) + b + t.slice(m.index + m[0].length) : b + t;
  }

  var shown = '';
  function show() {
    var h = decodeURIComponent(location.hash.slice(1)), i = h.indexOf('/');
    var k = i < 0 ? h : h.slice(0, i), frag = i < 0 ? '' : h.slice(i + 1);
    if (!PAGES[k]) k = 'home';
    if (k === shown && frag) {          // the same page: only scroll
      try { view.contentWindow.location.hash = frag; return; } catch (e) {}
    }
    shown = k;
    view.srcdoc = doc(PAGES[k], frag ? '#' + frag : '', true);
  }
  view.addEventListener('load', function () {
    try { document.title = view.contentDocument.title; } catch (e) {}
    if (wait) { wait.remove(); wait = null; }
    try { view.contentWindow.focus(); } catch (e) {}
  });

  window.__vfs = {
    res: res,
    frame: function (f, u) { var x = split(u); f.srcdoc = doc(x.path, x.hash, false); },
    go: function (u, tab) {
      var x = split(u);
      if (KEY[x.path]) {
        var h = KEY[x.path] + (x.hash ? '/' + x.hash.slice(1) : '');
        if (location.hash.slice(1) === h) show(); else location.hash = h;
        return;
      }
      if (/\.html$/.test(x.path)) {            // a viewer, in a tab of its own
        var w = window.open('', '_blank');
        if (!w) return;
        w.document.open();
        w.document.write(doc(x.path, x.hash, false));
        w.document.close();
        return;
      }
      var a = document.createElement('a');     // a file: save it
      a.href = res(x.path);
      a.download = x.path.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };
  addEventListener('hashchange', show);
  show();
})();
`;

function encode(path, data) {
  const type = TYPES[extname(path).toLowerCase()] || 'application/octet-stream';
  if (typeof data === 'string') {
    const json = JSON.stringify(data).replace(/</g, '\\u003c');   // no '</script' or '<!--' can end the element early
    const b64 = Buffer.from(data, 'utf8').toString('base64');
    return json.length <= b64.length ? { k: 't', e: 'j', type, body: json } : { k: 't', e: 'b', type, body: b64 };
  }
  return { k: 'b', e: 'b', type, body: data.toString('base64') };
}

async function main() {
  mkdirSync(CACHE, { recursive: true });
  await vendor();
  for (const p of Object.values(PAGES)) want(p);
  while (queue.length) {
    const p = queue.shift();
    const f = fileOf(p);
    if (isText(p)) {
      let s = readFileSync(f, 'utf8');
      const ext = extname(p).toLowerCase();
      if (ext === '.html') s = rewriteHtml(p, s);
      else if (ext === '.css') s = rewriteCss(p, s);
      else if (ext === '.js') s = rewriteJs(p, s);
      for (const m of s.matchAll(/vfs-res:([\w.\/@~-]+)/g)) want(m[1]);   // e.g. the fonts that fonts.css names
      files.set(p, s);
    } else files.set(p, readFileSync(f));
  }

  // nothing that is not published goes into the bundle
  const tracked = { main: trackedFiles(MAIN), portfolio: trackedFiles(PORT) };
  for (const p of files.keys()) {
    if (p.startsWith('vendor/')) continue;
    const [set, rel] = p.startsWith('portfolio/') ? [tracked.portfolio, p.slice(10)] : [tracked.main, p];
    if (set && !set.has(rel)) throw new Error(`${p} is not tracked by git, so it is not on the live site; refusing to bundle it`);
  }

  // small files first, so the page can be read while the rest is still arriving
  const order = [...files.keys()].sort((a, b) => (files.get(a).length - files.get(b).length));
  const parts = [];
  let total = 0;
  for (const p of order) {
    const { k, e, type, body } = encode(p, files.get(p));
    total += body.length;
    parts.push(`<script type="text/x-vfs" id="f:${p}" data-k="${k}" data-e="${e}" data-t="${type}">${body}</script>`);
  }

  const icon = readFileSync(join(MAIN, 'index.html'), 'utf8').match(/<link rel="icon" href="([^"]+)">/)[1];
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yeonsu Jung</title>
<link rel="icon" href="${icon}">
<!-- Yeonsu Jung's website (${LIVE}) as one file, made ${new Date().toISOString().slice(0, 10)}${LITE ? '. The live viewers and the clips load from the live site.' : ', with everything it needs to work offline.'} -->
<style>
  :root { color-scheme: light dark; }
  html, body { margin: 0; height: 100%; overflow: hidden; background: #fff; color: #1f2328; }
  @media (prefers-color-scheme: dark) { html, body { background: #0d1117; color: #e6edf3; } }
  #view { position: fixed; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
  #wait { position: fixed; inset: 0; display: grid; place-items: center; font: 15px/1.5 system-ui, sans-serif; opacity: .7; }
</style>
</head>
<body>
<div id="wait">Opening Yeonsu Jung's website…</div>
<iframe id="view" title="Yeonsu Jung" allow="fullscreen; clipboard-write; autoplay"></iframe>
${parts.join('\n')}
<script>${RUNTIME.replace('__PAGES__', JSON.stringify(PAGES))}</script>
</body>
</html>
`;
  writeFileSync(OUT, html);
  const mb = n => (n / 1e6).toFixed(1) + ' MB';
  console.log(`${OUT}\n  ${files.size} files, ${mb(Buffer.byteLength(html))}${LITE ? ' (lite: viewers and clips stream from ' + LIVE + ')' : ''}`);
  for (const w of warnings) console.log('  warning: ' + w);
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
