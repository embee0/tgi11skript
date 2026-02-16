// Imagine this sketch is hosted at the following URL:
// https://p5js.org?year=2014&month=May&day=15

function setup() {
  createCanvas(windowHeight, windowHeight);
  background(200);

  // Get the sketch's URL
  // parameters and display
  // them.
  let params = getURLParams();
  // if the parameters are not set, use defaults
  params.year = params.year || '2014';
  params.month = params.month || 'May';
  params.day = params.day || '15';
  text(params.day, 10, 20);
  text(params.month, 10, 40);
  text(params.year, 10, 60);

  describe('The text "15", "May", and "2014" written in black on separate lines.');
}