import { Levels } from "../levels.js";
import { addBlock, character, game } from "../index.js";
import { Character } from "./Character.js";

export class Game {
	level;
	lastRenderTime = 0;
	maps = [];
	map = [];
	targets = [];
	settings = {
		volume: 1,
	};
	keys = {
		up: 'arrowup',
		down: 'arrowdown',
		right: 'arrowright',
		left: 'arrowleft',
	};

	constructor(level = 0) {
		this.level = level;
		this.sortMaps();
		this.initRound();
	}

	// On retire les maps qui ne contienne pas de boites
	sortMaps() {
		Levels.forEach((Level) => {
			var map = [];
			for (let row of Level) map.push([...row]);
			if (map.some((row) => row.includes(2))) {
				this.maps.push([...map]);
			}
		});
	}

	initRound() {
		this.map = this.maps[this.level];
		// On charge la bonne map et on vide les cibles
		for (let row in this.map) {
			for (let col in this.map[row]) {
				// Si on tombe sir le presonnage on le retire de la carte et stoque sa position dans l'objet personnage
				if (this.map[row][col] == 3) {
					character.setPosition([parseInt(row), parseInt(col)]);
					this.map[row][col] = 0;
					addBlock(3);
				}
				// si on tombe sur une cible on la retire de  la carte et la stock parmis les cibles
				if (this.map[row][col] == 4) {
					this.targets.push([parseInt(row), parseInt(col)]);
					this.map[row][col] = 0;
					addBlock(4);
				} else addBlock(this.map[row][col]);
			}
		}
	}

	changeMap() {
		if (
			document.querySelectorAll(".good").length == this.targets.length &&
			this.level < this.maps.length
		) {
			this.map = [];
			this.targets = [];
			this.level++;
			this.initRound();
		} else if (this.level == this.maps.length) {
			alert(`You won, with ${character.steps}`);
		}
	}

	updatekey (key, newKey) {
		this.keys[key] = newKey;
	}
}
