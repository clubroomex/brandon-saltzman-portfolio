// Progressive enhancements: scroll reveal, nav border on scroll, and
// highlighting the current section in the nav / case study table of contents.
// The site works fully without this file.

const nav = document.querySelector(".site-nav");
const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

// Highlight the nav / TOC link for whichever section is under the top third of the screen.
const spyLinks = [...document.querySelectorAll(".nav-link, .toc a")]
  .map((a) => {
    const url = new URL(a.href, location.href);
    const target = url.pathname === location.pathname && url.hash
      ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
      : null;
    return target && { a, target };
  })
  .filter(Boolean);

if (spyLinks.length) {
  const spy = () => {
    const line = window.innerHeight * 0.35;
    let current = null;
    let currentTop = -Infinity;
    for (const { target } of spyLinks) {
      const top = target.getBoundingClientRect().top;
      if (top <= line && top > currentTop) {
        current = target;
        currentTop = top;
      }
    }
    spyLinks.forEach(({ a, target }) => a.classList.toggle("active", target === current));
  };
  spy();
  window.addEventListener("scroll", spy, { passive: true });
}
