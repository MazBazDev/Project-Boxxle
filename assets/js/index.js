import { Character } from "./classes/Character.js";
import { Game } from "./classes/Game.js";

const grid = document.getElementById("gameboard"); // Grille html

const character = new Character();
const game = new Game(character);

// function invertObject(object) {
//   const newObject = {};
//   for (let key in object) {
//     newObject[object[key]] = key;
//   }
//   return newObject;
// }

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()
  if(Object.values(game.keys).includes(key)) {
    if (key == game.keys.up) character.goUp(game.map);
    if (key == game.keys.down) character.goDown(game.map);
    if (key == game.keys.left) character.goLeft(game.map);
    if (key == game.keys.right) character.goRight(game.map);
  }
}, false);

function render(time) {
  if (time - game.lastRenderTime >= 16.67) { // 60fps = 16.67ms par frame
    game.lastRenderTime = time;
    renderMap();
  }
  requestAnimationFrame(render);
}

function compareArrays(a,b) {
  return JSON.stringify(a) == JSON.stringify(b)
}

function isTarget(cellule, targets) {
  for(let target of targets) {
    if(compareArrays(cellule, target)) return true
  }
  return false
}

function renderMap(debug = false) {
    game.map = game.maps[game.level];
    grid.innerHTML = ""; // On vide le contenu de la grille à chaque rendu

    for(let row in game.map) {
        for(let col in game.map[row]) {
          if (compareArrays(character.position, [parseInt(row), parseInt(col)])) addBlock(3);
          else if (isTarget([parseInt(row), parseInt(col)], game.targets) && game.map[row][col] != 2) addBlock(4);
          else addBlock(game.map[row][col]);
        };
    };
}

export function addBlock(type) {
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
      newDiv.style.backgroundImage = `url('/assets/img/character/${Character.type}/${Character.direction}/${Character.state}.png')`; // modification du personnage en fonction de son objet
      break;
    case 4:
      type = "target";
      break;
  }

  newDiv.classList.add(type); // on y ajouter la classe en fonction de son type 
  grid.appendChild(newDiv); // on l'affiche dans la page
}

requestAnimationFrame(render);