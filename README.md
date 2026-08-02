# Brandon Saltzman — Portfolio

Personal portfolio site: case studies, problem statements, rationale, and a running list
of accomplishments/metrics for job applications.

Plain HTML/CSS, no build step, deployed via GitHub Pages.

## Structure

- `index.html` — home page: intro, case study list, accomplishments/metrics
- `case-studies/` — one HTML file per project
- `case-studies/_template.html` — copy this to start a new case study
- `assets/style.css` — shared styling (light/dark aware)

## Adding a case study

1. Copy `case-studies/_template.html` to `case-studies/your-project-slug.html`
2. Fill in Problem Statement / Rationale / Approach / Outcome and the metrics row
3. Add a `.case-study-card` link to it in `index.html` under "Case Studies"

## Adding an accomplishment

Add a single `<li>` to the `.accomplishments` list in `index.html`. Lead with the metric
when there's a hard number, e.g.:

```html
<li>
  <span><span class="metric">$50K</span> GMV processed in first 90 days</span>
  <span class="date">2026</span>
</li>
```

## Local preview

No build step — just open `index.html` in a browser, or serve it:

```
python3 -m http.server 8000
```

## Deploy

Pushed to `main` on GitHub, served via GitHub Pages (Settings → Pages → Deploy from branch → `main` / `root`).
