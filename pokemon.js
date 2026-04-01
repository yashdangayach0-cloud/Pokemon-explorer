// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_POKEMON = 898;
const listWrapper = document.getElementById("list-wrapper");
const loadingEl = document.getElementById("loading");
const pokemonListEl = document.getElementById("pokemon-list");
const notFoundMessage = document.getElementById("not-found-message");

// ─── State ────────────────────────────────────────────────────────────────────
let allPokemons = [];          // raw list from API  { name, url }
let pokemonTypeCache = {};     // id -> [type, ...]  (fetched on demand)
let favorites = loadFavorites();

// ─── Bootstrap ───────────────────────────────────────────────────────────────
fetchAllPokemons();

async function fetchAllPokemons() {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
    const data = await res.json();
    allPokemons = data.results;
    showList();
    displayPokemons(allPokemons);
  } catch (err) {
    showError("Failed to load Pokémon. Please check your connection.");
  }
}

function showList() {
  loadingEl.style.display = "none";
  pokemonListEl.style.display = "block";
}

function showError(msg) {
  loadingEl.innerHTML = `<p class="error-msg">${msg}</p>`;
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function displayPokemons(list) {
  listWrapper.innerHTML = "";
  notFoundMessage.style.display = list.length === 0 ? "block" : "none";

  list.forEach((pokemon) => {
    const id = getPokemonId(pokemon);
    const card = buildCard(pokemon, id);
    listWrapper.appendChild(card);
  });
}

function buildCard(pokemon, id) {
  const isFav = favorites.includes(id);
  const imgSrc = officialArtUrl(id);
  const fallback = spriteUrl(id);

  const card = document.createElement("div");
  card.className = "list-item";
  card.dataset.id = id;
  card.innerHTML = `
    <div class="number-wrap">
      <p class="caption-fonts">#${id}</p>
      <button class="fav-btn ${isFav ? "active" : ""}" data-id="${id}" aria-label="Favorite">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                   C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                   c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc}" alt="${pokemon.name}"
           onerror="this.onerror=null;this.src='${fallback}'" loading="lazy" />
    </div>
    <div class="name-wrap">
      <p class="body3-fonts">${pokemon.name}</p>
    </div>
  `;

  card.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return;
    navigateToDetail(id);
  });

  card.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(id, card.querySelector(".fav-btn"));
  });

  return card;
}

async function navigateToDetail(id) {
  try {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    window.location.href = `./detail.html?id=${id}`;
  } catch {
    window.location.href = `./detail.html?id=${id}`;
  }
}

// ─── Favorites ────────────────────────────────────────────────────────────────
function loadFavorites() {
  return JSON.parse(localStorage.getItem("pokeFavorites") || "[]");
}

function saveFavorites() {
  localStorage.setItem("pokeFavorites", JSON.stringify(favorites));
}

function toggleFavorite(id, btn) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
    btn.classList.remove("active");
  } else {
    favorites = [...favorites, id];
    btn.classList.add("active");
  }
  saveFavorites();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getPokemonId(pokemon) {
  return pokemon.url.split("/")[6];
}

function officialArtUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
