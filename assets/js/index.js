import { Levels } from "./levels.js";
let maps = []; // Maps triées

const grid = document.getElementById("gameboard"); // Grille html

let level = 0; // level actuel

let character = {
    type : "men",
    direction: "down",
    state: 0,
    steps: 0,
}

let lastRenderTime = 0; 
function render(time) {
  if (time - lastRenderTime >= 16.67) { // 60fps = 16.67ms par frame
    lastRenderTime = time;
    renderMap();
  }
  requestAnimationFrame(render);
}

function renderMap() {
    const map = maps[level];
    grid.innerHTML = ""; // On vide le contenu de la grille à chaque rendu

    map.forEach(row => {
        row.forEach(col => {
            addBlock(col);
        });
    });
}



function addBlock(type) {
  const newDiv = document.createElement("div"); // On crée une div
  
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
      newDiv.style.backgroundImage = `url('/assets/img/character/${character.type}/${character.direction}/${character.state}.png')`; // modification du personnage en fonction de son objet
      break;
    case 4:
      type = "target";
      break;
  }

  newDiv.classList.add(type); // on y ajouter la classe en fonction de son type 
  grid.appendChild(newDiv); // on l'affiche dans la page
}

//Trie des maps si elle contiennent une box ou non
Levels.forEach(map => {
    if (map.some(row => row.includes(2))) {
        maps.push(map);
    }
})

requestAnimationFrame(render);