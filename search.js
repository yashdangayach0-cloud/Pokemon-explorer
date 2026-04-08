var searchBox    = document.getElementById("search-input");
var clearBtn     = document.getElementById("search-close-icon");
var filterBtn    = document.getElementById("sort-icon");
var filterPanel  = document.getElementById("filter-wrapper");
var typeSelect   = document.getElementById("type-filter");
var favBtn       = document.getElementById("fav-toggle");
var themeBtn     = document.getElementById("theme-toggle");

var showFavOnly  = false;
var typeCache    = {};

document.addEventListener("DOMContentLoaded", function() {
  var theme = document.documentElement.getAttribute("data-theme") || "light";
  setThemeIcon(theme);

  themeBtn.addEventListener("click", function() {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pokeTheme", next);
    setThemeIcon(next);
  });

  searchBox.addEventListener("input", function() {
    clearBtn.style.display = searchBox.value ? "flex" : "none";
    applyFilters();
  });

  clearBtn.addEventListener("click", function() {
    searchBox.value = "";
    clearBtn.style.display = "none";
    applyFilters();
  });

  filterBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    filterPanel.classList.toggle("filter-wrapper-open");
  });

  document.addEventListener("click", function(e) {
    if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
      filterPanel.classList.remove("filter-wrapper-open");
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

function setThemeIcon(theme) {
  var iconEl = document.getElementById("theme-icon");
  if (!iconEl) return;
  if (theme === "dark") {
    iconEl.setAttribute("data-icon", "sun");
    iconEl.innerHTML = icons.sun;
  } else {
    iconEl.setAttribute("data-icon", "moon");
    iconEl.innerHTML = icons.moon;
  }
}

async function applyFilters() {
  if (!allPokemons || allPokemons.length === 0) return;

  var term     = searchBox.value.toLowerCase().trim();
  var sortBy   = document.querySelector("input[name='sort']:checked").value;
  var type     = typeSelect.value;
  var favIds   = favorites || [];

  var result = allPokemons.filter(function(p) {
    var id = p.url.split("/")[6];
    return p.name.toLowerCase().includes(term) || id.includes(term);
  });

  if (showFavOnly) {
    result = result.filter(function(p) {
      return favIds.includes(p.url.split("/")[6]);
    });
  }

  if (type !== "all") {
    var withTypes = await Promise.all(
      result.map(async function(p) {
        var id = p.url.split("/")[6];
        if (!typeCache[id]) {
          try {
            var res  = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
            var data = await res.json();
            typeCache[id] = data.types.map(function(t) { return t.type.name; });
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
    if (sortBy === "name")      return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return parseInt(a.url.split("/")[6]) - parseInt(b.url.split("/")[6]);
  });

  displayPokemons(result);
  document.getElementById("not-found-message").style.display =
    result.length === 0 ? "block" : "none";
}
