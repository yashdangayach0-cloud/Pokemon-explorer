var MAX_POKEMON = 898;
var API_URL = "https://pokeapi.co/api/v2/pokemon?limit=" + MAX_POKEMON;
var IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
var FALLBACK_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

var grid = document.getElementById("list-wrapper");
var loader = document.getElementById("loading");
var listSection = document.getElementById("pokemon-list");
var noResult = document.getElementById("not-found-message");

var allPokemons = [];
var favorites = getFavorites();

loadPokemons();

async function loadPokemons() {
  try {
    var res = await fetch(API_URL);
    var data = await res.json();
    allPokemons = data.results;
    loader.style.display = "none";
    listSection.style.display = "block";
    displayPokemons(allPokemons);
  } catch (err) {
    loader.innerHTML = "<p class='error-msg'>Failed to load. Check your connection.</p>";
  }
}

function displayPokemons(list) {
  grid.innerHTML = "";
  noResult.style.display = list.length === 0 ? "block" : "none";

  list.forEach(function(pokemon) {
    var id = getId(pokemon.url);
    var card = makeCard(pokemon, id);
    grid.appendChild(card);
  });
}

function makeCard(pokemon, id) {
  var card = document.createElement("div");
  card.className = "list-item";
  card.dataset.id = id;

  var isFav = favorites.includes(id);

  card.innerHTML =
    '<div class="number-wrap">' +
      '<p class="caption-fonts">#' + id + '</p>' +
      '<button class="fav-btn ' + (isFav ? "active" : "") + '" aria-label="Favorite">' +
        '<svg viewBox="0 0 24 24" width="14" height="14">' +
          '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
        '</svg>' +
      '</button>' +
    '</div>' +
    '<div class="img-wrap">' +
      '<img src="' + IMG_URL + id + '.png" alt="' + pokemon.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + FALLBACK_URL + id + '.png\'">' +
    '</div>' +
    '<div class="name-wrap">' +
      '<p class="body3-fonts">' + pokemon.name + '</p>' +
    '</div>';

  card.addEventListener("click", function(e) {
    if (e.target.closest(".fav-btn")) return;
    window.location.href = "./detail.html?id=" + id;
  });

  card.querySelector(".fav-btn").addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFav(id, card.querySelector(".fav-btn"));
  });

  return card;
}

function getFavorites() {
  var saved = localStorage.getItem("pokeFavorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
  localStorage.setItem("pokeFavorites", JSON.stringify(favorites));
}

function toggleFav(id, btn) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(function(f) { return f !== id; });
    btn.classList.remove("active");
  } else {
    favorites.push(id);
    btn.classList.add("active");
  }
  saveFavorites();
}

function getId(url) {
  var parts = url.split("/");
  return parts[6];
}
