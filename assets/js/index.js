// On charge les class Personnage et Partie
import { Character } from "./classes/Character.js";
import { Game } from "./classes/Game.js";

// Paramettres par defauts
const defaultKeys = {
	up: 'arrowup',
	down: 'arrowdown',
	right: 'arrowright',
	left: 'arrowleft',
}

// Grille html
const grid = document.getElementById("gameboard");

// On initialise le personnage et la partie
export let character = new Character();
export let game = new Game(0);

let keys = {
  up: 'z',
  left: 'q',
  down: 's',
  right: 'd'
};

// Quand une touche est pressee
document.addEventListener(
	"keydown",
	(event) => {
		// On recupere la touche en question
		const key = event.key.toLowerCase();
		// Si elle concerne une touche du jeu
		if (Object.values(keys).includes(key)) {
		// On deplace le personnage
		switch (key) {
			case keys.up: {
			character.goUp(game.map);
			break;
			}
			case keys.down: {
			character.goDown(game.map);
			break;
			}
			case keys.left: {
			character.goLeft(game.map);
			break;
			}
			case keys.right: {
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
			character.direction = character.invertObject(keys)[key];
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
	if (Object.values(keys).includes(key)) {
		/*
		* On arrete le personnage
		* puis on le remet dans sa position initiale
		*/
		character.isAnimating = false;
		cancelAnimationFrame(character.requestId);

		character.direction = "down";
		character.state = 0;

    game.changeMap();
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

// Recuperation des elements HTML pour les parametres
let modal = document.getElementById("settings");
let btn = document.getElementById("settingsButton");
let span = document.getElementsByClassName("close")[0];
let changeKeyFields = document.querySelectorAll(".change-key");
let chooseCharacter = document.querySelectorAll(".choose-character")[0];

// Quand le boutton "ouvrir les parametres" est trigger
btn.onclick = function () {
	//Afficher les parametres
	modal.style.display = "flex";
};

// Recupere la premiere touche presse 
// modifie le personnage et l'affichage
// puis supprime le listener
function waitNewKey(event) {
	const newKey = event.key;
	const changeKeyField = document.getElementById(event.currentTarget.changingKey);
	const text = changeKeyField.getElementsByClassName('text')[0];

	game.updatekey(changeKeyField.id, newKey);
	text.innerHTML = newKey + ' 📝';
	document.removeEventListener('keydown', waitNewKey)
}

// Configure toutes les ecoutes
for (let changeKeyField of changeKeyFields) {
	const switchDefaultButton = changeKeyField.getElementsByTagName('button')[0];
	const text = changeKeyField.getElementsByClassName('text')[0];
	
	// Initialise la valeur du text a la valeur actuelle
	text.innerHTML = game.keys[changeKeyField.id] + ' 📝';
	text.onclick = function () {
		// Affiche "waiting ..." en attendant l'entree de l'utilisateur
		text.innerHTML = "Waiting ..."
		// Configure le listener
		document.addEventListener("keydown", waitNewKey);
		// Ajoute la direction en cours de modification au document 
		// (impossible de mettres des args dans la fonction du listener)
		document.changingKey = changeKeyField.id
	}

	// Remets les valeurs par defaut quand le bouton est appuye
	switchDefaultButton.onclick = function () {
		const defaultKey = defaultKeys[changeKeyField.id];

		game.updatekey(changeKeyField.id, defaultKey);
		text.innerHTML = defaultKey + ' 📝';
	}


}

chooseCharacter.onclick = function() {
	character.type = slideIndex
}

// Quand on clique sur la croix
span.onclick = function () {
	// Cacher les parametres
	modal.style.display = "none";
};

// Quand on clique ailleurs que sur le modal
window.onclick = function (event) {
	if (event.target == modal) {
		// Cacher les parametres
		modal.style.display = "none";
	}
};

let slideIndex = 0;
const carouselSlide = document.querySelector('.carousel-slide');
const slides = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slideWidth = slides[0].clientWidth;

// Set the first slide to be visible
carouselSlide.style.transform = `translateX(-${slideWidth * (slideIndex)}px)`;

// Move to the previous slide
export function prevSlide() {
  if (slideIndex < 0) {
    return;
  }
  slideIndex--;
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  carouselSlide.style.transform = `translateX(-${slideWidth * (slideIndex)}px)`;
}

// Move to the next slide
export function nextSlide() {
  if (slideIndex >= slides.length -1) {
    return;
  }
  slideIndex++;
  carouselSlide.style.transition = "transform 0.4s ease-in-out";
  carouselSlide.style.transform = `translateX(-${slideWidth * (slideIndex)}px)`;
}

// Add event listeners to the prev/next buttons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
