# CapScope — project website

The public research page for *Authority Is Not a String: A Capability-Scoped Harness for Prompt-Injection-Resistant Coding Agents*, currently under submission.

`capscope.tex` is the source of truth for paper claims and evaluation results. `paper.pdf` provides a stable public link to the supplied paper. Code, tasks, and evaluation artifacts are available in the [CapScope repository](https://github.com/msv-lab/CapScope).

## Preview locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. Run `npm test` to check the public-page contract and GitHub Pages workflow.

## Deployment

`.github/workflows/pages.yml` publishes the repository root after relevant commits reach `main`. In the repository’s GitHub Pages settings, select **GitHub Actions** as the build and deployment source.
