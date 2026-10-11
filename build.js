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

const warnings = [];
const warn = (msg) => warnings.push(msg);

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
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const isTodo = (value) => /\bTODO\b/.test(String(value ?? ""));

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

// Gallery images get a browser-window frame by default (they're nearly all
// product screenshots); `frame: phone` gives a phone mockup, `frame: none` a
// plain image.
function normalizeGalleryEntry(entry, fallbackTitle) {
  if (typeof entry === "string") {
    return { src: entry, alt: fallbackTitle, caption: "", frame: "browser", url: "" };
  }
  if (entry && typeof entry === "object") {
    return {
      src: entry.src || entry.path || entry.image || "",
      alt: entry.alt || fallbackTitle,
      caption: entry.caption || entry.title || "",
      frame: entry.frame || "browser",
      url: entry.url || "",
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

// Links with a TODO url, or relative links to files that don't exist yet, are
// left off the live site instead of 404ing.
function isLiveLink(link) {
  if (isTodo(link.url)) {
    warn(`site.yaml: hiding "${link.label}" link (url still has a TODO)`);
    return false;
  }
  if (!/^(https?:|mailto:)/i.test(link.url) && !fs.existsSync(path.join(ROOT, link.url))) {
    warn(`site.yaml: hiding "${link.label}" link (${link.url} not found)`);
    return false;
  }
  return true;
}

// Renders a markdown body, numbering its `##` headings and collecting them for
// the case study's table of contents.
function renderBody(content) {
  const sections = [];
  const renderer = new marked.Renderer();
  renderer.heading = (text, level, raw) => {
    if (level !== 2) return `<h${level}>${text}</h${level}>`;
    const id = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    sections.push({ id, label: raw });
    const num = String(sections.length).padStart(2, "0");
    return `<h2 id="${id}"><span class="section-num">${num}</span>${text}</h2>`;
  };
  return { html: marked.parse(content, { renderer }), sections };
}

// ---- Load content -------------------------------------------------------

const site = readYaml("site.yaml");
const liveLinks = (site.links || []).filter(isLiveLink);
const accomplishments = (readYaml("accomplishments.yaml") || []).map((a) => ({
  ...a,
  detailHtml: a.detail ? marked.parse(a.detail) : "",
}));

const caseStudyDir = path.join(CONTENT, "case-studies");
const caseStudies = fs
  .readdirSync(caseStudyDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(caseStudyDir, file), "utf8");
    const { data, content } = matter(raw);
    if (!data.slug) throw new Error(`${file}: missing "slug" in frontmatter`);
    const metrics = (data.metrics || []).filter((m) => {
      if (isTodo(m.value)) warn(`${file}: hiding metric "${m.label}" (value is TODO)`);
      return !isTodo(m.value);
    });
    const phases = (data.phases || []).map((p) => ({
      ...p,
      bodyHtml: marked.parse(p.body || ""),
    }));
    const { html, sections } = renderBody(content);
    // `headline_metric: 2` picks which metric (1-based) leads on the homepage card.
    const headline = metrics[(data.headline_metric || 1) - 1] || metrics[0];
    return { ...data, metrics, headline, phases, sections, bodyHtml: html };
  })
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

// ---- Graphics -------------------------------------------------------------

const ICONS = {
  search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  compass: `<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>`,
  build: `<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>`,
  chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>`,
  external: `<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`,
  file: `<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>`,
};

function icon(name, cls = "icon") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

// Topographic contour lines, like the slope map of a green. Decorative only.
function contours(cls = "contours") {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => {
      const rx = 60 + i * 46;
      const ry = 38 + i * 30;
      const rot = -12 + i * 3;
      return `<ellipse cx="320" cy="300" rx="${rx}" ry="${ry}" transform="rotate(${rot} 320 300) translate(${i * 6} ${-i * 4})"/>`;
    })
    .join("");
  return `<svg class="${cls}" viewBox="0 0 640 600" fill="none" stroke="currentColor" aria-hidden="true">${rings}</svg>`;
}

function framed(img, { frame, url = "" }) {
  if (frame === "phone") {
    return `<div class="device-phone"><div class="device-notch"></div>${img}</div>`;
  }
  if (frame === "browser") {
    const shownUrl = url.replace(/^https?:\/\/(www\.)?/, "");
    return `<div class="device-browser">
          <div class="browser-bar"><span></span><span></span><span></span>${shownUrl ? `<div class="browser-url">${escapeHtml(shownUrl)}</div>` : ""}</div>
          ${img}
        </div>`;
  }
  return img;
}

const toneOf = (cs) => slugifyCategory((cs.categories || [])[0] || "default");

// ---- Templates ------------------------------------------------------------

function nav(prefix, activeHref) {
  const items = [
    { href: `${prefix}index.html#case-studies`, label: "Work" },
    { href: `${prefix}index.html#accomplishments`, label: "Results" },
    { href: `${prefix}index.html#about`, label: "About" },
  ];
  const links = items
    .map(
      (i) =>
        `<li><a class="nav-link${i.href === activeHref ? " active" : ""}" href="${i.href}">${i.label}</a></li>`
    )
    .join("");
  const initials = site.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  return `
  <nav class="site-nav">
    <div class="wrap wide">
      <a class="brand" href="${prefix}index.html"><span class="monogram">${escapeHtml(initials)}</span><span class="brand-name">${escapeHtml(site.name)}</span></a>
      <ul>${links}</ul>
      <a class="btn btn-small" href="${prefix}index.html#contact">Contact</a>
    </div>
  </nav>`;
}

