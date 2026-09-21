import "./styles.css";

const loader = document.querySelector("[data-loader]");
const loaderStartedAt = performance.now();
let loaderComplete = false;

function dismissLoader() {
  if (!loader || loaderComplete) return;
  loaderComplete = true;
  loader.classList.add("is-complete");
  document.body.classList.remove("is-loading");
  window.setTimeout(() => loader.remove(), 700);
}

function finishLoading() {
  const remaining = Math.max(0, 3_000 - (performance.now() - loaderStartedAt));
  window.setTimeout(dismissLoader, remaining);
}

if (loader) {
  document.body.classList.add("is-loading");
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading, { once: true });
  window.setTimeout(dismissLoader, 10_000);
}

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll("[data-reveal], [data-stagger]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-22% 0px -62%", threshold: [0.05, 0.2] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const slider = document.querySelector("[data-service-slider]");
const previousButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");

function serviceStep() {
  const card = slider?.querySelector(".service-card");
  if (!card) return 340;
  const gap = Number.parseFloat(getComputedStyle(card.parentElement).gap) || 20;
  return card.getBoundingClientRect().width + gap;
}

previousButton?.addEventListener("click", () => {
  slider?.scrollBy({ left: -serviceStep(), behavior: "smooth" });
});

nextButton?.addEventListener("click", () => {
  slider?.scrollBy({ left: serviceStep(), behavior: "smooth" });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
