import {create} from "./utils/create.js";

export class GemPuzzle {
  constructor() {
    this.steps = 0;
    this.fieldSize = 4;
    this.fieldWidth = 400;
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.fieldWidth;
    this.canvas.height = this.fieldWidth;
    this.ctx = this.canvas.getContext("2d");
    this.pieceSize = this.fieldWidth / this.fieldSize;
    this.textPaddingSingleX = Math.round(this.pieceSize / 2.44);
    this.textPaddingBothY = Math.round(this.pieceSize / 1.61);
    this.textPaddingDoubleX = Math.round(this.pieceSize / 3.03);
    this.timeString = "00:00";
    this.fontSizes = {
      3: "36",
      4: "36",
      5: "24",
      6: "24",
      7: "18",
      8: "18"
    }

    this.idList = [];
    this.pieceList = [];
    this.winPosition = [];
    let idCounter = 1;
    let yCounter = 0;
    for (let r = 0; r < this.fieldSize; r++) {
      let xCounter = 0;
      this.pieceList.push([]);
      this.winPosition.push([]);
      for (let c = 0; c < this.fieldSize; c++) {
        if (r === this.fieldSize -1 && c === this.fieldSize -1) {
          this.winPosition[r].push(
            {
              id:"empty",
              x: xCounter,
              y: yCounter,
            } 
          )
          this.pieceList[r].push(
            {
              id:"empty",
              x: xCounter,
              y: yCounter,

            } 
          )
        } else {
          this.idList.push(`${idCounter}`);
          this.pieceList[r].push(
            {
              id: `${idCounter}`,
              x: xCounter,
              y: yCounter,
            } 
          )
          this.winPosition[r].push(
            {
              id: `${idCounter}`,
              x: xCounter,
              y: yCounter,
            } 
          )
          idCounter++;
          xCounter += this.pieceSize;
        }
      }
      yCounter += this.pieceSize;
    }
  }
  timer() {
    document.querySelector("#timer").innerHTML = this.timeString
    let startTime = new Date();
    this.time = setInterval(e => {
      let currentTime = new Date();
      let timePassed = currentTime - startTime;
      let hoursPassed = Math.floor(timePassed / (1000 * 60 * 60)) 
      let minutesPassed = Math.floor(timePassed / (1000 * 60)) - hoursPassed * 60;
      let secondsPassed = Math.floor(timePassed / 1000) - minutesPassed * 60;
      if (hoursPassed > 0) {
        this.timeString = `${hoursPassed}:${("0" + minutesPassed).slice(-2)}:${("0" + secondsPassed).slice(-2)}`
        document.querySelector("#timer").innerHTML = this.timeString
      } else {
        this.timeString = `${("0" + minutesPassed).slice(-2)}:${("0" + secondsPassed).slice(-2)}`
        document.querySelector("#timer").innerHTML = this.timeString
      }
    }, 1000);
  }
  start() {
    this.canvas.onclick = e => {
      let x = e.clientX - this.canvas.getBoundingClientRect().x;
      let y = e.clientY - this.canvas.getBoundingClientRect().y;
      for (let r = 0; r < this.fieldSize; r++) {
        for (let c = 0; c < this.fieldSize; c++) {
          if ((x > this.pieceList[r][c].x && x < (this.pieceList[r][c].x + this.pieceSize)) && (y > this.pieceList[r][c].y && y < (this.pieceList[r][c].y + this.pieceSize))) {
            this.move(r, c,);
          }
        }
      }
    }

    this.shufflePieces();
    this.clear(300, 300)

    clearInterval(this.time)
    this.timer();
  }

  move(r, c) {
    let emptyPiece = this.findEmptyPiece(r, c);
    if (emptyPiece) {
      let x = this.pieceList[r][c].x;
      let y = this.pieceList[r][c].y;
      let distanceX = emptyPiece.x - this.pieceList[r][c].x;
      let distanceY = emptyPiece.y - this.pieceList[r][c].y;
      let id = this.pieceList[r][c].id;
      this.doStep(r, c, emptyPiece);
      let animate = (duration) => {
        let start = performance.now();
        requestAnimationFrame(animate = (time) => {
          //timeFraction always have to be from 0 to 1
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;

          //clear previous frame
          this.clear(x, y)

          //calculate how far we need to move the piece
          let progress = (1 - (timeFraction - 1) ** 2) ** 0.5;

          //draw a new piece
          this.draw(id, x + (distanceX * progress), y + (distanceY * progress));

          // if animation is not finished, go to new frame
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
        })
      }
      animate(300);

    }
  }