function linkHref(l, prefix) {
  return /^(https?:|mailto:)/i.test(l.url) ? l.url : prefix + l.url;
}

function linkAttrs(l) {
  return /^mailto:/i.test(l.url) ? "" : ' target="_blank" rel="noopener"';
}

function footer(prefix) {
  const links = liveLinks
    .map((l) => `<a href="${escapeHtml(linkHref(l, prefix))}"${linkAttrs(l)}>${escapeHtml(l.label)}</a>`)
    .join("");
  return `
  <footer class="site-footer">
    <div class="wrap wide">
      <span>© ${new Date().getFullYear()} ${escapeHtml(site.name)} · Last updated ${escapeHtml(site.last_updated || "")}</span>
      <div class="footer-links">${links}</div>
    </div>
  </footer>`;
}

// Fire-and-forget view/click beacon to the internal admin dashboard (see
// chex-dashboard's /api/portfolio-events + /portfolio page). Reads a `?ref=`
// query param off the first link a recipient opens (e.g. `?ref=acme-corp`,
// generated from the dashboard's "tracked link" panel) so views/clicks can
// be attributed to a specific recruiter/company, not just an anonymous
// session. No cookies, no third-party script — just one small inline block.
const TRACKING_SCRIPT = `
  <script>
  (function () {
    var ENDPOINT = "https://chex-dashboard.vercel.app/api/portfolio-events";
    var params = new URLSearchParams(window.location.search);
    var ref = params.get("ref");
    if (ref) { try { sessionStorage.setItem("chex_ref", ref); } catch (e) {} }
    var storedRef = null;
    try { storedRef = sessionStorage.getItem("chex_ref"); } catch (e) {}

    var sid;
    try {
      sid = sessionStorage.getItem("chex_sid");
      if (!sid) {
        sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + "-" + Math.random().toString(16).slice(2));
        sessionStorage.setItem("chex_sid", sid);
      }
    } catch (e) {
      sid = Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    function send(eventType, target) {
      var payload = JSON.stringify({
        event_type: eventType,
        ref: storedRef,
        session_id: sid,
        path: window.location.pathname,
        target: target ? String(target).slice(0, 200) : null,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
      });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
          return;
        }
      } catch (e) {}
      try {
        fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
      } catch (e) {}
    }

    send("view");

    document.addEventListener("click", function (evt) {
      var a = evt.target.closest && evt.target.closest("a[href]");
      if (!a) return;
      var label = (a.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80);
      send("click", a.getAttribute("href") + (label ? " — " + label : ""));
    });

    document.addEventListener("change", function (evt) {
      var el = evt.target;
      if (!(el && el.matches && el.matches('input[type="radio"][name="cs-filter"], input[type="radio"][name="phase"]'))) return;
      var lbl = document.querySelector('label[for="' + el.id + '"]');
      var text = lbl ? lbl.textContent.trim() : el.id;
      send("click", (el.name === "cs-filter" ? "filter: " : "phase: ") + text);
    });
  })();
  </script>`;

