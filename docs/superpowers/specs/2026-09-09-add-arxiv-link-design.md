# Add arXiv Link Design

## Goal

Expose CapScope's public arXiv record at `https://arxiv.org/abs/2609.08371` without removing the existing local PDF download.

## Design

The page will retain every `paper.pdf` link as the downloadable local-paper route. It will add a clearly labelled external arXiv link alongside the primary paper actions and in the citation area, using the existing external-link target and `rel` conventions. The existing contract test will require the canonical arXiv URL, preventing it from being inadvertently removed.

## Scope

Modify only `index.html` and `tests/site-contract.test.mjs`. No visual-system, paper-content, or deployment changes are required.

## Verification

Run `npm test` and confirm all Node contract tests pass.
