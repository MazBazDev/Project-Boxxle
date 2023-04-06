import { Levels } from "./levels.js";

const grid = document.getElementById("gameboard");

let level = 0;

let lastRenderTime = 0;
function render(time) {
  if (time - lastRenderTime >= 16.67) { // 60fps = 16.67ms par frame
    lastRenderTime = time;
    renderMap();
  }
  requestAnimationFrame(render);
}

function renderMap() {
    const map = Levels[level];
    grid.innerHTML = ""; // On vide le contenu de la grille à chaque rendu

    if (hasBox(map)) { // Si la grille contient une box
        map.forEach(row => {
            row.forEach(col => {
                addBlock(col);
            });
        });
    }
}

function hasBox(map) {
    return map.some(row => row.includes(2)) // Vérifie si le tableau contient une bow
}

function addBlock(type) {
  switch (type) {
    case 0:
      type = "floor";
      break;
    case 1:
      type = "wall";
      break;
    case 2:
      type = "crate";
      break;
    case 3:
      type = "player";
      break;
    case 4:
      type = "target";
      break;
  }

  const newDiv = document.createElement("div"); // On crée une div
  newDiv.classList.add(type); // on y ajouter la classe en fonction de son type 
  grid.appendChild(newDiv); // on l'affiche dans la page
}

requestAnimationFrame(render);