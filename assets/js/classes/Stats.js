import { addDataToTable, character, game } from "../index.js";

export class Stats {
    pseudo;

	constructor() {
        Notiflix.Confirm.prompt(
            "What is your nickname ?",
            "",
            "",
            "Ok",
            "Cancel",
            (clientAnswer) => {
                this.setPseudo(clientAnswer);
            },
            () => {
                this.setPseudo("Ano");
            },
            {}
        );
        this.getDatas()
	}

    setPseudo(pseudo) {
        game.getKeys = true;
        this.pseudo = pseudo
    }

	setDatas() {
        const now = new Date();
        const formattedDate = now.toLocaleString();

		fetch("https://38.242.131.149:3000/data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: this.pseudo,
				steps: character.steps,
                date: formattedDate
			}),
		}).then(() => {
            this.getDatas()
        });
	}

    getDatas() {
        return fetch('https://38.242.131.149:3000/data')
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur de réseau');
            }
            return response.json();
          })
          .then(data => {
            addDataToTable(data)
            return data;
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
          });

    }
}
