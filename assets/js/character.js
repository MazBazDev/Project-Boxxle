import { Character } from "./index.js";

export const keys = {
	up: "z",
	down: "s",
	right: "d",
	left: "q",
};

let isAnimating = false;
let requestId;

function animate() {
	updateState();

	requestId = requestAnimationFrame(animate);
}

document.addEventListener("keypress", function (event) {
	if (Object.values(keys).includes(event.key) && !isAnimating) {
		Character.direction = invertObject(keys)[event.key];;

		isAnimating = true;
		requestId = requestAnimationFrame(animate);
	}
});

document.addEventListener("keyup", function (event) {
	if (Object.values(keys).includes(event.key)) {
		isAnimating = false;

		cancelAnimationFrame(requestId);

		Character.direction = "down";
		Character.state = 0;
	}
});

function invertObject(object) {
	const newObject = {};
	for (let key in object) {
		newObject[object[key]] = key;
	}
	return newObject;
}

let updateCount = 0; // Compteur de mises à jour

function updateState() {
  updateCount ++;

  if (updateCount % 15 === 0) { // Vérification si le compteur est divisible par 6
    if (Character.state === 0 || Character.state === 2) {
      Character.state = 1;
    } else {
      Character.state = 2;
    }
    console.log(Character.state);
  }
}