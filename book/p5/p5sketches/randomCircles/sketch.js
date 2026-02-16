let radius = 10;
let oldRadius = radius;
let nextRadius = 20;

let prct = 0;
const delta = 0.01;

function setup() {
  createCanvas(400, 400);
  noStroke();
  background("lightblue");
}

function draw() {
  if (prct >= 1) {
    nextRadius = random(1, 10);
    prct = 0;
  } else {
    radius = map(prct, 0, 1, oldRadius, nextRadius);
    prct += delta;
  }
  // vorige Mausposition mit aktueller verbinden mit aktuellem Radius
  stroke("white");
  line(mouseX, mouseY, pmouseX, pmouseY);
  strokeWeight(radius);
  point(mouseX, mouseY);
}
