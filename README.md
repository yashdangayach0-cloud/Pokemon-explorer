## Pokemon Explorer

Pokemon Explorer is a small front-end app for browsing Pokemon data from [PokeAPI](https://pokeapi.co/). It shows a responsive list of Pokemon cards, supports search and sorting, lets you filter by type, and saves favorites and theme preferences in local storage.

### What the app does

- Loads the first 898 Pokemon from PokeAPI
- Shows each Pokemon in a card-based grid
- Supports search by name or number
- Lets users sort by number, name A-Z, or name Z-A
- Filters Pokemon by type
- Saves favorite Pokemon in the browser
- Supports light and dark themes
- Includes a detail page with stats, abilities, and flavor text

### Tech stack

- HTML
- CSS
- JavaScript
- Fetch API
- Local Storage

### API endpoints

- Pokemon list: `https://pokeapi.co/api/v2/pokemon?limit=898`
- Pokemon detail: `https://pokeapi.co/api/v2/pokemon/:id`
- Pokemon species: `https://pokeapi.co/api/v2/pokemon-species/:id`

### Project files

- `index.html`: Home page
- `detail.html`: Pokemon detail page
- `style.css`: Shared styles
- `pokemon.js`: Loads and renders the main Pokemon list
- `search.js`: Search, sorting, type filters, favorites view, and theme toggle
- `pokemon-detail.js`: Detail page rendering and navigation
- `icons.js`: SVG icon injection
