import { Levels } from "../levels.js";
import { addBlock } from "../index.js";

export class Game {
	level = 0;
	lastRenderTime = 0;
	keys = {
		up: "arrowup",
		left: "arrowleft",
		down: "arrowdown",
		right: "arrowright",
	};
	maps = [];
	map = [];
	targets = [];
	settings = {
		volume: 1,
	};

	constructor(character) {
		this.sortMaps();
		this.initRound(character);
	}

	// Changement de touche
	updatekey(key, newkey) {
		this.keys[key] = newkey.toLowerCase();
	}

	// On retire les maps qui ne contienne pas de boites
	sortMaps() {
		Levels.forEach((map) => {
		if (map.some((row) => row.includes(2))) {
			this.maps.push(map);
		}
		});
	}

  	// On initiallise la manche
	initRound(character) {
		// On charge la bonne map et on vide les cibles
		this.map = this.maps[this.level];
		this.targets = [];

		for (let row in this.map) {
			for (let col in this.map[row]) {
				// Si on tombe sir le presonnage on le retire de la carte et stoque sa position dans l'objet personnage
				if (this.map[row][col] == 3) {
				character.setPosition([parseInt(row), parseInt(col)]);
				this.map[row][col] = 0;
				addBlock(3);
				}
				// si on tombe sur une cible on la retire de  la carte et la stock parmis les cibles
				else if (this.map[row][col] == 4) {
				this.targets.push([parseInt(row), parseInt(col)]);
				this.map[row][col] = 0;
				addBlock(4);
				} else addBlock(this.map[row][col]);
			}
		}
	}
}
