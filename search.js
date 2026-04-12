const input = document.getElementById("search-input");
const clearBtn = document.getElementById("search-clear-icon");
const filterBtn = document.getElementById("sort-icon");
const filterPanel = document.getElementById("filter-wrapper");
const typeSelect = document.getElementById("type-filter");
const favBtn = document.getElementById("fav-toggle");
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

let showFavOnly = false;
let typeCache = {};

document.addEventListener("DOMContentLoaded", function() {
  let theme = document.documentElement.getAttribute("data-theme") || "light";
  themeIcon.textContent = theme === "dark" ? "☀" : "🌙";

  themeBtn.addEventListener("click", function() {
    let current = document.documentElement.getAttribute("data-theme");
    let next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pokeTheme", next);
    themeIcon.textContent = next === "dark" ? "☀" : "🌙";
  });

  input.addEventListener("input", function() {
    clearBtn.style.display = input.value ? "flex" : "none";
    applyFilters();
  });

  clearBtn.addEventListener("click", function() {
    input.value = "";
    clearBtn.style.display = "none";
    applyFilters();
  });

  filterBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    filterPanel.classList.toggle("open");
  });

  document.addEventListener("click", function(e) {
    if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
      filterPanel.classList.remove("open");
    }
  });

  document.querySelectorAll("input[name='sort']").forEach(function(radio) {
    radio.addEventListener("change", applyFilters);
  });

  typeSelect.addEventListener("change", applyFilters);

  favBtn.addEventListener("click", function() {
    showFavOnly = !showFavOnly;
    favBtn.classList.toggle("active", showFavOnly);
    applyFilters();
  });
});

async function applyFilters() {
  if (!allPokemons || allPokemons.length === 0) return;

  let val = input.value.toLowerCase().trim();
  let sortBy = document.querySelector("input[name='sort']:checked").value;
  let type = typeSelect.value;
  let favIds = favorites || [];

  let result = allPokemons.filter(function(p) {
    let id = p.url.split("/")[6];
    return p.name.toLowerCase().includes(val) || id.includes(val);
  });

  if (showFavOnly) {
    result = result.filter(function(p) {
      return favIds.includes(p.url.split("/")[6]);
    });
  }

  if (type !== "all") {
    let withTypes = await Promise.all(
      result.map(async function(p) {
        let id = p.url.split("/")[6];
        if (!typeCache[id]) {
          try {
            let res = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
            let dataa = await res.json();
            typeCache[id] = dataa.types.map(function(t) { return t.type.name; });
          } catch (e) {
            typeCache[id] = [];
          }
        }
        return { p: p, types: typeCache[id] };
      })
    );
    result = withTypes
      .filter(function(item) { return item.types.includes(type); })
      .map(function(item) { return item.p; });
  }

  result = result.sort(function(a, b) {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return parseInt(a.url.split("/")[6]) - parseInt(b.url.split("/")[6]);
  });

  showCards(result);
  document.getElementById("not-found-message").style.display =
    result.length === 0 ? "block" : "none";
}
