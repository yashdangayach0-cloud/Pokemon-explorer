const MAX = 898;
const API = "https://pokeapi.co/api/v2/pokemon?limit=" + MAX;
const IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const FALLBACK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const con = document.getElementById("list-wrapper");
const loader = document.getElementById("loading");
const featuredSection = document.getElementById("featured-section");
const featuredImg = document.getElementById("featured-img");
const featuredName = document.getElementById("featured-name");
const section = document.getElementById("pokemon-list");
const noResult = document.getElementById("not-found-message");

let allPokemons = [];
let favorites = getSavedFavs();

loadList();

async function loadList() {
  try {
    let [res] = await Promise.all([
      fetch(API),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);
    let data = await res.json();
    allPokemons = data.results;
    featuredSection.style.display = "none";
    loader.style.display = "none";
    section.style.display = "block";
    showCards(allPokemons);
  } catch (err) {
    loader.innerHTML = "<p class='error-msg'>Failed to load list. Check your connection.</p>";
  }
}

function showCards(list) {
  con.innerHTML = "";
  noResult.style.display = list.length === 0 ? "block" : "none";

  for (let i of list) {
    let id = i.url.split("/")[6];
    let box = makeCard(i, id);
    con.appendChild(box);
  }
}

function makeCard(pokemon, id) {
  let isFav = favorites.includes(id);

  let box = document.createElement("div");
  box.className = "list-item";
  box.dataset.id = id;

  box.innerHTML =
    '<div class="number-wrap">' +
      '<p># ' + id.padStart(3, '0') + '</p>' +
      '<button class="fav-btn ' + (isFav ? "active" : "") + '" aria-label="Favorite">♥</button>' +
    '</div>' +
    '<div class="img-wrap">' +
      '<img src="' + IMG + id + '.png" alt="' + pokemon.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + FALLBACK + id + '.png\'">' +
    '</div>' +
    '<div class="name-wrap">' +
      '<p>' + pokemon.name + '</p>' +
    '</div>';

  box.addEventListener("click", function(e) {
    if (e.target.closest(".fav-btn")) return;
    window.location.href = "./detail.html?id=" + id;
  });

  box.querySelector(".fav-btn").addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFav(id, box.querySelector(".fav-btn"));
  });

  return box;
}

function getSavedFavs() {
  let saved = localStorage.getItem("pokeFavorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavs() {
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
  saveFavs();
}

