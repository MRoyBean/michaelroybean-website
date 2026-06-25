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

const roadmapDetails = {
  "education-2026":
    "This year is about increasing technical leverage. The focus is starting the M.S. Computer Science path with AI and ML emphasis, then connecting that learning directly to practical supply chain problems: data quality, knowledge graph modeling, solution architecture, and the ability to translate messy operational needs into technical design choices.",
  "education-2027":
    "This stage converts learning into repeatable delivery discipline. Completing the M.S. strengthens the technical foundation, while beginning MBA work adds product, finance, leadership, and organizational-change range. The goal is to become stronger at moving ideas through controls, monitoring, adoption, and measurable value.",
  "education-2028":
    "The focus shifts toward product fluency: understanding roadmap tradeoffs, financial impact, stakeholder value, change leadership, and durable adoption. This builds the ability to lead AI, data, and transformation work as a product capability instead of a series of disconnected projects.",
  "education-2029":
    "This year is about sharpening executive communication and strategy. Completing the MBA target adds business range, but the real outcome is stronger ability to explain complex technical and operational choices in leadership-ready terms, build sponsorship, and connect teams around shared direction.",
  "education-2030":
    "The learning focus broadens into people leadership. Responsible technology governance, coaching, talent development, and workforce planning become central, so technical transformation can scale through people, not just through tools, dashboards, and individual problem solving.",
  "impact-2026":
    "The organizational value starts with clarity. This means defining system and process hazards, identifying data gaps, improving traceability, and maturing AI portfolios so teams know which problems are worth solving and what controls must be in place before technology is deployed.",
  "impact-2027":
    "The impact focus is reducing failure paths in real workflows. Solutions should improve knowledge access, monitoring, controls, and adoption so teams can detect issues earlier, understand what is changing, and trust the new process or tool enough to use it consistently.",
  "impact-2028":
    "This is where the model becomes repeatable. The aim is to strengthen knowledge graph and data foundations, create a reusable problem-solving pattern, and track value, integrity, and user readiness so successful approaches can scale beyond one local use case.",
  "impact-2029":
    "The organizational goal is connection across teams. By aligning common needs, shared roadmaps, and reusable capabilities, the work should reduce duplicated effort, manual work, fragmented priorities, and the slow drift that happens when every group solves the same problem separately.",
  "impact-2030":
    "The long-term impact is sustained operating capability. That means teams have clearer knowledge, stronger ownership, better data-informed decisions, and safer workflows that continue to improve after the initial transformation effort is complete.",
  "career-2026":
    "The career focus is operating as a forward-deployed transformation lead: staying close to the teams experiencing the problem, translating operational reality into requirements and controls, and helping move solutions from discovery through design, build, deployment, and adoption.",
  "career-2027":
    "This stage builds scale. The work expands from individual analysis into delivery leadership: requirements, product direction, developer coordination, technical partner alignment, user readiness, and the habits needed to move multiple solutions through an enterprise environment.",
  "career-2028":
    "The target role is Supply Chain Artificial Intelligence Product Manager. The emphasis is owning vision, priorities, roadmap, adoption, and value tracking for AI-enabled capabilities that solve real supply chain problems instead of chasing novelty.",
  "career-2029":
    "This year deepens product leadership range. The work is about building sponsorship, connecting BCA teams around common needs, earning stakeholder trust, and turning product management from a role into an enterprise influence mechanism.",
  "career-2030":
    "The career path moves into first-line leadership. The focus is gaining direct-report experience, coaching people, building capability, and leading products and outcomes through a team that can solve problems end to end."
};

function selectMapCard(card) {
  const title = card.querySelector("h3")?.textContent?.trim() || "";
  const lane = card.dataset.lane || "Roadmap";
  const year = card.dataset.year || "";
  const detailKey = `${lane}-${year}`;
  const copy = roadmapDetails[detailKey] || card.querySelector("p")?.textContent?.trim() || "";

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
