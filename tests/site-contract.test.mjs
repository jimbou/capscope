import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("page contains the approved CapScope content", async () => {
  const html = await read("index.html");
  const required = [
    "CapScope",
    "CapScope:",
    "Accepted at LMPL 2026",
    "Authority Is Not a String",
    "A Capability-Scoped Harness for Prompt-Injection-Resistant Coding Agents",
    "Dimitrios Stamatios Bouras",
    "Yihan Dai",
    "Sergey Mechtaev",
    "Mint",
    "Freeze",
    "Derive",
    "Check",
    "300",
    "3/75",
    "33/75",
    "68/75",
    "https://github.com/msv-lab/CapScope",
    "2501112125@stu.pku.edu.cn",
    "https://scholar.google.com/citations?user=SAT5NjIAAAAJ&amp;hl=en",
    "2501112020@stu.pku.edu.cn",
    "https://scholar.google.com/citations?user=Ra2pxQUAAAAJ&amp;hl=en",
    "mechtaev@pku.edu.cn"
  ];

  for (const value of required) {
    assert.match(html, new RegExp(escapeRegex(value)));
  }
  assert.doesNotMatch(html, /Gordian|ISSTA|Under submission|2603\.19239/i);
});

test("page exposes the paper and required site assets without a slides link", async () => {
  const html = await read("index.html");
  const mark = await read("assets/capscope-mark.svg");
  const publicFiles = [
    "paper.pdf",
    "styles.css",
    "script.js",
    "assets/capscope-mark.svg"
  ];

  for (const path of publicFiles) {
    assert.match(html, new RegExp(escapeRegex(path)));
    await access(new URL(path, root));
  }
  assert.doesNotMatch(html, /href=["']slides\.pdf["']/);
  assert.doesNotMatch(mark, /<rect[^>]+fill=["']#fff["']/i);
});

test("page keeps the template accessibility and interaction hooks", async () => {
  const html = await read("index.html");
  const script = await read("script.js");

  for (const value of ["skip-link", "main-content", "scroll-progress", "copy-cite", "bibtex"]) {
    assert.match(html, new RegExp(value));
  }
  assert.match(html, /<img class="principle-mark" src="assets\/capscope-mark\.svg" alt="">/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /navigator\.clipboard/);
  assert.match(script, /prefers-reduced-motion/);
});

test("Pages workflow deploys only the staged public site", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  const readme = await read("README.md");

  for (const value of [
    "pages: write",
    "id-token: write",
    "actions/configure-pages",
    "Prepare public site",
    "cp index.html styles.css script.js paper.pdf _site/",
    "actions/upload-pages-artifact",
    "path: _site",
    "actions/deploy-pages"
  ]) {
    assert.match(workflow, new RegExp(escapeRegex(value)));
  }
  assert.doesNotMatch(workflow, /path: \.$|slides\.pdf|capscope\.tex|docs\//m);
  assert.match(readme, /accepted at the LMPL Workshop 2026/i);
  assert.doesNotMatch(readme, /under submission/i);
});
