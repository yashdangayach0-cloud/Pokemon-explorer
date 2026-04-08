var MAX_ID = 898;
var IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
var FALLBACK_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

var currentId = null;

var typeColors = {
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

var statNames = {
  "hp":               "HP",
  "attack":           "ATK",
  "defense":          "DEF",
  "special-attack":   "SATK",
  "special-defense":  "SDEF",
  "speed":            "SPD"
};

document.addEventListener("DOMContentLoaded", function() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get("id"));

  if (!id || id < 1 || id > MAX_ID) {
    window.location.href = "./index.html";
    return;
  }

  currentId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    var res     = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
    var pokemon = await res.json();

    var speciesData = null;
    try {
      var sRes    = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + id);
      speciesData = await sRes.json();
    } catch (e) {
      speciesData = null;
    }

    if (currentId !== id) return;

    showPokemon(pokemon, speciesData);
    setupArrows(id);
    window.history.pushState({}, "", "./detail.html?id=" + id);

  } catch (err) {
    console.error("Failed to load pokemon:", err);
  }
}

function showPokemon(pokemon, species) {
  var name = capitalize(pokemon.name);

  document.title = name;
  document.querySelector(".name-wrap .name").textContent = name;
  document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = "#" + pad(pokemon.id);

  var img = document.querySelector(".detail-img-wrapper img");
  img.src = IMG_URL + pokemon.id + ".png";
  img.alt = pokemon.name;
  img.onerror = function() {
    img.onerror = null;
    img.src = FALLBACK_URL + pokemon.id + ".png";
  };

  var typeBox = document.querySelector(".power-wrapper");
  typeBox.innerHTML = "";
  pokemon.types.forEach(function(t) {
    var p = document.createElement("p");
    p.className = "body3-fonts type " + t.type.name;
    p.textContent = t.type.name;
    typeBox.appendChild(p);
  });

  document.querySelector(".weight").textContent = (pokemon.weight / 10) + " kg";
  document.querySelector(".height").textContent = (pokemon.height / 10) + " m";

  var moveBox = document.querySelector(".pokemon-detail.move");
  moveBox.innerHTML = "";
  pokemon.abilities.forEach(function(a) {
    var p = document.createElement("p");
    p.className = "body3-fonts";
    p.textContent = a.ability.name;
    moveBox.appendChild(p);
  });

  var desc = species ? getDescription(species) : "";
  document.querySelector(".pokemon-description").textContent = desc;

  var statsBox = document.querySelector(".stats-wrapper");
  statsBox.innerHTML = "";
  pokemon.stats.forEach(function(s) {
    var row = document.createElement("div");
    row.className = "stats-wrap";

    var label = document.createElement("p");
    label.className = "body3-fonts stats";
    label.textContent = statNames[s.stat.name] || s.stat.name;

    var val = document.createElement("p");
    val.className = "body3-fonts";
    val.textContent = pad(s.base_stat);

    var bar = document.createElement("progress");
    bar.className = "progress-bar";
    bar.value = s.base_stat;
    bar.max = 100;

    row.appendChild(label);
    row.appendChild(val);
    row.appendChild(bar);
    statsBox.appendChild(row);
  });

  applyColor(pokemon);
}

function setupArrows(id) {
  var left  = document.getElementById("leftArrow");
  var right = document.getElementById("rightArrow");

  var newLeft  = left.cloneNode(true);
  var newRight = right.cloneNode(true);
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

function applyColor(pokemon) {
  var type  = pokemon.types[0].type.name;
  var color = typeColors[type];
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

  var r = parseInt(color.slice(1, 3), 16);
  var g = parseInt(color.slice(3, 5), 16);
  var b = parseInt(color.slice(5, 7), 16);

  var style = document.createElement("style");
  style.innerHTML =
    ".stats-wrap .progress-bar::-webkit-progress-bar { background-color: rgba(" + r + "," + g + "," + b + ",0.5); }" +
    ".stats-wrap .progress-bar::-webkit-progress-value { background-color: " + color + "; }";
  document.head.appendChild(style);
}

function getDescription(species) {
  var entries = species.flavor_text_entries;
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].language.name === "en") {
      return entries[i].flavor_text.replace(/\f/g, " ");
    }
  }
  return "";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pad(num) {
  return String(num).padStart(3, "0");
}
