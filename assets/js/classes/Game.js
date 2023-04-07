import { Levels } from "../levels.js";
import { addBlock } from "../index.js"

export class Game {
    level = 0;
    lastRenderTime = 0;
    keys = {
      up: 'z',
      left: 'q',
      down: 's',
      right: 'd'
    };
    maps = [];
    map = [];
    targets = []

    constructor (character) {
        this.sortMaps();
        this.initRound(character);
    };

    sortMaps() {
        Levels.forEach(map => {
            if (map.some(row => row.includes(2))) {
                this.maps.push(map);
            }
        })
    }

    initRound(character) {
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
}