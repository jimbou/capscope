# CapScope Paper Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a concise, dependency-free CapScope paper website that mirrors the Gordian site’s visual template and deploys from the repository root through GitHub Pages.

**Architecture:** A semantic single-page `index.html` references one stylesheet, one progressive-enhancement script, the supplied CapScope mark, and normalized local paper/slide filenames. A Node built-in test checks the public-page contract and deployment configuration without adding dependencies.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, GitHub Actions Pages actions

---

## File Map

- `index.html`: Page metadata, navigation, hero, abstract, approach, evaluation, citation, authors, and footer.
- `styles.css`: Gordian-derived editorial design system, responsive grids, light/dark palettes, and CapScope-specific authorization diagram.
- `script.js`: Scroll progress, citation copy feedback, and progressive reveal behavior.
- `assets/capscope-mark.svg`: Site favicon and wordmark image copied from the supplied `logo.svg`.
- `paper.pdf`: Stable public filename for `CapScope (6).pdf`.
- `slides.pdf`: Stable public filename for `CapScope — LMPL 2026 .pdf`.
- `.github/workflows/pages.yml`: Root-directory GitHub Pages deployment.
- `tests/site-contract.test.mjs`: Content, link, asset, interaction, and workflow contract checks.
- `package.json`: Dependency-free test command.
- `README.md`: Preview, test, source-of-truth, and deployment notes.

### Task 1: Establish the public-page contract

**Files:**
- Create: `tests/site-contract.test.mjs`
- Create: `package.json`

- [ ] **Step 1: Write the failing contract tests**

Create `tests/site-contract.test.mjs` with Node’s built-in test runner. Read files relative to the repository root and assert:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("page contains the approved CapScope content", async () => {
  const html = await read("index.html");
  const required = [
    "CapScope", "Submitted to LMPL 2026",
    "Authority Is Not a String", "Dimitrios Stamatios Bouras",
    "Yihan Dai", "Sergey Mechtaev", "Mint", "Freeze", "Derive", "Check",
    "300", "3/75", "33/75", "68/75", "https://github.com/msv-lab/CapScope",
    "2501112125@stu.pku.edu.cn", "2501112020@stu.pku.edu.cn",
    "mechtaev@pku.edu.cn"
  ];
  for (const value of required) assert.match(html, new RegExp(value.replace("/", "\\/")));
  assert.doesNotMatch(html, /Gordian|ISSTA|2603\.19239/i);
});

test("page exposes local paper, slides, styles, script, and mark", async () => {
  const html = await read("index.html");
  for (const path of ["paper.pdf", "slides.pdf", "styles.css", "script.js", "assets/capscope-mark.svg"]) {
    assert.match(html, new RegExp(path.replace(".", "\\.")));
    await access(new URL(path, root));
  }
});

test("page keeps the template accessibility and interaction hooks", async () => {
  const html = await read("index.html");
  const script = await read("script.js");
  for (const value of ["skip-link", "main-content", "scroll-progress", "copy-cite", "bibtex"]) {
    assert.match(html, new RegExp(value));
  }
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /navigator\.clipboard/);
  assert.match(script, /prefers-reduced-motion/);
});

test("Pages workflow deploys the repository root", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  for (const value of ["pages: write", "id-token: write", "actions/configure-pages", "actions/upload-pages-artifact", "path: .", "actions/deploy-pages"]) {
    assert.match(workflow, new RegExp(value.replace(".", "\\.")));
  }
});
```

Create `package.json`:

```json
{
  "name": "capscope-paper-website",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.mjs"
  }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `index.html` and the Pages workflow do not exist.

- [ ] **Step 3: Commit the test contract**

```bash
git add package.json tests/site-contract.test.mjs
git commit -m "test: define CapScope website contract"
```

### Task 2: Normalize the supplied public assets

**Files:**
- Create: `assets/capscope-mark.svg`
- Create: `paper.pdf`
- Create: `slides.pdf`

- [ ] **Step 1: Create stable public filenames**

Run:

```bash
mkdir -p assets
cp logo.svg assets/capscope-mark.svg
cp "CapScope (6).pdf" paper.pdf
cp "CapScope — LMPL 2026 .pdf" slides.pdf
```

- [ ] **Step 2: Verify type and equality**

Run:

```bash
file assets/capscope-mark.svg paper.pdf slides.pdf
cmp logo.svg assets/capscope-mark.svg
cmp "CapScope (6).pdf" paper.pdf
cmp "CapScope — LMPL 2026 .pdf" slides.pdf
```

Expected: SVG and two PDF types; every `cmp` exits 0.

- [ ] **Step 3: Commit public assets**

```bash
git add assets/capscope-mark.svg paper.pdf slides.pdf
git commit -m "chore: add CapScope public assets"
```

### Task 3: Build the concise CapScope page

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

- [ ] **Step 1: Create semantic page content**

Build `index.html` by retaining the Gordian template’s `<head>`, sticky header, section shells, citation block, people cards, and footer semantics. Replace every research-specific value with the following exact CapScope structure:

