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

function PairBarriers() {
  this.element = newElement("div", "pair-barriers");
  const top = new Barrier(false);
  const bottom = new Barrier(true);
  this.element.appendChild(top.element);
  this.element.appendChild(bottom.element);

  this.drawHeight = (height, gap) => {
    const topHieght = Math.random() * (height - gap);
    const bottomHieght = height - gap - topHieght;
    console.log(`TopHeight:${topHieght}`);
    console.log(`BottomHeight:${bottomHieght}`);

    top.setHeight(topHieght);
    bottom.setHeight(bottomHieght);
  };

  this.drawHeight(600, 200);
}

const b = new PairBarriers();
document.querySelector("[flappy-board]").appendChild(b.element);
