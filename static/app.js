const grid = document.getElementById("grid");
const cardTemplate = document.getElementById("cardTemplate");
const metaText = document.getElementById("metaText");
const toast = document.getElementById("toast");

const categoryEl = document.getElementById("category");
const languageEl = document.getElementById("language");
const countryEl = document.getElementById("country");
const qEl = document.getElementById("q");
const applyBtn = document.getElementById("apply");

let state = {
  category: "all",
  language: "all",
  country: "all",
  q: ""
};

function showToast(msg, timeout = 3000) {
  toast.textContent = msg;
  toast.hidden = false;
  setTimeout(() => (toast.hidden = true), timeout);
}

function skeleton(count = 6) {
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skel = document.createElement("div");
    skel.className = "card";
    skel.style.minHeight = "260px";
    skel.style.opacity = "0.7";
    skel.innerHTML = `
      <div class="thumb-wrap" style="background:#0f192c;"/>
      <div class="card-body">
        <div class="title" style="height:22px;background:#0f192c;border-radius:8px;"></div>
        <div class="desc" style="height:16px;background:#0f192c;border-radius:8px;width:90%;"></div>
        <div class="meta" style="height:12px;background:#0f192c;border-radius:8px;width:40%;"></div>
      </div>`;
    grid.appendChild(skel);
  }
}

function buildQuery() {
  const params = new URLSearchParams();
  params.set("category", state.category);
  params.set("language", state.language);
  params.set("country", state.country);
  if (state.q) params.set("q", state.q);
  return `/api/news?${params.toString()}`;
}

async function fetchNews() {
  try {
    skeleton();
    const res = await fetch(buildQuery());
    const data = await res.json();
    if (!res.ok || data.status !== "ok") {
      throw new Error(data.message || "Failed to load news");
    }
    metaText.textContent = `Showing ${data.articles.length} of ${data.totalResults.toLocaleString()} results`;
    renderCards(data.articles);
  } catch (err) {
    grid.innerHTML = "";
    metaText.textContent = "No results";
    showToast(err.message);
  }
}

function renderCards(articles) {
  grid.innerHTML = "";
  if (!articles.length) {
    const empty = document.createElement("p");
    empty.style.color = "#8ea3b0";
    empty.textContent = "No articles found for the selected filters.";
    grid.appendChild(empty);
    return;
  }
  for (const a of articles) {
    const node = cardTemplate.content.cloneNode(true);
    const link = node.querySelector(".card-link");
    const img = node.querySelector(".thumb");
    const title = node.querySelector(".title");
    const desc = node.querySelector(".desc");
    const source = node.querySelector(".source");
    const time = node.querySelector(".time");

    link.href = a.url || "#";
    if (a.urlToImage) {
      img.src = a.urlToImage;
      img.alt = a.title || "Article image";
    } else {
      img.src =
        "data:image/svg+xml;charset=utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'><rect width='100%' height='100%' fill='#0d1524'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#203152' font-family='Arial' font-size='42'>No Image</text></svg>`
        );
      img.alt = "No image";
    }
    title.textContent = a.title || "Untitled";
    desc.textContent = a.description || "";
    source.textContent = a.source || "Unknown";
    time.textContent = a.publishedAt
      ? new Date(a.publishedAt).toLocaleString()
      : "";
    grid.appendChild(node);
  }
}

async function loadMetadata() {
  try {
    const res = await fetch("/api/metadata");
    const data = await res.json();
    if (data.status === "ok") {
      // populate categories
      categoryEl.innerHTML = `<option value="all">All</option>`;
      data.categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.text = c.charAt(0).toUpperCase() + c.slice(1);
        categoryEl.appendChild(opt);
      });
      // populate languages
      languageEl.innerHTML = `<option value="all">All</option>`;
      data.languages.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.text = l.toUpperCase();
        languageEl.appendChild(opt);
      });
      // populate countries
      countryEl.innerHTML = `<option value="all">All</option>`;
      data.countries.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.text = c.toUpperCase();
        countryEl.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Failed to load metadata", err);
  }
}

function applyFilters() {
  state.category = categoryEl.value;
  state.language = languageEl.value;
  state.country = countryEl.value;
  state.q = qEl.value.trim();
  fetchNews();
}

// Events
applyBtn.addEventListener("click", () => applyFilters());
categoryEl.addEventListener("change", () => applyFilters());
languageEl.addEventListener("change", () => applyFilters());
countryEl.addEventListener("change", () => applyFilters());
qEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyFilters();
});

// Init
(async function init() {
  await loadMetadata();
  fetchNews();
})();
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");

    // Change icon (simple sun/moon switch)
icon.innerHTML = dark
  // 🌙 Moon
  ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.64 13a9 9 0 01-11.31-11.31 1 1 0 00-1.28-1.28A11 11 0 1022.92 14.3a1 1 0 00-1.28-1.3z"/>'
  // 🌞 Sun (with + and × rays)
  : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4V2m0 20v-2m8-8h2M2 12h2m15.364-7.364l1.414-1.414M4.222 19.778l1.414-1.414m0-12.728L4.222 4.222M19.778 19.778l-1.414-1.414M12 6a6 6 0 100 12 6 6 0 000-12z"/>';

  });
}

document.addEventListener("DOMContentLoaded", setupThemeToggle);
