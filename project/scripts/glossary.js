/* glossary.js — searchable, filterable glossary of telecom terms.
   Remembers the visitor's last search and category filter with localStorage. */

const glossaryTerms = [
  { term: "Bandwidth", category: "speed", definition: `The maximum amount of data a connection can carry per second, usually measured in megabits per second (Mbps).` },
  { term: "Latency", category: "speed", definition: `The delay between sending a request and receiving a response, measured in milliseconds (ms). Lower is better for gaming and video calls.` },
  { term: "Throughput", category: "speed", definition: `The actual speed you experience in real-world use, which is often lower than the advertised maximum bandwidth.` },
  { term: "Jitter", category: "speed", definition: `Variation in latency over time. High jitter causes choppy video calls even when average speed looks fine.` },
  { term: "Symmetric speed", category: "speed", definition: `A connection where upload and download speeds are equal or nearly equal, common with fiber.` },
  { term: "Modem", category: "hardware", definition: `The device that translates the signal from your provider's line into data your home network can use.` },
  { term: "Router", category: "hardware", definition: `The device that shares your modem's connection across multiple devices, wired or over Wi-Fi.` },
  { term: "ONT", category: "hardware", definition: `Optical Network Terminal &mdash; the box that converts a fiber connection's light signal into an electrical one for your router.` },
  { term: "Mesh network", category: "hardware", definition: `A set of two or more Wi-Fi units that work together to extend coverage evenly through a home.` },
  { term: "Line of sight", category: "hardware", definition: `An unobstructed path between a fixed wireless antenna and its tower, or a satellite dish and the sky.` },
  { term: "Data cap", category: "billing", definition: `A monthly limit on how much data you can use before a provider slows your speed or charges extra.` },
  { term: "Throttling", category: "billing", definition: `A provider intentionally slowing your connection, often after you pass a data cap or during network congestion.` },
  { term: "SLA", category: "billing", definition: `Service Level Agreement &mdash; a contract term, common in business plans, guaranteeing a minimum uptime or repair time.` },
  { term: "Bundling", category: "billing", definition: `Combining internet with other services like TV or phone for a discounted monthly rate.` },
  { term: "Static IP", category: "billing", definition: `A fixed, unchanging address for your connection, sometimes offered as a paid add-on for business accounts.` },
];

const SEARCH_KEY = "signalscout-glossary-search";
const CATEGORY_KEY = "signalscout-glossary-category";

function filterTerms(terms, searchValue, category) {
  const query = searchValue.trim().toLowerCase();

  return terms.filter((entry) => {
    const matchesCategory = category === "all" || entry.category === category;
    const matchesSearch =
      query === "" ||
      entry.term.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

function renderTerms(terms) {
  const list = document.getElementById("glossaryList");
  const count = document.getElementById("glossaryCount");

  if (terms.length === 0) {
    list.innerHTML = "";
    count.textContent = `No terms match your search.`;
    return;
  }

  const rows = terms
    .map((entry) => `
      <div>
        <dt>${entry.term}</dt>
        <dd>${entry.definition}</dd>
      </div>
    `)
    .join("");

  list.innerHTML = rows;
  count.textContent = `Showing ${terms.length} of ${glossaryTerms.length} terms`;
}

function applyFilters() {
  const searchInput = document.getElementById("glossarySearch");
  const activeChip = document.querySelector(".chip[aria-pressed='true']");
  const category = activeChip ? activeChip.dataset.category : "all";

  const results = filterTerms(glossaryTerms, searchInput.value, category);
  renderTerms(results);

  localStorage.setItem(SEARCH_KEY, searchInput.value);
  localStorage.setItem(CATEGORY_KEY, category);
}

function setActiveChip(selectedChip) {
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    const isSelected = chip === selectedChip;
    chip.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function restoreSavedFilters() {
  const savedSearch = localStorage.getItem(SEARCH_KEY);
  const savedCategory = localStorage.getItem(CATEGORY_KEY);
  const searchInput = document.getElementById("glossarySearch");

  if (savedSearch) {
    searchInput.value = savedSearch;
  }

  if (savedCategory) {
    const matchingChip = document.querySelector(`.chip[data-category="${savedCategory}"]`);
    if (matchingChip) {
      setActiveChip(matchingChip);
    }
  }
}

function initGlossary() {
  const searchInput = document.getElementById("glossarySearch");
  const chipGroup = document.getElementById("chipGroup");

  if (!searchInput || !chipGroup) return;

  restoreSavedFilters();

  searchInput.addEventListener("input", applyFilters);

  chipGroup.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    setActiveChip(chip);
    applyFilters();
  });

  applyFilters();
}

document.addEventListener("DOMContentLoaded", initGlossary);
