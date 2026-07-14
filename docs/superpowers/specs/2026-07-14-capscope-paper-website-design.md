# CapScope Paper Website Design

## Goal

Create a concise project website for *Authority Is Not a String: A Capability-Scoped Harness for Prompt-Injection-Resistant Coding Agents*, submitted to the LMPL Workshop 2026. The site will closely preserve the visual system and interaction patterns of the existing Gordian paper website while replacing all research-specific content with CapScope material.

## Source of Truth

The supplied `capscope.tex` is authoritative for technical claims and evaluation results. The supplied paper and presentation PDFs provide the downloadable public documents. The supplied CapScope SVG is the primary site mark. Author details come from the user and the existing Gordian paper metadata:

- Dimitrios Stamatios Bouras — `2501112125@stu.pku.edu.cn`
- Yihan Dai — `2501112020@stu.pku.edu.cn`
- Sergey Mechtaev — `mechtaev@pku.edu.cn`, corresponding author
- Affiliation: Key Laboratory of High Confidence Software Technologies (PKU), Ministry of Education, School of Computer Science, Peking University, Beijing, China

The page will describe the paper as “Submitted to LMPL 2026,” not accepted or published.

## Visual and Interaction Design

The site will retain the Gordian page’s serif-led editorial typography, blue and amber palette, light/dark color schemes, sticky navigation, reading-progress bar, responsive grids, reveal transitions, accessible skip link, focus styles, and BibTeX copy interaction. CapScope’s supplied logo will replace the Gordian mark throughout. The layout will remain recognizably the same template, but long worked examples will be reduced to a single compact authorization example.

The site will be usable without JavaScript. JavaScript adds only scroll progress, reveal effects, and citation copying. Reduced-motion preferences will be respected.

## Information Architecture

### Hero

The hero introduces CapScope with the workshop-submission status, full paper title, a one-sentence description, all three authors, and direct links to the local paper PDF, local presentation PDF, and the public GitHub artifact repository. A side note summarizes the central idea: text may influence a request, but it cannot create authority.

### Abstract

A short paragraph will summarize ambient authority, indirect prompt injection, harness-held typed capabilities, per-agent scoping, and dispatch-time enforcement. It will be derived from the paper without reproducing the full abstract.

### Approach

Four compact cards will describe the mechanism:

1. Mint a task-wide ceiling from trusted input.
2. Freeze authority before untrusted content is read.
3. Derive narrower stores when work is delegated.
4. Check every proposed effect at dispatch.

A single worked example will contrast a runner and patcher. The runner may execute tests but cannot write source, so an injected write request is denied even though the patcher legitimately holds narrow source-write authority.

### Evidence

The evaluation section will show the factorial design—five repair tasks, five injection surfaces, four authorization conditions, and three trials per cell, totaling 300 runs. It will highlight only the core results appropriate for a concise workshop page:

- CapScope: 3/75 attacks executed and 68/75 repairs completed.
- Strongest global baseline: 33/75 attacks executed and 68/75 repairs completed.

The runtime trade-off may be stated briefly as a mean of 316 seconds and median of 208 seconds for CapScope.

### Citation

The page will provide a provisional 2026 workshop-submission BibTeX entry with all three authors, the full title, LMPL Workshop 2026, and the artifact URL. It will explicitly say the entry should be replaced when archival proceedings metadata becomes available.

### People and Footer

Three compact author cards will provide names, roles, affiliation context, and email links. Existing verified public profile links for Dimitrios and Sergey may be retained from the Gordian website; no profile URL will be invented for Yihan. The footer will repeat the project mark, short title, and artifact link.

## Files and Deployment

The site will remain dependency-free and deploy directly from the repository root:

- `index.html` — semantic page content and metadata
- `styles.css` — adapted Gordian visual system and CapScope-specific compact layouts
- `script.js` — progressive enhancement for progress, reveals, and citation copying
- `assets/capscope-mark.svg` — supplied logo adapted as the site mark
- `paper.pdf` — public paper download copied from the supplied paper PDF
- `slides.pdf` — presentation download copied from the supplied slide deck
- `.github/workflows/pages.yml` — GitHub Pages artifact upload and deployment
- `README.md` — local preview and deployment instructions

The workflow will trigger on pushes to `main` and manual dispatch, configure GitHub Pages, upload the repository root as the static artifact while excluding Git metadata, and deploy with the official Pages actions.

## Validation

Validation will cover:

- No remaining Gordian names, links, claims, or asset references.
- All local document and asset links resolve.
- All artifact, email, and navigation links are correct.
- Evaluation values match `capscope.tex`.
- HTML structure and accessibility landmarks are present.
- JavaScript parses successfully.
- GitHub Actions workflow parses as YAML and uses the required Pages permissions.
- The page serves successfully from a local static HTTP server at desktop and narrow viewport widths.

No package manager, build system, analytics, backend, or additional feature is required.
