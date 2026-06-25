const root = document.documentElement;
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  root.style.setProperty("--scroll-progress", Math.min(Math.max(progress, 0), 1));
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal-zone").forEach((section) => {
  sectionObserver.observe(section);
});

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-28% 0px -58% 0px", threshold: [0.08, 0.18, 0.3] }
);

sections.forEach((section) => navObserver.observe(section));

const capabilityData = {
  supply: {
    label: "Supply Chain",
    title: "Forward-deployed transformation",
    copy:
      "Embed with teams, understand process hazards and dependencies, then turn operational reality into clearer requirements, controls, and execution paths."
  },
  data: {
    label: "Data",
    title: "Trusted decision infrastructure",
    copy:
      "Improve ownership, quality rules, traceability, and semantic structure so people can trust the numbers before they act on them."
  },
  ai: {
    label: "AI",
    title: "Practical intelligence workflows",
    copy:
      "Use AI where it compresses cycle time, reveals patterns, improves access to knowledge, or helps teams make better decisions with less friction."
  },
  risk: {
    label: "Risk",
    title: "Controls that survive reality",
    copy:
      "Connect hazards, compliance needs, human behavior, and system design so transformation reduces risk instead of simply moving it around."
  }
};

const capabilityTabs = [...document.querySelectorAll(".capability-tab")];
const capabilityLabel = document.querySelector("#capability-label");
const capabilityTitle = document.querySelector("#capability-title");
const capabilityCopy = document.querySelector("#capability-copy");

capabilityTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const data = capabilityData[tab.dataset.capability];
    if (!data) return;

    capabilityTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    capabilityLabel.textContent = data.label;
    capabilityTitle.textContent = data.title;
    capabilityCopy.textContent = data.copy;
  });
});

const map = document.querySelector(".future-map");
const mapShell = document.querySelector(".future-map-shell");
const mapCards = [...document.querySelectorAll(".map-card")];
const mapFilters = [...document.querySelectorAll(".map-filter")];
const inspectorMeta = document.querySelector("#inspector-meta");
const inspectorTitle = document.querySelector("#inspector-title");
const inspectorCopy = document.querySelector("#inspector-copy");

function selectMapCard(card) {
  const title = card.querySelector("h3")?.textContent?.trim() || "";
  const copy = card.querySelector("p")?.textContent?.trim() || "";
  const lane = card.dataset.lane || "Roadmap";
  const year = card.dataset.year || "";

  mapCards.forEach((item) => item.classList.toggle("is-selected", item === card));
  inspectorMeta.textContent = `${year} | ${lane}`;
  inspectorTitle.textContent = title;
  inspectorCopy.textContent = copy;
}

mapCards.forEach((card) => {
  card.addEventListener("click", () => selectMapCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectMapCard(card);
    }
  });
});

if (mapCards[0]) {
  selectMapCard(mapCards[0]);
}

mapFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const value = filter.dataset.filter;
    const isAll = value === "all";

    mapFilters.forEach((item) => item.classList.toggle("is-active", item === filter));
    map?.classList.toggle("is-filtering", !isAll);
    mapCards.forEach((card) => {
      card.classList.toggle("is-match", isAll || card.dataset.lane === value);
    });
  });
});

document.querySelectorAll("[data-scroll-map]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.scrollMap);
    mapShell?.scrollBy({
      left: direction * Math.min(520, window.innerWidth * 0.72),
      behavior: "smooth"
    });
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-y", `${x * 5}deg`);
    card.style.setProperty("--tilt-x", `${y * -5}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-x", "0deg");
  });
});
