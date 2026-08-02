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
    return { ...data, bodyHtml: marked.parse(content) };
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
  return `
      <a class="case-study-card" href="case-studies/${cs.slug}.html">
        <div class="card-tags">${tags}</div>
        <h3>${escapeHtml(cs.title)}</h3>
        <p>${escapeHtml(cs.summary || "")}</p>
      </a>`;
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
  const accItems = accomplishments.map(accomplishmentItem).join("\n");

  const body = `
  <div class="wrap">
    <header class="hero" id="about">
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
      ${cards}
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
    ? `<img class="cover-image" src="../${cs.cover_image.replace(/^\//, "")}" alt="${escapeHtml(cs.title)}">`
    : "";

  const tags = (cs.tags || [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join(" ");

  const body = `
  <div class="wrap case-study-detail">
    <a class="back" href="../index.html#case-studies">&larr; Back to portfolio</a>

    <div class="card-tags">${tags}</div>
    <h1>${escapeHtml(cs.title)}</h1>
    <p class="meta">${escapeHtml(cs.role || "")}${cs.timeframe ? " · " + escapeHtml(cs.timeframe) : ""}${cs.company ? " · " + escapeHtml(cs.company) : ""}</p>
    ${cover}
    <div class="metrics-row">${metricsRow}</div>

    ${cs.bodyHtml}
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
