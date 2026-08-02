# Brandon Saltzman — Portfolio

Case studies, problem statements, rationale, and a running list of accomplishments/metrics
for job applications.

Content lives as plain Markdown/YAML files in `content/`. A small build script (`build.js`)
turns that into the static site in `_site/`, which GitHub Actions builds and deploys to
GitHub Pages automatically on every push to `main`.

**Live site:** https://clubroomex.github.io/brandon-saltzman-portfolio/

## Editing content (no HTML required)

### Add a new case study

1. Copy `content/case-studies/clubhouse-exchange.md` to `content/case-studies/your-project-slug.md`
2. Update the frontmatter (top block between `---`):
   - `title`, `slug` (must match the filename), `order` (controls sort order on the homepage)
   - `company`, `role`, `timeframe`, `tags`
   - `summary` — the one-line teaser shown on the homepage card
   - `metrics` — the stat row at the top of the case study (`value` + `label` pairs)
   - `cover_image` — optional, path to a hero image (see below)
3. Write the body in Markdown using `##` headings. The standard structure that reads
   well to hiring managers is:
   - `## Problem Statement` — what was broken/underserved, and how you knew it was real
   - `## Rationale` — why this problem, why this approach over alternatives
   - `## Approach` — what you actually did (bullets are fine — be concrete about decisions and tradeoffs)
   - `## Outcome` — what changed, in numbers where possible
4. Add a card for it — nothing to do here, actually: the homepage's case study list is
   generated automatically from every file in `content/case-studies/`.

### Add images

Drop image files into `content/case-studies/images/<your-slug>/`. Three ways to use them:

- Inline in the Markdown body:

  ```md
  ![Seller Hub dashboard](/assets/case-studies/images/your-slug/screenshot.png)
  ```

- `cover_image` in frontmatter for a hero image at the top of the page:

  ```yaml
  cover_image: case-studies/images/your-slug/cover.png
  ```

- `gallery` in frontmatter for a captioned image set (renders below the metrics row):

  ```yaml
  gallery:
    - src: case-studies/images/your-slug/screenshot-1.png
      alt: "Seller Hub dashboard"
      caption: "The seller workflow for creating and managing listings"
    - src: case-studies/images/your-slug/screenshot-2.png
      alt: "Mobile experience"
      caption: "The same experience translated to mobile"
  ```

### Add your photo

Drop a headshot into `assets/` and set `photo: assets/your-photo.jpg` in `content/site.yaml`
— it renders as a circular avatar above your name.

### Add an accomplishment

Add an entry to `content/accomplishments.yaml`:

```yaml
- metric: "$50K"
  description: "GMV processed in the first 90 days"
  date: "2026"
```

`metric` is optional — omit it for lines without a hard number.

### Edit your bio, skills, or links

All in `content/site.yaml` — name, role, summary, bio, skills chips, and the link row
(email, LinkedIn, GitHub, resume, etc).

### Add a resume

Drop `resume.pdf` into `assets/` — it's copied into the built site automatically and the
"Resume" link in `content/site.yaml` already points at it.

## Local preview

```
npm install        # first time only
npm run preview     # builds + serves _site/ locally
```

Or just build without serving:

```
npm run build       # outputs to _site/
```

`_site/` is gitignored — it's a build artifact, not something you edit or commit.

## Deploy

Push to `main`. The `.github/workflows/deploy.yml` workflow builds the site and publishes
it to GitHub Pages automatically — nothing to run manually.

## Structure

```
content/
  site.yaml               # name, bio, skills, links
  accomplishments.yaml     # running metrics/accomplishments list
  case-studies/
    *.md                   # one file per project
    images/<slug>/         # images for that case study
assets/
  style.css                # shared styling (light/dark aware)
build.js                    # generates _site/ from content/
.github/workflows/deploy.yml # CI build + GitHub Pages deploy
```
