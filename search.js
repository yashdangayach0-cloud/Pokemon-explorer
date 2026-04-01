// ─── Elements ────────────────────────────────────────────────────────────────
const searchInput    = document.getElementById("search-input");
const searchClose    = document.getElementById("search-close-icon");
const sortIcon       = document.getElementById("sort-icon");
const filterWrapper  = document.getElementById("filter-wrapper");
const typeFilter     = document.getElementById("type-filter");
const favToggleBtn   = document.getElementById("fav-toggle");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon      = document.getElementById("theme-icon");

// ─── State ────────────────────────────────────────────────────────────────────
let showFavoritesOnly = false;
let typeCache = {};   // id -> types[]

// ─── Theme ───────────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem("pokeTheme") || "light";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("pokeTheme", theme);
  themeIcon.setAttribute("data-icon", theme === "dark" ? "sun" : "moon");
  // re-inject icon after attribute change
  if (typeof injectIcons === "function") injectIcons();
}

// ─── Search ───────────────────────────────────────────────────────────────────
searchInput.addEventListener("input", () => {
  searchClose.style.display = searchInput.value ? "flex" : "none";
  applyFilters();
});

searchClose.addEventListener("click", () => {
  searchInput.value = "";
  searchClose.style.display = "none";
  applyFilters();
});

// ─── Sort / Filter panel ──────────────────────────────────────────────────────
sortIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  filterWrapper.classList.toggle("filter-wrapper-open");
});

document.addEventListener("click", (e) => {
  if (!filterWrapper.contains(e.target) && !sortIcon.contains(e.target)) {
    filterWrapper.classList.remove("filter-wrapper-open");
  }
});

document.querySelectorAll("input[name='sort']").forEach((radio) => {
  radio.addEventListener("change", applyFilters);
});

typeFilter.addEventListener("change", applyFilters);

// ─── Favorites toggle ─────────────────────────────────────────────────────────
favToggleBtn.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favToggleBtn.classList.toggle("active", showFavoritesOnly);
  applyFilters();
});

// ─── Core filter + sort pipeline (all HOFs) ───────────────────────────────────
async function applyFilters() {
  if (typeof allPokemons === "undefined" || allPokemons.length === 0) return;

  const term      = searchInput.value.toLowerCase().trim();
  const sortVal   = document.querySelector("input[name='sort']:checked").value;
  const typeVal   = typeFilter.value;
  const favIds    = typeof favorites !== "undefined" ? favorites : [];

  // 1. Search filter (HOF: filter)
  let result = allPokemons.filter((p) => {
    const id = p.url.split("/")[6];
    return p.name.toLowerCase().includes(term) || id.includes(term);
  });

  // 2. Favorites filter (HOF: filter)
  if (showFavoritesOnly) {
    result = result.filter((p) => favIds.includes(p.url.split("/")[6]));
  }

  // 3. Type filter — fetch types for visible set only (HOF: filter + map + Promise.all)
  if (typeVal !== "all") {
    const withTypes = await Promise.all(
      result.map(async (p) => {
        const id = p.url.split("/")[6];
        if (!typeCache[id]) {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            typeCache[id] = data.types.map((t) => t.type.name);
          } catch {
            typeCache[id] = [];
          }
        }
        return { p, types: typeCache[id] };
      })
    );
    result = withTypes
      .filter(({ types }) => types.includes(typeVal))
      .map(({ p }) => p);
  }

  // 4. Sort (HOF: sort)
  result = [...result].sort((a, b) => {
    if (sortVal === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortVal === "name-desc") {
      return b.name.localeCompare(a.name);
    } else {
      // number (default)
      return parseInt(a.url.split("/")[6]) - parseInt(b.url.split("/")[6]);
    }
  });

  displayPokemons(result);
  document.getElementById("not-found-message").style.display =
    result.length === 0 ? "block" : "none";
}
