import { Levels } from "../levels.js";
import { addBlock, character, restart, playSound, stats} from "../index.js";

export class Game {
	getKeys = false;
	pseudo = "";
	level;
	lastRenderTime = 0;
	maps = [];
	map = [];
	targets = [];
	settings = {
		volume: 1,
		keys : {
			default: {
				up: 'arrowup',
				down: 'arrowdown',
				right: 'arrowright',
				left: 'arrowleft',
			},
			up: 'arrowup',
			down: 'arrowdown',
			right: 'arrowright',
			left: 'arrowleft',
		}
	};
	

	constructor(level = 0, reset = false, settings) {
		this.level = level;
		if (settings) {
			this.settings = settings;
		}

		this.sortMaps(reset);
		this.initRound();
	}

	// On retire les maps qui ne contienne pas de boites
	sortMaps(reset) {
		let mapRemoved = 0;
		Levels.forEach((Level) => {
			var map = [];
			for (let row of Level) map.push([...row]);
			if (map.some((row) => row.includes(3))) {
				this.maps.push([...map]);
			} else {
				mapRemoved++
			}
		});

		if(mapRemoved && !reset) {
			Notiflix.Notify.failure(`${mapRemoved} map was removed !`)
		}
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
		if (document.querySelectorAll(".good").length == this.targets.length && this.level < this.maps.length) {
			this.map = [];
			this.targets = [];
			this.level++;
			this.initRound();
			playSound("nextLevel")
		} 
		

		if (this.level == this.maps.length) {
			Notiflix.Report.success(
				'GG !',
				`You finished all levels, in ${character.steps} steps`,
				'Restart !',
			);
			playSound("win")
			stats.setDatas()
			restart()
		}
	}

	updatekey (key, newKey) {
		this.settings.keys[key] = newKey;
	}
}
