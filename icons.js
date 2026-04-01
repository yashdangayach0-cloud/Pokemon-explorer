const icons = {
  pokeball: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#333" stroke-width="3"/>
    <path d="M2 50 Q2 2 50 2 Q98 2 98 50Z" fill="#dc0a2d"/>
    <rect x="2" y="47" width="96" height="6" fill="#333"/>
    <circle cx="50" cy="50" r="12" fill="white" stroke="#333" stroke-width="3"/>
    <circle cx="50" cy="50" r="6" fill="white" stroke="#333" stroke-width="2"/>
  </svg>`,

  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#dc0a2d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="10.5" cy="10.5" r="7"/>
    <line x1="16" y1="16" x2="22" y2="22"/>
  </svg>`,

  cross: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  sorting: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
    <line x1="9" y1="18" x2="15" y2="18"/>
  </svg>`,

  backToHome: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`,

  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`,

  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,

  weight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="6" r="3"/>
    <path d="M6.5 20h11l-2-10H8.5z"/>
  </svg>`,

  height: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <polyline points="7 7 12 2 17 7"/>
    <polyline points="7 17 12 22 17 17"/>
  </svg>`,

  pokedex: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="95" fill="none" stroke="white" stroke-width="8"/>
    <path d="M5 100 Q5 5 100 5 Q195 5 195 100Z" fill="white"/>
    <rect x="5" y="92" width="190" height="16" fill="white"/>
    <circle cx="100" cy="100" r="28" fill="white" stroke="white" stroke-width="4"/>
    <circle cx="100" cy="100" r="14" fill="none" stroke="white" stroke-width="4"/>
  </svg>`,

  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
             2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
             c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`,

  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`,

  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`,
};

const iconKeyMap = {
  "pokeball":      "pokeball",
  "search":        "search",
  "cross":         "cross",
  "sorting":       "sorting",
  "back-to-home":  "backToHome",
  "chevron-left":  "chevronLeft",
  "chevron-right": "chevronRight",
  "weight":        "weight",
  "height":        "height",
  "pokedex":       "pokedex",
  "heart":         "heart",
  "moon":          "moon",
  "sun":           "sun",
};

function injectIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const key = iconKeyMap[el.getAttribute("data-icon")];
    if (key && icons[key]) el.innerHTML = icons[key];
  });
}

document.addEventListener("DOMContentLoaded", injectIcons);
