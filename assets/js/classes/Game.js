import { Levels } from "../levels.js";
import { addBlock, character } from "../index.js"

export class Game {
    level;
    lastRenderTime = 0;
    maps = [];
    map = [];
    targets = [];
    settings = {
      volume:1,
    };

    constructor (level = 0) {
        this.level = level
        this.sortMaps();
        this.initRound();
    };

    sortMaps() {
        Levels.forEach(map => {
            if (map.some(row => row.includes(2))) {
                this.maps.push(map);
            }
        })
    }

    initRound() {
        this.map = this.maps[this.level];

        for(let row in this.map) {
            for(let col in this.map[row]) {
                if(this.map[row][col] == 3) {
                  character.setPosition([parseInt(row), parseInt(col)]); 
                  this.map[row][col] = 0
                  addBlock(3);
                }
                if(this.map[row][col] == 4) {
                  this.targets.push([parseInt(row), parseInt(col)]); 
                  this.map[row][col] = 0
                  addBlock(4);
                }
              else addBlock(this.map[row][col]);
            };
        };
    }

    changeMap() {
      if (document.querySelectorAll(".good").length == this.targets.length && this.level < this.maps.length) {
        this.map = [];
        this.targets = [];
        this.level ++
        this.initRound() 
      } else if (this.level == this.maps.length) {
        alert(`You won, with ${character.steps}`)
      }
    }
}