```text
Navigation: Approach · Evidence · Cite · People · Paper
Hero status: Submitted to LMPL 2026
Hero title: Authority is not a string. Scope it.
Hero lede: CapScope keeps tool authority in the harness, gives each coding agent only the capabilities its role needs, and checks every proposed effect at dispatch.
Hero actions: Read paper · View slides · Artifacts
Summary principle: Text can influence a request. It cannot create authority.
Approach cards: Mint · Freeze · Derive · Check
Worked example: runner has Read[tests/**] and Exec[pytest], patcher has Write[src/target.py], injected runner Write[src/auth/keys.py] is BLOCKED
Evaluation factors: 5 repair tasks · 5 injection surfaces · 4 policy conditions · 3 trials per cell
Headline: CapScope 3/75 attacks, strongest global baseline 33/75 attacks, both 68/75 repairs
Citation key: bouras2026capscope
Authors: Dimitrios Stamatios Bouras · Yihan Dai · Sergey Mechtaev
```

Use `paper.pdf`, `slides.pdf`, and `https://github.com/msv-lab/CapScope` for the three primary actions. Use the author emails specified in the design. Preserve `<main id="main-content">`, the skip link, meaningful section IDs, and accessible labels for the authorization example.

- [ ] **Step 2: Adapt the Gordian stylesheet**

Copy `/home/jim/gordian/website/styles.css` as the baseline. Retain its root palette, typography, header, hero, section, citation, people, footer, responsive, dark-mode, focus, and reduced-motion rules. Replace three-column Gordian-only example rules with:

```css
.mechanism-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.mechanism-card { min-height: 250px; padding: 25px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.mechanism-number { display: block; margin-bottom: 28px; color: var(--amber); font-family: var(--mono); font-size: 0.77rem; }
.authority-flow { display: grid; grid-template-columns: 1fr 72px 1fr; gap: 16px; align-items: center; padding: 29px; }
.authority-store { min-height: 230px; padding: 22px; border: 1px solid var(--line); border-radius: 11px; background: var(--surface); }
.authority-store code { display: block; margin-top: 9px; font-family: var(--mono); font-size: 0.78rem; }
.blocked-call { grid-column: 1 / -1; padding: 16px 20px; border-left: 3px solid var(--amber); background: var(--amber-wash); }
```

At `max-width: 820px`, set `.mechanism-grid` to two columns and `.authority-flow` to one. At `max-width: 610px`, set `.mechanism-grid` and `.people-grid` to one column.

- [ ] **Step 3: Add progressive enhancement**

Copy the Gordian `script.js` scroll progress, citation copy, and reveal observer logic. Remove artifact-dialog handling because the artifact is already public. Keep optional chaining so missing enhancement targets never prevent the page from rendering.

- [ ] **Step 4: Run focused checks**

Run:

```bash
node --check script.js
rg -n "Gordian|ISSTA|2603\.19239" index.html styles.css script.js
```

Expected: JavaScript exits 0 and `rg` returns no matches.

- [ ] **Step 5: Commit the page**

```bash
git add index.html styles.css script.js
git commit -m "feat: build concise CapScope paper website"
```

### Task 4: Add GitHub Pages deployment and documentation

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`

- [ ] **Step 1: Create the Pages workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy static site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload site
        uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Document preview, tests, and deployment**

Create `README.md` naming the paper, source-of-truth files, public artifact repository, `python3 -m http.server 8080` preview command, `npm test` contract command, and the GitHub Pages setting requirement: deployment source must be **GitHub Actions**.

- [ ] **Step 3: Run the full contract**

Run: `npm test`

Expected: 4 tests pass, 0 fail.

- [ ] **Step 4: Commit deployment support**

```bash
git add .github/workflows/pages.yml README.md
git commit -m "ci: deploy CapScope site to GitHub Pages"
```

### Task 5: Verify the finished site

**Files:**
- Verify all files above

- [ ] **Step 1: Run static verification**

Run:

```bash
npm test
node --check script.js
git diff --check
```

Expected: 4 tests pass, JavaScript syntax succeeds, and no whitespace errors appear.

- [ ] **Step 2: Serve and probe the site**

Run `python3 -m http.server 8080` from the repository root. In a separate command, request `/`, `/paper.pdf`, `/slides.pdf`, and `/assets/capscope-mark.svg` and require HTTP 200 for each.

- [ ] **Step 3: Inspect desktop and mobile rendering**

Open the local page at 1440×900 and 390×844. Confirm the navigation, hero, four-step approach, authorization example, evaluation figures, citation, and three author cards do not overflow or overlap. Confirm the paper, slides, artifact, email, and in-page links target the intended resources.

- [ ] **Step 4: Check the requirement list against the design**

Re-read `docs/superpowers/specs/2026-07-14-capscope-paper-website-design.md` and record any gap before claiming completion. Do not push or enable repository settings; those remain external GitHub actions for the user.
