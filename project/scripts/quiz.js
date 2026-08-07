/* quiz.js — SignalScout recommendation quiz
   Scores each connection type against the visitor's answers, then
   stores and restores the result with localStorage. */

const connectionTypes = [
  {
    id: "fiber",
    name: "Fiber",
    blurb: `Light-based signal over glass strands. The fastest, most symmetric, most reliable option where it's built.`,
    download: "300–2000 Mbps",
    latency: "5–15 ms",
    pros: ["Fastest available speeds", "Equal upload and download", "Most reliable under heavy load"],
    cons: ["Limited to urban and newer suburban areas", "Can cost more than cable"],
  },
  {
    id: "cable",
    name: "Cable",
    blurb: `Rides the same coaxial line as cable TV. Fast downloads and wide availability in cities and suburbs.`,
    download: "100–1000 Mbps",
    latency: "10–25 ms",
    pros: ["Widely available", "Strong download speeds", "Good value for streaming"],
    cons: ["Upload speeds lag behind download", "Can slow during peak hours"],
  },
  {
    id: "dsl",
    name: "DSL",
    blurb: `Uses existing phone lines. Modest speeds, but dependable and usually the cheapest wired option.`,
    download: "5–100 Mbps",
    latency: "20–40 ms",
    pros: ["Lowest typical price", "Very wide availability", "Stable dedicated line"],
    cons: ["Slower top speeds", "Performance drops with distance from the provider"],
  },
  {
    id: "fixed-wireless",
    name: "Fixed Wireless",
    blurb: `A rooftop antenna talks to a nearby tower. A strong middle ground for areas without cabled service.`,
    download: "25–300 Mbps",
    latency: "15–35 ms",
    pros: ["Faster to install than wired options", "Good option outside cable/fiber areas"],
    cons: ["Needs clear line of sight to a tower", "Weather can affect performance"],
  },
  {
    id: "satellite",
    name: "Satellite",
    blurb: `Beams data from orbit, reaching almost anywhere, including the most remote addresses.`,
    download: "25–220 Mbps",
    latency: "25–600 ms",
    pros: ["Available almost anywhere", "No cabling or towers required"],
    cons: ["Higher latency than every other option", "Typically the most expensive"],
  },
];

const STORAGE_KEY = "signalscout-quiz-result";

function scoreConnectionTypes(answers) {
  const scores = {
    fiber: 0,
    cable: 0,
    dsl: 0,
    "fixed-wireless": 0,
    satellite: 0,
  };

  if (answers.location === "urban") {
    scores.fiber += 3;
    scores.cable += 3;
    scores.dsl += 1;
  } else if (answers.location === "suburban") {
    scores.cable += 3;
    scores.fiber += 2;
    scores["fixed-wireless"] += 2;
    scores.dsl += 1;
  } else if (answers.location === "rural") {
    scores["fixed-wireless"] += 3;
    scores.satellite += 3;
    scores.dsl += 1;
  }

  if (answers.usage === "gaming" || answers.usage === "business") {
    scores.fiber += 3;
    scores.cable += 2;
    scores.satellite -= 2;
  } else if (answers.usage === "streaming") {
    scores.fiber += 2;
    scores.cable += 2;
    scores["fixed-wireless"] += 1;
  } else if (answers.usage === "browsing") {
    scores.dsl += 2;
    scores.satellite += 1;
  }

  if (answers.devices === "many") {
    scores.fiber += 2;
    scores.cable += 2;
  } else if (answers.devices === "some") {
    scores.cable += 1;
    scores["fixed-wireless"] += 1;
  } else if (answers.devices === "few") {
    scores.dsl += 1;
  }

  if (answers.priority === "price") {
    scores.dsl += 2;
    scores["fixed-wireless"] += 1;
    scores.fiber -= 1;
    scores.satellite -= 1;
  } else if (answers.priority === "speed") {
    scores.fiber += 2;
    scores.cable += 1;
  } else if (answers.priority === "balanced") {
    scores.cable += 1;
    scores["fixed-wireless"] += 1;
  }

  return scores;
}

function pickBestConnection(scores) {
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topId] = ranked[0];
  return connectionTypes.find((type) => type.id === topId);
}

function buildResultHTML(type, answers) {
  const prosList = type.pros.map((item) => `<li>${item}</li>`).join("");
  const consList = type.cons.map((item) => `<li>${item}</li>`).join("");

  return `
    <span class="badge">Recommended for you</span>
    <h3>${type.name}</h3>
    <p>${type.blurb}</p>
    <p><span class="mono">↓ ${type.download}</span> &nbsp; <span class="mono">latency ${type.latency}</span></p>
    <p><strong>Why this fits:</strong> based on a ${answers.location} address, ${answers.usage} as the main use, ${answers.devices === "few" ? "1–2" : answers.devices === "some" ? "3–5" : "6+"} connected devices, and ${answers.priority} as the priority.</p>
    <h4>Strengths</h4>
    <ul>${prosList}</ul>
    <h4>Trade-offs</h4>
    <ul>${consList}</ul>
    <p><a href="guide.html">Read more about ${type.name} in the guide &rarr;</a></p>
  `;
}

function getFormAnswers(form) {
  const data = new FormData(form);
  return {
    location: data.get("location"),
    usage: data.get("usage"),
    devices: data.get("devices"),
    priority: data.get("priority"),
  };
}

function answersAreComplete(answers) {
  return Boolean(answers.location && answers.usage && answers.devices && answers.priority);
}

function saveResult(answers, type) {
  const record = {
    answers,
    typeId: type.id,
    typeName: type.name,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function loadSavedResult() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function renderSavedBanner() {
  const banner = document.getElementById("savedResultBanner");
  const saved = loadSavedResult();

  if (!banner) return;

  if (saved) {
    const savedDate = new Date(saved.savedAt).toLocaleDateString();
    banner.innerHTML = `Last time (${savedDate}) SignalScout recommended <strong>${saved.typeName}</strong> for you. Submit the form again for a fresh result.`;
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

function handleQuizSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const errorBox = document.getElementById("quizError");
  const resultBox = document.getElementById("quizResult");
  const answers = getFormAnswers(form);

  if (!answersAreComplete(answers)) {
    errorBox.textContent = "Please answer all four questions before continuing.";
    errorBox.hidden = false;
    resultBox.hidden = true;
    return;
  }

  errorBox.hidden = true;

  const scores = scoreConnectionTypes(answers);
  const bestType = pickBestConnection(scores);

  resultBox.innerHTML = buildResultHTML(bestType, answers);
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

  saveResult(answers, bestType);
  renderSavedBanner();
}

function handleQuizReset() {
  localStorage.removeItem(STORAGE_KEY);
  renderSavedBanner();

  const resultBox = document.getElementById("quizResult");
  resultBox.hidden = true;
  resultBox.innerHTML = "";
}

function initQuiz() {
  const form = document.getElementById("quizForm");
  const resetButton = document.getElementById("quizReset");

  if (!form) return;

  form.addEventListener("submit", handleQuizSubmit);
  resetButton.addEventListener("click", handleQuizReset);

  renderSavedBanner();
}

document.addEventListener("DOMContentLoaded", initQuiz);
