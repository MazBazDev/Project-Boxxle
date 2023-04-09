// On charge les class Personnage et Partie
import { Character } from "./classes/Character.js";
import { Game } from "./classes/Game.js";

// Grille html
const grid = document.getElementById("gameboard");

// On initialise le personnage et la partie
const character = new Character();
export const game = new Game(character);

// Quand une touche est pressee
document.addEventListener(
	"keydown",
	(event) => {
		// On recupere la touche en question
		const key = event.key.toLowerCase();
		// Si elle concerne une touche du jeu
		if (Object.values(game.keys).includes(key)) {
		// On deplace le personnage
		switch (key) {
			case game.keys.up: {
			character.goUp(game.map);
			break;
			}
			case game.keys.down: {
			character.goDown(game.map);
			break;
			}
			case game.keys.left: {
			character.goLeft(game.map);
			break;
			}
			case game.keys.right: {
			character.goRight(game.map);
			break;
			}
			default: {
			break;
			}
		}

		/*
		* si le personnage est immobile,
		* on le fait bouger dans la bonne direction
		*/
		if (!character.isAnimating) {
			character.direction = character.invertObject(game.keys)[key];
			character.isAnimating = true;
			character.requestId = requestAnimationFrame(animate);
		}
		}
	},
	false
);

// Quand une touche est relachee
document.addEventListener("keyup", function (event) {
	// On recupere la touche en question
	const key = event.key.toLowerCase();
	// Si elle concerne une touche du jeu
	if (Object.values(game.keys).includes(key)) {
		/*
		* On arrete le personnage
		* puis on le remet dans sa position initiale
		*/
		character.isAnimating = false;
		cancelAnimationFrame(character.requestId);

		character.direction = "down";
		character.state = 0;
	}
});

function animate() {
	character.updateState();
	character.requestId = requestAnimationFrame(animate);
}

// Compare deux arrays
function compareArrays(a, b) {
	return JSON.stringify(a) == JSON.stringify(b);
}

// Verifie si la cellule correspond a une cible
function isTarget(cellule, targets) {
	for (let target of targets) {
		if (compareArrays(cellule, target)) return true;
	}
	return false;
}

// On refresh le jeu a interval regulier pour donner l'illusion d'un mouvement
function render(time) {
	// 60fps = 16.67ms par frame
	if (time - game.lastRenderTime >= 16.67) {
		game.lastRenderTime = time;
		renderMap();

		// Afficher les steps
		document.getElementById("steps_count").innerHTML = character.steps;
	}
	requestAnimationFrame(render);
}

// Affiche le jeu dans son etat le plus actuel
function renderMap() {
	game.map = game.maps[game.level];
	// On vide le contenu de la grille à chaque rendu
	grid.innerHTML = "";

	for (let row in game.map) {
		for (let col in game.map[row]) {
		// Si la case est celle du personnage
		if (compareArrays(character.position, [parseInt(row), parseInt(col)]))
			addBlock(3);
		// Si la case est une cible
		else if (
			isTarget([parseInt(row), parseInt(col)], game.targets) &&
			game.map[row][col] != 2
		)
			addBlock(4);
		// Si la case est une boite bien placee
		else if (
			isTarget([parseInt(row), parseInt(col)], game.targets) &&
			game.map[row][col] == 2
		)
			addBlock(5);
		// Si la case est un sol, un mur ou une boite mal placee
		else addBlock(game.map[row][col]);
		}
	}
}

// Ajoute un block dans la grille
export function addBlock(type) {
	// On crée une div
	const newDiv = document.createElement("div");

	// On remplace le type par le nom de la class qui lui correspond
	// Ou on mets un fond a la case dans le cas ou la case contient le personnage
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
		case 5:
		type = "good";
		break;
	}

	// On ajoute la class choisie a la div
	newDiv.classList.add(type);
	// on l'affiche dans la page
	grid.appendChild(newDiv);
}

requestAnimationFrame(render);
