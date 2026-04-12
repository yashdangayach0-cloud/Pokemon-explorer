const MAX_ID = 898;
const IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const FALLBACK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

let currentId = null;

const typeColors = {
  normal:   "#A8A878",
  fire:     "#F08030",
  water:    "#6890F0",
  electric: "#F8D030",
  grass:    "#78C850",
  ice:      "#98D8D8",
  fighting: "#C03028",
  poison:   "#A040A0",
  ground:   "#E0C068",
  flying:   "#A890F0",
  psychic:  "#F85888",
  bug:      "#A8B820",
  rock:     "#B8A038",
  ghost:    "#705898",
  dragon:   "#7038F8",
  dark:     "#705848",
  steel:    "#B8B8D0",
  fairy:    "#EE99AC"
};

const statNames = {
  "hp":              "HP",
  "attack":          "ATK",
  "defense":         "DEF",
  "special-attack":  "SATK",
  "special-defense": "SDEF",
  "speed":           "SPD"
};

document.addEventListener("DOMContentLoaded", function() {
  let params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get("id"));

  if (!id || id < 1 || id > MAX_ID) {
    window.location.href = "./index.html";
    return;
  }

  currentId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    let res = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
    let dataa = await res.json();

    let speciesData = null;
    try {
      let sRes = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + id);
      speciesData = await sRes.json();
    } catch (e) {
      speciesData = null;
    }

    if (currentId !== id) return;

    showPokemon(dataa, speciesData);
    setupArrows(id);
    window.history.pushState({}, "", "./detail.html?id=" + id);

  } catch (err) {
    console.error("Failed to load:", err);
  }
}

function showPokemon(dataa, species) {
  let name = dataa.name.charAt(0).toUpperCase() + dataa.name.slice(1);

  document.title = name;
  document.querySelector(".name-wrap .name").textContent = name;
  document.querySelector(".detail-header .pokemon-id-wrap .body2-fonts").textContent = "#" + String(dataa.id).padStart(3, "0");

  let img = document.querySelector(".detail-img-wrapper img");
  img.src = IMG + dataa.id + ".png";
  img.alt = dataa.name;
  img.onerror = function() {
    img.onerror = null;
    img.src = FALLBACK + dataa.id + ".png";
  };

  let typeBox = document.querySelector(".power-wrapper");
  typeBox.innerHTML = "";
  for (let t of dataa.types) {
    let p = document.createElement("p");
    p.className = "body3-fonts type " + t.type.name;
    p.textContent = t.type.name;
    typeBox.appendChild(p);
  }

  document.querySelector(".weight").textContent = (dataa.weight / 10) + " kg";
  document.querySelector(".height").textContent = (dataa.height / 10) + " m";

  let moveBox = document.querySelector(".pokemon-detail.move");
  moveBox.innerHTML = "";
  for (let a of dataa.abilities) {
    let p = document.createElement("p");
    p.className = "body3-fonts";
    p.textContent = a.ability.name;
    moveBox.appendChild(p);
  }

  let desc = species ? getDesc(species) : "";
  document.querySelector(".pokemon-description").textContent = desc;

  let statsBox = document.querySelector(".stats-wrapper");
  statsBox.innerHTML = "";

  for (let s of dataa.stats) {
    let row = document.createElement("div");
    row.className = "stats-wrap";

    let label = document.createElement("p");
    label.className = "body3-fonts stats";
    label.textContent = statNames[s.stat.name] || s.stat.name;

    let val = document.createElement("p");
    val.className = "body3-fonts";
    val.textContent = String(s.base_stat).padStart(3, "0");

    let bar = document.createElement("progress");
    bar.className = "progress-bar";
    bar.value = s.base_stat;
    bar.max = 100;

    row.appendChild(label);
    row.appendChild(val);
    row.appendChild(bar);
    statsBox.appendChild(row);
  }

  applyColor(dataa);
}

function setupArrows(id) {
  let left = document.getElementById("leftArrow");
  let right = document.getElementById("rightArrow");

  let newLeft = left.cloneNode(true);
  let newRight = right.cloneNode(true);
  left.parentNode.replaceChild(newLeft, left);
  right.parentNode.replaceChild(newRight, right);

  if (id === 1) {
    newLeft.classList.add("hidden");
  } else {
    newLeft.classList.remove("hidden");
    newLeft.addEventListener("click", function(e) {
      e.preventDefault();
      currentId = id - 1;
      loadPokemon(id - 1);
    });
  }

  if (id === MAX_ID) {
    newRight.classList.add("hidden");
  } else {
    newRight.classList.remove("hidden");
    newRight.addEventListener("click", function(e) {
      e.preventDefault();
      currentId = id + 1;
      loadPokemon(id + 1);
    });
  }
}

function applyColor(dataa) {
  let type = dataa.types[0].type.name;
  let color = typeColors[type];
  if (!color) return;

  document.querySelector(".detail-main").style.backgroundColor = color;

  document.querySelectorAll(".power-wrapper > p").forEach(function(el) {
    el.style.backgroundColor = color;
  });

  document.querySelectorAll(".stats-wrap p.stats").forEach(function(el) {
    el.style.color = color;
  });

  document.querySelectorAll(".stats-wrap .progress-bar").forEach(function(el) {
    el.style.color = color;
  });

  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  let style = document.createElement("style");
  style.innerHTML =
    ".stats-wrap .progress-bar::-webkit-progress-bar { background-color: rgba(" + r + "," + g + "," + b + ",0.5); }" +
    ".stats-wrap .progress-bar::-webkit-progress-value { background-color: " + color + "; }";
  document.head.appendChild(style);
}

function getDesc(species) {
  let entries = species.flavor_text_entries;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].language.name === "en") {
      return entries[i].flavor_text.replace(/\f/g, " ");
    }
  }
  return "";
}
