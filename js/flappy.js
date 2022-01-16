function newElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");
  console.log(this.element);
  const pipe = newElement("div", "pipe");
  const border = newElement("div", "border");
  // this.element.appendChild(reverse ? pipe : border);
  // this.element.appendChild(reverse ? border : pipe);
  this.element.appendChild(reverse ? border : pipe);
  this.element.appendChild(reverse ? pipe : border);

  this.setHeight = (altura) => {
    pipe.style.height = `${altura}px`;
  };
}

// const b = new Barrier(false);
// console.log(b.element);
// b.setAltura(50);
// document.querySelector("[flappy-board]").appendChild(b.element);

function PairBarriers(height, gap, x) {
  this.element = newElement("div", "pair-barriers");
  this.top = new Barrier(false);
  this.bottom = new Barrier(true);
  this.element.appendChild(this.top.element);
  this.element.appendChild(this.bottom.element);

  this.drawHeight = () => {
    const topHieght = Math.random() * (height - gap);
    const bottomHieght = height - gap - topHieght;

    this.top.setHeight(topHieght);
    this.bottom.setHeight(bottomHieght);
  };

  this.getX = () => parseInt(this.element.style.left.split("px")[0]);

  this.setX = (x) => (this.element.style.left = `${x}px`);

  this.getWidth = () => this.element.clientWidth;

  this.drawHeight();
  this.setX(x);
}
// const b = new PairBarriers(600, 200, 200);
// document.querySelector("[flappy-board]").appendChild(b.element);

function Barriers(height, gap, spaceBetween, width, sumPoint) {
  this.pairs = [
    new PairBarriers(height, gap, width),
    new PairBarriers(height, gap, width + spaceBetween),
    new PairBarriers(height, gap, width + spaceBetween * 2),
    new PairBarriers(height, gap, width + spaceBetween * 3),
  ];

  let displacement = 4;

  this.animate = () => {
    this.pairs.forEach((pair, index) => {
      pair.setX(pair.getX() - displacement);

      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + spaceBetween * this.pairs.length);
        pair.drawHeight();
      }

      const halfway = width / 2;
      const crossedHalfway =
        pair.getX() + displacement >= halfway && pair.getX() < halfway;

      if (crossedHalfway) {
        console.log("Cruzou o meio:");
        sumPoint();
      }
    });
  };
}

function Bird(heightOfGame) {
  this.element = newElement("img", "bird");
  this.element.src = "../imgs/passaroRedBird100px.png";

  let fly = false;
  window.onkeydown = (event) => (fly = true);
  window.onkeyup = (event) => (fly = false);

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  this.animate = () => {
    let newY = this.getY() + (fly ? 10 : -5);
    let maximumHeight = heightOfGame - this.element.clientHeight - 25;

    console.log("Maximum Height: " + maximumHeight);

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maximumHeight) {
      this.setY(maximumHeight);
    } else {
      this.setY(newY);
    }
  };
  this.setY(heightOfGame / 2);
}

// THE GAME HERE ALREADY WORKS, BUT THERE IS NO COLISION
// const barriers = new Barriers(550, 200, 380, 600);
// const bird = new Bird(600);
// const gameZone = document.querySelector("[flappy-board]");
// gameZone.appendChild(bird.element);

// barriers.pairs.forEach((bar) => gameZone.appendChild(bar.element));
// setInterval(() => {
//   barriers.animate();
//   bird.animate();
// }, 20);

function Progress() {
  this.element = newElement("span", "progress");
  this.updateScore = (score) => {
    this.element.innerHTML = score;
  };
  this.updateScore(0);
}

// const barriers = new Barriers(550, 200, 380, 600);
// const bird = new Bird(600);
// const progress = new Progress();
// const gameZone = document.querySelector("[flappy-board]");
// gameZone.appendChild(bird.element);
// gameZone.appendChild(progress.element);

// barriers.pairs.forEach((bar) => gameZone.appendChild(bar.element));
// setInterval(() => {
//   barriers.animate();
//   bird.animate();
// }, 20);

function overlapping(elementA, elementB) {
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
  return horizontal && vertical;
}

function collided(bird, barriers) {
  let collided = false;
  barriers.pairs.forEach((pair) => {
    if (!collided) {
      const top = pair.top.element;
      const bottom = pair.bottom.element;

      collided = overlapping(bird, top) || overlapping(bird, bottom);
      console.log(collided);
    }
  });
  console.log("Collided?: " + collided);
  return collided;
}

function FlappyBird() {
  let score = 0;
  const areaOfGame = document.querySelector("[flappy-board]");
  const hieght = areaOfGame.clientHeight;
  const width = areaOfGame.clientWidth;
  console.log("Height Flappy: " + hieght);
  console.log("Width Flappy: " + width);

  const progress = new Progress();
  const barriers = new Barriers(hieght, 200, 380, width, () =>
    progress.updateScore(score++)
  );
  // const barriers = new Barriers(550, 200, 380, 600, () =>
  //   progress.updateScore(++score)
  // );

  const bird = new Bird(hieght);

  areaOfGame.appendChild(progress.element);
  areaOfGame.appendChild(bird.element);
  barriers.pairs.forEach((pair) => areaOfGame.appendChild(pair.element));

  this.start = () => {
    const timerID = setInterval(() => {
      barriers.animate();
      bird.animate();

      if (collided(bird.element, barriers)) {
        clearInterval(timerID);
      }
    }, 20);
  };
}

// new FlappyBird().start();

function OptionGameBoard() {
  this.element = newElement("div", "option-board");
  const subtitle = newElement("span", "option-title");
  const button = newElement("button", "start-game");
  button.innerHTML = "STarT";
  subtitle.innerHTML = "Flappy Bird";

  this.element.appendChild(subtitle);
  this.element.appendChild(button);

  button.onclick = (event) => {
    new FlappyBird().start();
    this.element.style.display = "none";
  };
}

document
  .querySelector("[flappy-board]")
  .appendChild(new OptionGameBoard().element);
