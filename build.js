// Static site generator for the portfolio.
// Reads content/*.yaml + content/case-studies/*.md, renders HTML into _site/.
// Run with `npm run build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import yaml from "js-yaml";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "_site");

function readYaml(file) {
  return yaml.load(fs.readFileSync(path.join(CONTENT, file), "utf8"));
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Normalizes a content-authored path (e.g. "assets/x.png" or
// "case-studies/images/slug/x.png") into a URL relative to the page being
// rendered, given that page's path prefix ("" for root, "../" for a case study).
function resolveAssetUrl(value, prefix = "") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;

  const cleaned = String(value).trim().replace(/^\/+/, "");
  if (cleaned.startsWith("assets/")) return `${prefix}${cleaned}`;
  if (cleaned.startsWith("case-studies/")) return `${prefix}assets/${cleaned}`;
  return `${prefix}${cleaned}`;
}

function normalizeGalleryEntry(entry, fallbackTitle) {
  if (typeof entry === "string") {
    return { src: entry, alt: fallbackTitle, caption: "" };
  }
  if (entry && typeof entry === "object") {
    return {
      src: entry.src || entry.path || entry.image || entry.url || "",
      alt: entry.alt || fallbackTitle,
      caption: entry.caption || entry.title || "",
    };
  }
  return null;
}

// Turns a category label like "Growth & RevOps" into a CSS-safe token
// ("growth-and-revops") used for both the filter input id and the card's
// data-cat attribute.
function slugifyCategory(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fixed display order for the homepage filter row; any category not listed
// here (a typo, or a new one someone adds) still appears, just appended
// alphabetically rather than breaking the build.
const CATEGORY_ORDER = ["Founder & 0→1", "Product Strategy", "Growth & RevOps", "Research"];

function categoryList(caseStudies) {
  const present = new Set();
  for (const cs of caseStudies) for (const c of cs.categories || []) present.add(c);
  const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
  const extra = [...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
  return [...ordered, ...extra];
}

// ---- Load content -------------------------------------------------------

const site = readYaml("site.yaml");
const accomplishments = readYaml("accomplishments.yaml") || [];

const caseStudyDir = path.join(CONTENT, "case-studies");
const caseStudies = fs
  .readdirSync(caseStudyDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(caseStudyDir, file), "utf8");
    const { data, content } = matter(raw);
    if (!data.slug) throw new Error(`${file}: missing "slug" in frontmatter`);
    const phases = (data.phases || []).map((p) => ({
      ...p,
      bodyHtml: marked.parse(p.body || ""),
    }));
    return { ...data, phases, bodyHtml: marked.parse(content) };
  })
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

// ---- Templates ------------------------------------------------------------

function nav(prefix, activeHref) {
  const items = [
    { href: `${prefix}index.html#about`, label: "About" },
    { href: `${prefix}index.html#case-studies`, label: "Case Studies" },
    { href: `${prefix}index.html#accomplishments`, label: "Accomplishments" },
    { href: `${prefix}index.html#contact`, label: "Contact" },
  ];
  const links = items
    .map(
      (i) =>
        `<li><a class="nav-link${i.href === activeHref ? " active" : ""}" href="${i.href}">${i.label}</a></li>`
    )
    .join("");
  return `
  <nav class="site-nav">
    <div class="wrap">
      <a class="brand" href="${prefix}index.html">${escapeHtml(site.name)}</a>
      <ul>${links}</ul>
    </div>
  </nav>`;
}

function layout({ title, description, prefix, activeHref, bodyHtml, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="stylesheet" href="${prefix}assets/style.css">
  ${extraHead}
</head>
<body>
  ${nav(prefix, activeHref)}
  ${bodyHtml}
</body>
</html>
`;
}

function caseStudyCard(cs) {
  const tags = (cs.tags || [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");
  const cats = (cs.categories || []).map(slugifyCategory).join(" ");
  return `
      <a class="case-study-card" data-cat="${escapeHtml(cats)}" href="case-studies/${cs.slug}.html">
        <div class="card-tags">${tags}</div>
        <h3>${escapeHtml(cs.title)}</h3>
        <p>${escapeHtml(cs.summary || "")}</p>
      </a>`;
}

// Pure-CSS filter chips: a flat run of hidden radios + their labels + the
// card grid, all siblings under one flex container, so `:checked ~` alone
// can both style the active chip and hide non-matching cards — no JS.
function filterBar(caseStudies, cardsHtml) {
  const cats = categoryList(caseStudies);
  if (!cats.length) return `<div class="card-grid">${cardsHtml}</div>`;

  const inputs = [`<input type="radio" name="cs-filter" id="filter-all" checked hidden>`]
    .concat(
      cats.map((c) => `<input type="radio" name="cs-filter" id="filter-${slugifyCategory(c)}" hidden>`)
    )
    .join("\n    ");

  const labels = [`<label class="filter-chip" for="filter-all">All</label>`]
    .concat(
      cats.map((c) => `<label class="filter-chip" for="filter-${slugifyCategory(c)}">${escapeHtml(c)}</label>`)
    )
    .join("\n    ");

  const activeSelectors = ["#filter-all:checked ~ label[for=\"filter-all\"]"]
    .concat(cats.map((c) => `#filter-${slugifyCategory(c)}:checked ~ label[for="filter-${slugifyCategory(c)}"]`))
    .join(",\n    ");

  const hideRules = cats
    .map(
      (c) =>
        `#filter-${slugifyCategory(c)}:checked ~ .card-grid .case-study-card:not([data-cat~="${slugifyCategory(c)}"]) { display: none; }`
    )
    .join("\n    ");

  // inputs, labels, and .card-grid must all be direct children of the same
  // flex parent — that's what lets `#filter-x:checked ~ .card-grid` and
  // `#filter-x:checked ~ label[for="filter-x"]` work with zero JS. Visual
  // grouping (chips on one row, grid below) comes from flex-wrap + the
  // grid's flex-basis:100%, not from nesting.
  return `
    <style>
    ${activeSelectors} { background: var(--accent); border-color: var(--accent); color: #fff; }
    ${hideRules}
    </style>
    <div class="filter-bar">
    ${inputs}
    ${labels}
    <div class="card-grid">${cardsHtml}</div>
    </div>`;
}

function accomplishmentItem(a) {
  const metric = a.metric ? `<span class="metric">${escapeHtml(a.metric)}</span> ` : "";
  return `
        <li>
          <span>${metric}${escapeHtml(a.description)}</span>
          <span class="date">${escapeHtml(a.date || "")}</span>
        </li>`;
}

function renderIndex() {
  const links = (site.links || [])
    .map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`)
    .join("\n        ");
  const skills = (site.skills || [])
    .map((s) => `<span class="chip">${escapeHtml(s)}</span>`)
    .join("");
  const cards = caseStudies.map(caseStudyCard).join("\n");
  const caseStudySection = filterBar(caseStudies, cards);
  const accItems = accomplishments.map(accomplishmentItem).join("\n");

  const photo = site.photo
    ? `<img class="avatar" src="${resolveAssetUrl(site.photo, "")}" alt="${escapeHtml(site.name)}">`
    : "";

  const body = `
  <div class="wrap">
    <header class="hero" id="about">
      ${photo}
      <h1>${escapeHtml(site.name)}</h1>
      <p class="role">${escapeHtml(site.role)}</p>
      <p class="summary">${escapeHtml(site.summary || "").trim()}</p>
      <div class="links">
        ${links}
      </div>
    </header>

    <section id="about-bio">
      <h2 class="section-heading">About</h2>
      <p class="about-bio">${escapeHtml(site.bio || "").trim()}</p>
      <div class="chip-row">${skills}</div>
    </section>

    <section id="case-studies">
      <h2 class="section-heading">Case Studies</h2>
      ${caseStudySection}
    </section>

    <section id="accomplishments">
      <h2 class="section-heading">Accomplishments &amp; Metrics</h2>
      <ul class="accomplishments">
        ${accItems}
      </ul>
    </section>

    <section id="contact">
      <h2 class="section-heading">Contact</h2>
      <p>Open to new opportunities and always happy to talk shop about product and marketplaces.</p>
      <a class="contact-cta" href="mailto:${escapeHtml(site.email)}">Get in touch</a>
    </section>

    <footer class="site-footer">
      Last updated ${escapeHtml(site.last_updated || "")} · <a href="mailto:${escapeHtml(site.email)}" style="color: inherit;">${escapeHtml(site.email)}</a>
    </footer>
  </div>`;

  return layout({
    title: `${site.name} — Portfolio`,
    description: site.summary || "",
    prefix: "",
    activeHref: "index.html#about",
    bodyHtml: body,
  });
}

// Pure-CSS tab stepper: same flat-siblings-under-one-flex-parent trick as
// filterBar() — hidden radios + labels + panels all direct children of
// .phase-stepper, so `:checked ~` can style the active step and show its
// panel with zero JS. First phase is selected by default.
function phaseStepper(phases) {
  const inputs = phases
    .map((p, i) => `<input type="radio" name="phase" id="phase-${p.id}" ${i === 0 ? "checked" : ""} hidden>`)
    .join("\n    ");

  const labels = phases
    .map(
      (p, i) => `
      <label class="step" for="phase-${p.id}">
        <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="step-label">${escapeHtml(p.label)}</span>
      </label>`
    )
    .join("");

  const panels = phases
    .map((p) => `<div class="phase-panel" data-phase="phase-${p.id}">${p.bodyHtml}</div>`)
    .join("\n    ");

  const activeSelectors = phases
    .map((p) => `#phase-${p.id}:checked ~ label[for="phase-${p.id}"]`)
    .join(",\n    ");

  const panelSelectors = phases
    .map((p) => `#phase-${p.id}:checked ~ .phase-panel[data-phase="phase-${p.id}"] { display: block; }`)
    .join("\n    ");

  return `
  <style>
    ${activeSelectors} { background: var(--accent); border-color: var(--accent); color: #fff; }
    ${panelSelectors}
  </style>
  <div class="phase-stepper">
    ${inputs}
    ${labels}
    ${panels}
  </div>`;
}

function renderCaseStudy(cs) {
  const metricsRow = (cs.metrics || [])
    .map(
      (m) => `
        <div class="stat">
          <div class="value">${escapeHtml(String(m.value))}</div>
          <div class="label">${escapeHtml(m.label)}</div>
        </div>`
    )
    .join("");

  const cover = cs.cover_image
    ? `<img class="cover-image" src="${resolveAssetUrl(cs.cover_image, "../")}" alt="${escapeHtml(cs.title)}">`
    : "";

  const galleryItems = (cs.gallery || [])
    .map((entry) => normalizeGalleryEntry(entry, cs.title))
    .filter((entry) => entry && entry.src);

  const gallery = galleryItems.length
    ? `<div class="case-study-gallery">
        ${galleryItems
          .map(
            (item) => `
          <figure class="gallery-item">
            <img src="${resolveAssetUrl(item.src, "../")}" alt="${escapeHtml(item.alt || cs.title)}" loading="lazy">
            ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
          </figure>`
          )
          .join("")}
      </div>`
    : "";

  const tags = (cs.tags || [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join(" ");

  // A case study with `phases` in its frontmatter gets a stepper instead of
  // one long scroll — the markdown body (if any) becomes a short intro above
  // it. A case study with no phases renders exactly as before.
  const hasPhases = cs.phases && cs.phases.length;
  const introHtml = hasPhases && cs.bodyHtml && cs.bodyHtml.trim() ? cs.bodyHtml : "";
  const mainContent = hasPhases ? introHtml + phaseStepper(cs.phases) : cs.bodyHtml;

  const body = `
  <div class="wrap case-study-detail">
    <a class="back" href="../index.html#case-studies">&larr; Back to portfolio</a>

    <div class="card-tags">${tags}</div>
    <h1>${escapeHtml(cs.title)}</h1>
    <p class="meta">${escapeHtml(cs.role || "")}${cs.timeframe ? " · " + escapeHtml(cs.timeframe) : ""}${cs.company ? " · " + escapeHtml(cs.company) : ""}</p>
    ${cover}
    <div class="metrics-row">${metricsRow}</div>
    ${gallery}

    ${mainContent}
  </div>`;

  return layout({
    title: `${cs.title} — ${site.name}`,
    description: cs.summary || "",
    prefix: "../",
    activeHref: "../index.html#case-studies",
    bodyHtml: body,
  });
}

// ---- Write output ---------------------------------------------------------

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "case-studies"), { recursive: true });

fs.writeFileSync(path.join(OUT, "index.html"), renderIndex());

for (const cs of caseStudies) {
  fs.writeFileSync(path.join(OUT, "case-studies", `${cs.slug}.html`), renderCaseStudy(cs));
}

copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
copyDir(path.join(CONTENT, "case-studies", "images"), path.join(OUT, "assets", "case-studies", "images"));

console.log(`Built ${1 + caseStudies.length} pages to _site/`);