  findEmptyPiece(r, c) {
    let emptyPiece = undefined;
      for (let i = 0; i < this.fieldSize; i++) {
        for (let j = 0; j < this.fieldSize; j++) {
          //find the empty piece on the field
          if (this.pieceList[i][j].id === "empty") {
            //check if the piece stands close to the clicked piece - the difference only of one index must be equal 1 and other's must be 0
            if (((Math.abs(i - r) === 0) && (Math.abs(j - c) === 1)) || ((Math.abs(i - r) === 1) && (Math.abs(j - c) === 0))) {
              emptyPiece = this.pieceList[i][j];
              emptyPiece.r = i;
              emptyPiece.c = j;
            }
          }
        }
      }
    return emptyPiece;
  }

  doStep(r, c, emptyPiece) {
    if (emptyPiece) {
      let bubblePieceId = this.pieceList[r][c].id;
      this.pieceList[r][c].id = "empty";
      this.pieceList[emptyPiece.r][emptyPiece.c].id = bubblePieceId;
      this.steps += 1;
      document.querySelector("#step").innerHTML = this.steps;
      this.checkWin();
      localStorage.setItem("pieceList", this.pieceList);
      localStorage.setItem("steps", this.steps);
    }
  }

  clear(x, y) {
    this.ctx.clearRect(x, y, this.pieceSize, this.pieceSize);
  }

  draw(id, x, y) {
    if (id != "empty") {
      this.ctx.beginPath();
      //draw a rectangle
      this.ctx.fillStyle = "#c7aabc";
      this.ctx.fillRect(x + 1, y + 1, this.pieceSize - 2, this.pieceSize - 2);
      //draw a border, border uses here instead of paddind
      this.ctx.strokeStyle = "white";
      this.ctx.strokeRect (x, y, this.pieceSize, this.pieceSize);
      //draw a piece number
      this.ctx.fillStyle = "white";
      this.ctx.font = `${this.fontSizes[this.fieldSize]}px Calibri`;
      if (id.length === 1) {
        this.ctx.fillText(id, x + this.textPaddingSingleX, y + this.textPaddingBothY);
      } else {
        this.ctx.fillText(id, x + this.textPaddingDoubleX, y + this.textPaddingBothY);
      }
      this.ctx.closePath();
    }
  }

  shufflePieces() {
    let arr = this.idList.slice();
    arr.sort(() => Math.random() - 0.5);
    arr.push("empty");
    let index = 0;
    for (let r = 0; r < this.fieldSize; r++) {
      for (let c = 0; c < this.fieldSize; c++) {
        this.pieceList[r][c].id = arr[index];
        this.draw(this.pieceList[r][c].id, this.pieceList[r][c].x, this.pieceList[r][c].y)
        index++;
      }
    }
  }

  checkWin() {
    let win = true;
    for (let r = 0; r < this.pieceList.length; r++) {
      for (let c = 0; c < this.pieceList.length; c++) {
        if (this.pieceList[r][c].id != this.winPosition[r][c].id) {
          win = false;
          break;
        }
      }
    }
    if (win === true) {
      this.winModal.classList.add("modal-active")
      clearInterval(this.time)
      document.querySelector("#win-steps").innerHTML = this.steps;
      document.querySelector("#win-time").innerHTML = this.timeString;
      localStorage.removeItem("steps");
      localStorage.removeItem("time");
    }
  }

  build(elemForAppend) {
    let gameWrapper = document.createDocumentFragment();
    let header = document.createElement("header");
    header.innerHTML = ("<h1>Gem Puzzle</h1>");
    let navBar = document.createElement("nav");
    let actionButtons = create("ul", "<li class=\"start\">Shuffle and start</li><li class=\"score\">High Score</li>","game-options")
    let stats = create("ul", `<li class=\"steps\">Steps: <span id="step">${this.steps}</span></li><li class=\"time\">Time: <span id="timer">00:00</span></li>`, "game-stats");
    navBar.append(actionButtons, stats);
    header.append(navBar);

    let gameField = create("div", undefined, "game-field");
    gameField.append(this.canvas);
    let footer = document.createElement("footer");
    let size = create("div", `Field size: ${"4x4"}`, "size");
    let sizeSelect = create("div", `<p>Change field size:<ul><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><li>${"3x3"}</li><ul/></p>`, "size-selector")

    this.winModal = create("div", "<h2>You win!</h2><p>Steps:<span id=\"win-steps\"></span>, time: <span id=\"win-time\"></span></p>", "win-modal")
    gameField.append(this.winModal);

    footer.append(size, sizeSelect);
    gameWrapper.append(header, gameField, footer);
    
    elemForAppend.append(gameWrapper);

    
    
  }

  init(elemForAppend) {
    this.pieceList.forEach((elem) => {
      elem.forEach(elem => {
        this.draw(elem.id, elem.x, elem.y)
      })
    })

    this.build(elemForAppend);

    document.querySelector(".start").onclick = e => {
      this.start();
    }
  }
}