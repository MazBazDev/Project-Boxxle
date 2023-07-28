// On charge les class Personnage et Partie
import { Character } from "./classes/Character.js";
import { Game } from "./classes/Game.js";
import { Stats } from "./classes/Stats.js";

// Grille html
const grid = document.getElementById("gameboard");

// On initialise le personnage et la partie
export let character = new Character();
export let game = new Game(0);

export const stats = new Stats();

if (localStorage.getItem("settings")) {
	game.settings = JSON.parse(localStorage.getItem("settings"));
	character.type = localStorage.getItem("character");
}
// Quand une touche est pressee
document.addEventListener(
	"keydown",
	(event) => {
		// On recupere la touche en question
		const key = event.key.toLowerCase();
		// Si elle concerne une touche du jeu
		if (
			Object.values(game.settings.keys).includes(key) &&
			game.getKeys
		) {
			// On deplace le personnage
			switch (key) {
				case game.settings.keys.up: {
					character.goUp(game.map);
					break;
				}
				case game.settings.keys.down: {
					character.goDown(game.map);
					break;
				}
				case game.settings.keys.left: {
					character.goLeft(game.map);
					break;
				}
				case game.settings.keys.right: {
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
				character.direction = character.invertObject(game.settings.keys)[key];
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
	if (Object.values(game.settings.keys).includes(key)) {
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

document.getElementById("reset").addEventListener("click", () => {
	game = new Game(game.level, true, game.settings);
	game.getKeys = true;
});

export function restart() {
	character = new Character(character.type);
	game = new Game(0, false, game.settings);
	game.getKeys = true;
}

requestAnimationFrame(render);

// Recuperation des elements HTML pour les parametres
let modal = document.getElementById("settings");
let btn = document.getElementById("settingsButton");
let span = document.getElementsByClassName("close")[0];
let changeKeyFields = document.querySelectorAll(".change-key");

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
	const changeKeyField = document.getElementById(
		event.currentTarget.changingKey
	);
	const text = changeKeyField.getElementsByClassName("text")[0];

	game.updatekey(changeKeyField.id, newKey);
	text.innerHTML = newKey + " 📝";
	document.removeEventListener("keydown", waitNewKey);
}

// Configure toutes les ecoutes
for (let changeKeyField of changeKeyFields) {
	const switchDefaultButton = changeKeyField.getElementsByTagName("button")[0];
	const text = changeKeyField.getElementsByClassName("text")[0];

	// Initialise la valeur du text a la valeur actuelle
	text.innerHTML = game.settings.keys[changeKeyField.id] + " 📝";
	text.onclick = function () {
		// Affiche "waiting ..." en attendant l'entree de l'utilisateur
		text.innerHTML = "Waiting ...";
		// Configure le listener
		document.addEventListener("keydown", waitNewKey);
		// Ajoute la direction en cours de modification au document
		// (impossible de mettres des args dans la fonction du listener)
		document.changingKey = changeKeyField.id;
	};

	// Remets les valeurs par defaut quand le bouton est appuye
	switchDefaultButton.onclick = function () {
		const defaultKey = game.settings.keys.default[changeKeyField.id];

		game.updatekey(changeKeyField.id, defaultKey);
		text.innerHTML = defaultKey + " 📝";
	};
}

// Mise à jour du volume en fonction de l'input
const volumeInput = document.querySelector("input[type=range]");
const volumeOutput = document.getElementById("volumeOut");

volumeInput.value = game.settings.volume;
volumeOutput.innerHTML = game.settings.volume * 100 + "%";

volumeInput.addEventListener("input", (event) => {
	volumeOutput.innerHTML = Math.round(volumeInput.value * 100) + "%";
	game.settings.volume = volumeInput.value;
});

// Quand on clique sur la croix
span.onclick = function () {
	// Cacher les parametres
	modal.style.display = "none";
	Notiflix.Notify.success("Settings saved !");
	saveSettings();
};

// Quand on clique ailleurs que sur le modal
window.onclick = function (event) {
	if (event.target == modal) {
		// Cacher les parametres
		modal.style.display = "none";
	}
};

let image = document.querySelector(".carousel-slide img");

// Move to the previous slide
export function prevSlide() {
	if (character.type > 0) {
		character.type--;
		image.src = `./assets/img/character/${character.type}/down/0.png`;
	}
}

// Move to the next slide
export function nextSlide() {
	if (character.type < 4) {
		character.type++;
		image.src = `./assets/img/character/${character.type}/down/0.png`;
	}
}

// Add event listeners to the prev/next buttons
document.querySelector(".prev").addEventListener("click", prevSlide);
document.querySelector(".next").addEventListener("click", nextSlide);

export function playSound(sound) {
	const audio = new Audio(`/assets/sounds/${sound}.mp3`);
	audio.loop = false;
	audio.volume = game.settings.volume;
	audio.play();
}

function saveSettings() {
	localStorage.setItem("settings", JSON.stringify(game.settings));
	localStorage.setItem("character", character.type);
}

// window.addEventListener("beforeunload", function(event) {
// 	// Afficher la boîte de dialogue
// 	event.preventDefault();
// 	event.returnValue = "";
// 	return "";
//   });

let konamiCode = []; // Tableau pour stocker les touches pressées
const konamiSequence = [
	"arrowup",
	"arrowup",
	"arrowdown",
	"arrowdown",
	"arrowleft",
	"arrowright",
	"arrowleft",
	"arrowright",
	"b",
	"a",
]; // Séquence de touches à détecter

function konamiCodeDetector(event) {
	konamiCode.push(event.key.toLowerCase()); // Ajoute la touche pressée au tableau
	konamiCode.splice(
		-konamiSequence.length - 1,
		konamiCode.length - konamiSequence.length
	); // Supprime les touches en trop

	if (konamiCode.join() === konamiSequence.join()) {
		// Vérifie si la séquence est complète
		window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0");
	}
}
document.addEventListener("keyup", konamiCodeDetector);

export function addDataToTable(data) {
	const table = document.getElementById("stats");
	// Supprime toutes les lignes du tableau
	while (table.rows.length > 1) {
	  table.deleteRow(-1);
	}
  
	// Ajoute une nouvelle ligne avec les données passées en paramètre
	data.forEach(element => {
		const newRow = table.insertRow();
		const usernameCell = newRow.insertCell();
		usernameCell.innerText = element.username;
		const stepsCell = newRow.insertCell();
		stepsCell.innerText = element.steps;
		const dateCell = newRow.insertCell();
		dateCell.innerText = element.date;
	});
}
