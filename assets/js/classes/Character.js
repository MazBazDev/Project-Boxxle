import { game } from "../index.js";

export class Character {
	type;
	direction;
	state = 0;
	steps = 0;
	position = [0, 0];
	isAnimating = false;
	requestId;
	updateCount = 0; // Compteur de mises à jour

	constructor(type = "0", direction = "down") {
		this.setType(type);
		this.setDirection(direction);
	}

	setType(type) {
		this.type = type;
	}

	setDirection(direction) {
		this.direction = direction;
	}

	setPosition(position) {
		this.position = position;
	}

	getPosition() {
		return this.position;
	}

	async goUp(map) {
		// On recupere les coordonees du personnage
		let [y, x] = this.position;

		// Si le personnage est deja en haut on ne fait rien
		if (y == 0) return;
		// Si le personnage est sous un mur
		if (map[y - 1][x] != 0 && map[y - 1][x] != 2) return;
		// Si le personnage est sous une boite on essaye de la deplacer. en cas d'echec on abandonne
		if (map[y - 1][x] == 2) if (await this.moveBox(map, -1, 0)) return;

		// On deplace le personnage, incremente le compteur de pas et joue un bruit de pas
		this.setPosition([y - 1, x]);
		this.steps++;
		this.walkSound();
	}

	async goDown(map) {
		// On recupere les coordonees du personnage
		let [y, x] = this.position;

		// Si le personnage est deja en bas on ne fait rien
		if (y == map.lenght - 1) return;
		// Si le personnage est sur un mur
		if (map[y + 1][x] != 0 && map[y + 1][x] != 2) return;
		// Si le personnage est sur une boite on essaye de la deplacer. en cas d'echec on abandonne
		if (map[y + 1][x] == 2) if (await this.moveBox(map, 1, 0)) return;

		// On deplace le personnage, incremente le compteur de pas et joue un bruit de pas
		this.setPosition([y + 1, x]);
		this.steps++;
		this.walkSound();

	}

	async goLeft(map) {
		// On recupere les coordonees du personnage
		let [y, x] = this.position;

		// Si le personnage est deja tt a gauche on ne fait rien
		if (x == 0) return;
		// Si le personnage est a droite d'un mur
		if (map[y][x - 1] != 0 && map[y][x - 1] != 2) return;
		// Si le personnage est a droite d'une boite on essaye de la deplacer. en cas d'echec on abandonne
		if (map[y][x - 1] == 2) if (await this.moveBox(map, 0, -1)) return;

		// On deplace le personnage, incremente le compteur de pas et joue un bruit de pas
		this.setPosition([y, x - 1]);
		this.steps++;
		this.walkSound();

	}

	async goRight(map) {
		// On recupere les coordonees du personnage
		let [y, x] = this.position;

		// Si le personnage est deja tt a droite on ne fait rien
		if (x == map[y].lenght - 1) return;
		// Si le personnage est a gauche d'un mur
		if (map[y][x + 1] != 0 && map[y][x + 1] != 2) return;
		// Si le personnage est a gauche d'une boite on essaye de la deplacer. en cas d'echec on abandonne
		if (map[y][x + 1] == 2) if (await this.moveBox(map, 0, 1)) return;

		// On deplace le personnage, incremente le compteur de pas et joue un bruit de pas
		this.setPosition([y, x + 1]);
		this.steps++;
		this.walkSound();

	}

	async moveBox(map, verical, horizontal) {
		// On recupere les coordonees du personnage
		let [y, x] = this.position;

		// On force le code a attendre
		return new Promise(function (resolve, reject) {
			// Si la deuxieme cellule dans la direction ou l'on veut aller est disponible on deplace la boite
			if (map[y + verical * 2][x + horizontal * 2] == 0) {
				map[y + verical * 2][x + horizontal * 2] = 2;
				map[y + verical][x + horizontal] = 0;
				// Pas de probleme
				resolve(false);
			}
			// Mouvement impossible
			resolve(true);
		}).then(
			// On renvoie si le mouvement a echoue
			(result) => {
				return result;
			}
		);
	}

	// On echange les cles et valeurs d'un objet
	invertObject(object) {
		const newObject = {};
		for (let key in object) {
			newObject[object[key]] = key;
		}
		return newObject;
	}

	// On change la forme du perssonage pour donner une ilusion de mouvement
	updateState() {
		this.updateCount++;

		if (this.updateCount % 15 === 0) {
			// Vérification si le compteur est divisible par 15
			if (this.state === 0 || this.state === 2) {
				this.state = 1;
			} else {
				this.state = 2;
			}
		}
	}

	// On joue un son de pas
	walkSound() {
		const audio = new Audio("/assets/sounds/footStep.mp3");
		audio.loop = false;
		audio.volume = game.settings.volume
		audio.play();
	}
}
