import {create} from "./utils/create.js";

let gameWrapper = document.createDocumentFragment();

let header = document.createElement("header");
header.innerHTML = ("<h1>Gem Puzzle</h1>");
let navBar = document.createElement("nav");
let actionButtons = create("ul", "<li class=\"start\">Shuffle and start</li><li class=\"score\">High Score</li>","game-options")
let stats = create("ul", `<li class=\"steps\">Steps: <span>${5}</span></li><li class=\"time\">Time: <span>${10}</span></li>`, "game-stats");
navBar.append(actionButtons, stats);
header.append(navBar);

let gameField = create("div", undefined, "game-field");

let footer = document.createElement("footer");
let size = create("div", `Field size: ${"4x4"}`, "size");
let sizeSelect = create("div", `<p>Change field size:<ul><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><ul/></p>`, "size-selector")
footer.append(size, sizeSelect);

gameWrapper.append(header, gameField, footer);
document.body.append(gameWrapper);


class gemPuzzle {
  constructor() {
    this.score = 0;
    this.fieldSize = 4;
  }
  timer() {

  }
  init() {
    for (let i = 1; i < Math.pow(this.fieldSize, 2); i++) {
      let piece = create("div", i, "piece");
      gameField.append(piece);
    }
  }
  start() {

  }
}

let myGame = new gemPuzzle().init();
console.log(footer);