export class Character {
	type;
	direction;
	state = 0;
	steps = 0;
	position = [0, 0];
	isAnimating = false;
	requestId;
	updateCount = 0; // Compteur de mises à jour

	constructor(type = "men", direction = "down") {
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
		let [y, x] = this.position;

		if (y == 0) return;
		if (map[y - 1][x] != 0 && map[y - 1][x] != 2) return;
		if (map[y - 1][x] == 2) if (await this.moveBox(map, -1, 0)) return;

		this.setPosition([y - 1, x]);
	}

	async goDown(map) {
		let [y, x] = this.position;

		if (y == map.lenght - 1) return;
		if (map[y + 1][x] != 0 && map[y + 1][x] != 2) return;
		if (map[y + 1][x] == 2) if (await this.moveBox(map, 1, 0)) return;
		this.setPosition([y + 1, x]);
	}

	async goLeft(map) {
		let [y, x] = this.position;

		if (x == 0) return;
		if (map[y][x - 1] != 0 && map[y][x - 1] != 2) return;
		if (map[y][x - 1] == 2) if (await this.moveBox(map, 0, -1)) return;

		this.setPosition([y, x - 1]);
	}

	async goRight(map) {
		let [y, x] = this.position;

		if (x == map[y].lenght - 1) return;
		if (map[y][x + 1] != 0 && map[y][x + 1] != 2) return;
		if (map[y][x + 1] == 2) if (await this.moveBox(map, 0, 1)) return;

		this.setPosition([y, x + 1]);
	}

	async moveBox(map, verical, horizontal) {
		let [y, x] = this.position;
		return new Promise(function (resolve, reject) {
			if (map[y + verical * 2][x + horizontal * 2] == 0) {
				map[y + verical * 2][x + horizontal * 2] = 2;
				map[y + verical][x + horizontal] = 0;
				resolve(false);
			}
			if (map[y + verical * 2][x + horizontal * 2] == 4) {
				map[y + verical * 2][x + horizontal * 2] = 2;
				map[y + verical][x + horizontal] = 4;
				resolve(false);
			}
			resolve(true);
		}).then(
			(result) => {
				return result;
			},
			(error) => alert(error)
		);
	}
    
	invertObject(object) {
		const newObject = {};
		for (let key in object) {
			newObject[object[key]] = key;
		}
		return newObject;
	}

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
}
