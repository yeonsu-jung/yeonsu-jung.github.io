# yeonsu-jung.github.io

The personal site of Yeonsu Jung: <https://yeonsu-jung.github.io>. Plain HTML and CSS, written by
hand; there is nothing to build.

| Page | File |
|---|---|
| Home | `index.html` |
| Publications | `publications.html` |
| CV | `cv.html`, and `Yeonsu_Jung_CV.pdf` printed from it |
| Portfolio | not in this repository: [`yeonsu-jung/portfolio`](https://github.com/yeonsu-jung/portfolio), which GitHub Pages serves at `/portfolio/` |

`assets/site.css` is the one stylesheet. The three tabs at the top (Home, Portfolio,
Publications) are repeated in each page, and in the portfolio's page.

## Working on it

```
node tools/site.mjs preview     # http://127.0.0.1:4173/, with the portfolio from ~/Documents/portfolio
node tools/site.mjs cv          # print cv.html to Yeonsu_Jung_CV.pdf; it should say 2 pages
node tools/site.mjs check       # every page in headless Chrome: errors, pictures, links, the CV
```

Needs Node 22 or later, and `google-chrome` for the last two. Links between pages start at the
site's root (`/publications.html`, `/portfolio/#whip`), so the pages want the preview server, or
the real site, to be looked at; opened as files their links and stylesheet do not resolve.

After changing the text of the CV, run `cv` again: the PDF is what Home links to.

## What is not published

GitHub Pages runs Jekyll over the repository, which here only copies files. It leaves out
anything whose name starts with an underscore and what `_config.yml` excludes:

- `_notes/`: the essays and the research-statement drafts of the earlier site, kept but not
  shown.
- `tools/` and this file.

The earlier site, a Jekyll theme with Works and Notes pages, is the tag `old-site`.
