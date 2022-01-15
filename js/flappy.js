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
  const top = new Barrier(false);
  const bottom = new Barrier(true);
  this.element.appendChild(top.element);
  this.element.appendChild(bottom.element);

  this.drawHeight = () => {
    const topHieght = Math.random() * (height - gap);
    const bottomHieght = height - gap - topHieght;

    top.setHeight(topHieght);
    bottom.setHeight(bottomHieght);
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

  let displacement = 3;

  this.animate = () => {
    this.pairs.forEach((pair, index) => {
      pair.setX(pair.getX() - displacement);

      if (pair.getX() < -pair.getWidth()) {
        console.log(
          `Barra${index}:${pair.getX()}; NovoX:${
            pair.getX() + spaceBetween * this.pairs.length
          }; spaceBetween:${spaceBetween}; length:${this.pairs.length};`
        );
        pair.setX(pair.getX() + spaceBetween * this.pairs.length);
        pair.drawHeight();
      }

      const halfway = width / 2;
      const crossedHalfway =
        pair.getX() + displacement >= halfway && pair.getX() < halfway;

      // if (crossedHalfway) sumPoint();
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
const barriers = new Barriers(550, 200, 300, 600);
const bird = new Bird(600);
const gameZone = document.querySelector("[flappy-board]");
gameZone.appendChild(bird.element);

barriers.pairs.forEach((bar) => gameZone.appendChild(bar.element));
setInterval(() => {
  barriers.animate();
  bird.animate();
}, 20);