function layout({ title, description, prefix, activeHref, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#14532d">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2314532d'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23f7d36d'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/style.css">
  <script>document.documentElement.classList.add("js")</script>
  <script defer src="${prefix}assets/site.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(prefix, activeHref)}
  <main id="main">
  ${bodyHtml}
  </main>
  ${footer(prefix)}
  ${TRACKING_SCRIPT}
</body>
</html>
`;
}

function tagList(tags = []) {
  return tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
}

function metricTiles(metrics = []) {
  return metrics
    .map(
      (m) => `
        <div class="stat">
          <div class="value">${escapeHtml(String(m.value))}</div>
          <div class="label">${escapeHtml(m.label || "")}</div>
        </div>`
    )
    .join("");
}

// The visual at the top of each case study card, in order of preference: a
// product screenshot (`hero_image`) in a browser frame, the project's logo
// (`cover_image`) on a tile, or — for work with no imagery — a "poster" built
// from the headline metric.
function cardMedia(cs, featured) {
  if (cs.hero_image) {
    return `<div class="card-media shot" data-tone="${toneOf(cs)}">
          ${framed(`<img src="${resolveAssetUrl(cs.hero_image)}" alt="" loading="lazy">`, { frame: "browser", url: featured ? cs.live_url || "" : "" })}
        </div>`;
  }
  if (cs.cover_image) {
    return `<div class="card-media logo-tile"><img src="${resolveAssetUrl(cs.cover_image)}" alt="" loading="lazy"></div>`;
  }
  const m = cs.headline;
  return `<div class="card-media poster" data-tone="${toneOf(cs)}">
          ${contours("contours poster-contours")}
          <span class="poster-company">${escapeHtml(cs.company || "")}</span>
          ${m ? `<span class="poster-value">${escapeHtml(String(m.value))}</span><span class="poster-label">${escapeHtml(m.label || "")}</span>` : ""}
        </div>`;
}

function caseStudyCard(cs, index) {
  const featured = index === 0;
  const cats = (cs.categories || []).map(slugifyCategory).join(" ");
  // Poster cards already lead with the headline metric; other cards repeat it
  // as a one-line result so every card shows an outcome.
  const m = cs.headline;
  const result =
    !featured && m && (cs.hero_image || cs.cover_image)
      ? `<p class="card-result"><strong>${escapeHtml(String(m.value))}</strong> ${escapeHtml(m.label || "")}</p>`
      : "";
  return `
      <a class="case-study-card${featured ? " featured" : ""} reveal" data-cat="${escapeHtml(cats)}" href="case-studies/${cs.slug}.html">
        ${cardMedia(cs, featured)}
        <div class="card-body">
          <div class="card-tags">${tagList((cs.tags || []).slice(0, featured ? 4 : 3))}</div>
          <h3>${escapeHtml(cs.title)}</h3>
          <p class="card-meta">${escapeHtml([cs.company, cs.timeframe].filter(Boolean).join(" · "))}</p>
          <p>${escapeHtml(cs.summary || "")}</p>
          ${featured && cs.metrics.length ? `<div class="metrics-row compact">${metricTiles(cs.metrics)}</div>` : ""}
          ${result}
          <span class="card-cta">Read case study ${icon("arrow")}</span>
        </div>
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

  const count = (c) => caseStudies.filter((cs) => (cs.categories || []).includes(c)).length;
  const labels = [`<label class="filter-chip" for="filter-all">All <span class="count">${caseStudies.length}</span></label>`]
    .concat(
      cats.map((c) => `<label class="filter-chip" for="filter-${slugifyCategory(c)}">${escapeHtml(c)} <span class="count">${count(c)}</span></label>`)
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
    ${activeSelectors} { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
    ${hideRules}
    </style>
    <div class="filter-bar">
    ${inputs}
    ${labels}
    <div class="card-grid">${cardsHtml}</div>
    </div>`;
}

function accomplishmentCard(a) {
  const metric = a.metric ? `<div class="accomplishment-metric">${escapeHtml(a.metric)}</div>` : "";
  const details = a.detailHtml
    ? `
      <details>
        <summary>More details</summary>
        <div class="accomplishment-detail">${a.detailHtml}</div>
      </details>`
    : "";
  return `
      <div class="accomplishment-card reveal">
        ${metric}
        <div class="accomplishment-body">
          <p>${escapeHtml(a.description)}</p>
          <span class="date">${escapeHtml(a.date || "")}</span>
        </div>
        ${details}
      </div>`;
}

function contactBand(prefix, heading = "Let's build something people actually want.") {
  const resume = liveLinks.find((l) => /resume/i.test(l.label));
  return `
  <section id="contact" class="contact-band">
    ${contours("contours contact-contours")}
    <div class="wrap wide">
      <p class="eyebrow">Contact</p>
      <h2>${escapeHtml(heading)}</h2>
      <p>Open to new opportunities and always happy to talk shop about product, revenue operations and AI.</p>
      <div class="hero-actions">
        <a class="btn btn-light" href="mailto:${escapeHtml(site.email)}">${icon("mail")} ${escapeHtml(site.email)}</a>
        ${resume ? `<a class="btn btn-outline-light" href="${escapeHtml(linkHref(resume, prefix))}" target="_blank" rel="noopener">${icon("file")} Resume</a>` : ""}
        ${prefix ? `<a class="btn btn-outline-light" href="${prefix}index.html#case-studies">More work ${icon("arrow")}</a>` : ""}
      </div>
    </div>
  </section>`;
}

function renderIndex() {
  const links = liveLinks
    .filter((l) => !/^mailto:/i.test(l.url))
    .map((l) => `<a href="${escapeHtml(linkHref(l, ""))}"${linkAttrs(l)}>${escapeHtml(l.label)}</a>`)
    .join("");
  const skills = (site.skills || [])
    .map((s) => `<span class="chip">${escapeHtml(s)}</span>`)
    .join("");
  const highlights = (site.highlights || [])
    .map(
      (h) => `
        <div class="highlight reveal">
          <div class="value">${escapeHtml(h.value)}</div>
          <div class="label">${escapeHtml(h.label)}</div>
        </div>`
    )
    .join("");
  const process = (site.process || [])
    .map(
      (p, i) => `
        <li class="step reveal" style="--i:${i}">
          <div class="step-icon">${icon(p.icon)}</div>
          <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.text)}</p>
        </li>`
    )
    .join("");
  const cards = caseStudies.map(caseStudyCard).join("\n");
  const caseStudySection = filterBar(caseStudies, cards);
  const accItems = accomplishments.map(accomplishmentCard).join("\n");
  const current = caseStudies[0];

  const body = `
  <header class="hero">
    ${contours("contours hero-contours")}
    <div class="wrap wide hero-grid">
      <div class="hero-copy">
        ${site.status ? `<span class="status-pill"><span class="pulse"></span>${escapeHtml(site.status)}</span>` : ""}
        <h1>${escapeHtml(site.name)}</h1>
        <p class="role">${escapeHtml(site.role)}</p>
        <p class="summary">${escapeHtml(site.summary || "").trim()}</p>
        <div class="hero-actions">
          <a class="btn" href="#case-studies">See my work ${icon("arrow")}</a>
          <a class="btn btn-ghost" href="mailto:${escapeHtml(site.email)}">${icon("mail")} Email me</a>
        </div>
        <div class="links">${links}</div>
      </div>
      ${site.photo ? `
      <div class="hero-visual">
        <div class="portrait">
          <img src="${resolveAssetUrl(site.photo)}" alt="Portrait of ${escapeHtml(site.name)}" width="400" height="400">
        </div>
        ${current ? `
        <a class="floating-card" href="case-studies/${current.slug}.html">
          <span class="floating-label">Currently building</span>
          <strong>${escapeHtml(current.company || current.title)}</strong>
          ${current.headline ? `<span class="floating-sub">${escapeHtml(current.headline.value)} ${escapeHtml((current.headline.label || "").replace(/^./, (c) => c.toLowerCase()))}</span>` : ""}
        </a>` : ""}
      </div>` : ""}
    </div>
    ${highlights ? `<div class="wrap wide"><div class="highlights">${highlights}</div></div>` : ""}
  </header>

  <section id="case-studies">
    <div class="wrap wide">
      <p class="eyebrow">Selected work</p>
      <h2 class="section-title">Case studies</h2>
      ${caseStudySection}
    </div>
  </section>

  ${process ? `
  <section id="process" class="tinted">
    <div class="wrap wide">
      <p class="eyebrow">How I work</p>
      <h2 class="section-title">The same loop, whether it's a lab, a CRM or a marketplace</h2>
      <ol class="process">${process}</ol>
    </div>
  </section>` : ""}

  <section id="accomplishments">
    <div class="wrap wide">
      <p class="eyebrow">Track record</p>
      <h2 class="section-title">Accomplishments &amp; metrics</h2>
      <div class="accomplishments-grid">
        ${accItems}
      </div>
    </div>
  </section>

  <section id="about" class="tinted">
    <div class="wrap wide about-grid">
      <div>
        <p class="eyebrow">About</p>
        <h2 class="section-title">Find the systemic problem, build the fix, measure it</h2>
      </div>
      <div>
        <p class="about-bio">${escapeHtml(site.bio || "").trim()}</p>
        <div class="chip-row">${skills}</div>
      </div>
    </div>
  </section>

  ${contactBand("")}`;

  return layout({
    title: `${site.name} — Portfolio`,
    description: (site.summary || "").trim(),
    prefix: "",
    activeHref: "",
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
    .map((p) => `<div class="phase-panel prose" data-phase="phase-${p.id}">${p.bodyHtml}</div>`)
    .join("\n    ");

  const activeSelectors = phases
    .map((p) => `#phase-${p.id}:checked ~ label[for="phase-${p.id}"]`)
    .join(",\n    ");

  const panelSelectors = phases
    .map((p) => `#phase-${p.id}:checked ~ .phase-panel[data-phase="phase-${p.id}"] { display: block; }`)
    .join("\n    ");

  return `
  <style>
    ${activeSelectors} { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
    ${panelSelectors}
  </style>
  <div class="phase-stepper" id="story">
    ${inputs}
    ${labels}
    ${panels}
  </div>`;
}

function renderCaseStudy(cs, index) {
  const logo = cs.cover_image
    ? `<img class="cs-logo" src="${resolveAssetUrl(cs.cover_image, "../")}" alt="${escapeHtml(cs.company || cs.title)} logo">`
    : "";

  const cover = cs.hero_image
    ? `<div class="cs-cover reveal">${framed(
        `<img src="${resolveAssetUrl(cs.hero_image, "../")}" alt="${escapeHtml(cs.title)}">`,
        { frame: "browser", url: cs.live_url || "" }
      )}</div>`
    : "";

  const galleryItems = (cs.gallery || [])
    .map((entry) => normalizeGalleryEntry(entry, cs.title))
    .filter((entry) => entry && entry.src);

  const gallery = galleryItems.length
    ? `<div class="case-study-gallery">
        ${galleryItems
          .map(
            (item) => `
          <figure class="gallery-item${item.frame === "phone" ? " is-phone" : ""} reveal">
            ${framed(`<img src="${resolveAssetUrl(item.src, "../")}" alt="${escapeHtml(item.alt || cs.title)}" loading="lazy">`, item)}
            ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
          </figure>`
          )
          .join("")}
      </div>`
    : "";

  // A case study with `phases` in its frontmatter gets a stepper instead of
  // one long scroll — the markdown body (if any) becomes a short intro above
  // it. A case study with no phases renders as a long read with a table of
  // contents built from its `##` headings.
  const hasPhases = cs.phases && cs.phases.length;
  const introHtml = cs.bodyHtml && cs.bodyHtml.trim() ? `<div class="prose">${cs.bodyHtml}</div>` : "";
  const mainContent = hasPhases ? introHtml + phaseStepper(cs.phases) : introHtml;

  const tocItems = hasPhases
    ? [{ id: "story", label: "The story" }]
    : cs.sections.map((s) => ({ id: s.id, label: s.label }));
  if (galleryItems.length) tocItems.push({ id: "product", label: "Product" });
  const toc = `<aside class="toc">${
    tocItems.length > 1
      ? `<p class="eyebrow">On this page</p><ol>${tocItems
          .map((s) => `<li><a href="#${s.id}">${escapeHtml(s.label)}</a></li>`)
          .join("")}</ol>`
      : ""
  }</aside>`;

  const stack = (cs.stack || []).length
    ? `<div class="stack"><span class="eyebrow">Built with</span>${cs.stack
        .map((s) => `<span class="chip">${escapeHtml(s)}</span>`)
        .join("")}</div>`
    : "";

  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextLink =
    next && next.slug !== cs.slug
      ? `<a class="next-cs" href="${next.slug}.html"><span class="eyebrow">Next case study</span><strong>${escapeHtml(next.title)}</strong>${icon("arrow")}</a>`
      : "";

  const facts = [
    ["Role", cs.role],
    ["Timeframe", cs.timeframe],
    ["Company", cs.company],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`)
    .join("");
  const live = cs.live_url
    ? `<div><dt>Live</dt><dd><a href="${escapeHtml(cs.live_url)}" target="_blank" rel="noopener">${escapeHtml(cs.live_url.replace(/^https?:\/\/(www\.)?/, ""))} ${icon("external")}</a></dd></div>`
    : "";

  const body = `
  <header class="cs-hero${cover ? " has-cover" : ""}">
    ${contours("contours hero-contours")}
    <div class="wrap wide">
      <a class="back" href="../index.html#case-studies">&larr; All work</a>
      <div class="cs-title-row">
        <div>
          <div class="card-tags">${tagList(cs.tags)}</div>
          <h1>${escapeHtml(cs.title)}</h1>
          <p class="cs-summary">${escapeHtml(cs.summary || "")}</p>
        </div>
        ${logo ? `<div class="cs-logo-tile">${logo}</div>` : ""}
      </div>
      <dl class="facts">${facts}${live}</dl>
      ${cs.metrics.length ? `<div class="metrics-row">${metricTiles(cs.metrics)}</div>` : ""}
      ${cover}
    </div>
  </header>

  <div class="wrap wide cs-layout">
    ${toc}
    <article class="case-study-detail">
      ${stack}
      ${mainContent}
      ${galleryItems.length ? `<h2 id="product" class="gallery-heading">Product</h2>${gallery}` : ""}
      ${nextLink}
    </article>
  </div>

  ${contactBand("../", "Want the longer version of this story?")}`;

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

caseStudies.forEach((cs, i) => {
  fs.writeFileSync(path.join(OUT, "case-studies", `${cs.slug}.html`), renderCaseStudy(cs, i));
});

copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
copyDir(path.join(CONTENT, "case-studies", "images"), path.join(OUT, "assets", "case-studies", "images"));

console.log(`Built ${1 + caseStudies.length} pages to _site/`);
if (warnings.length) {
  console.log(`\n${warnings.length} item(s) hidden or flagged — fill these in to show them:`);
  for (const w of warnings) console.log(`  • ${w}`);
}
