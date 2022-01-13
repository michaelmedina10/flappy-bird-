function newElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function Barriers(reverse = false) {
  this.element = newElement("div", "barrier");
  console.log(this.element);
  const pipe = newElement("div", "pipe");
  const border = newElement("div", "border");
  // this.element.appendChild(reverse ? pipe : border);
  // this.element.appendChild(reverse ? border : pipe);
  this.element.appendChild(reverse ? border : pipe);
  this.element.appendChild(reverse ? pipe : border);
}

const b = new Barriers(false);
console.log(b.element);
document.querySelector("[flappy-board]").appendChild(b.element);
