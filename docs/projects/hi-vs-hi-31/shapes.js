// Matter
// Demos: http://brm.io/matter-js/demo/#mixed

// two things matter needs:
// 1. an engine (computation and maths)
// 2. a renderer (draws the engine)

// Alias is a shortcut to make our code cleaner
//const Engine = Matter.Engine;
//const Render = Matter.Render;
// Using JS deconstruction 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const {Engine, Render, Bodies, World, MouseConstraint, Composites, Query} = Matter

// where matter will be deploayed
const sectionTag = document.querySelector("section.shapes");

// get width + height of page
const w = window.innerWidth;
const h = window.innerHeight;

// create engine and renderer
// render src: http://brm.io/matter-js/docs/files/src_render_Render.js.html#
const engine = Engine.create();
const renderer = Render.create({
  element: sectionTag,
  engine: engine,
  // the options object is it's own object (see link above for full list of values)
  options: {
    height: h,
    width: w,
    background: "#000000",
    wireframes: false,
    pixelRatio: window.devicePixelRatio
  }
});

// function to create shapes (in this case a circle)
const createShape = function(x, y) {
  // Bodies is used to create various shapes
  return Bodies.rectangle(x, y, 38, 50, {
//     frictionAir: 0.1,
    render: {
      sprite: {
        texture: "outline-2x.png",
        xScale: 0.5,
        yScale: 0.5
      }
    }
  });
};

// create fixed (static) ball in center of page
const bigBall = Bodies.circle(w / 2, h / 2, Math.min(w / 4, h / 4), {
  isStatic: true,
  render: {
    fillStyle: "#ffffff"
  }
});

const wallOptions = {
  isStatic: true,
  render: {
    visible: false
  }
};

// add initial composite shapes
const initialShapes = Composites.stack(50, 50, 15, 5, 40, 40, function(x, y) {
  return createShape(x, y);
});

// create fixed (static) rectangles to form page bounds
const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions);
const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);

// add mouse constraint
const mouseControl = MouseConstraint.create(engine, {
  element: sectionTag,
  constraint: {
    render: {
      visible: false
    }
  }
});

// add fixed objects to world
World.add(engine.world, [
  bigBall, 
  ground,
  ceiling,
  leftWall,
  rightWall,
  mouseControl,
  initialShapes
]);

// on mouse click create shape (circle)
document.addEventListener("click", function(event) {
  const shape = createShape(event.pageX, event.pageY);
  // add shape to initialShapes
  initialShapes.bodies.push(shape);
  World.add(engine.world, shape);
})

// on mousemove check Matter for any collision (does mouse touch an object)
document.addEventListener("mousemove", function(event) {
  // get mouse vector
  const vector = {x: event.pageX, y: event.pageY};
  // query collision of initialShapes (note includes new shapes)
  const hoveredShapes = Query.point(initialShapes.bodies, vector);
  
  // loop through "collided" shapes and change style
  hoveredShapes.forEach(shape => {
//     shape.render.sprite = null;
//     shape.render.fillStyle = "#ff0000";
  })
})

// run both engine and renderer
Engine.run(engine);
Render.run(renderer);

// Variation ************
// change gravity based on frames and cos wave
// let time = 0;
// const changeGravity = function() {
//   time += 0.01;
  
//   engine.world.gravity.x = Math.sin(time);
//   engine.world.gravity.y = Math.cos(time);
  
//   requestAnimationFrame(changeGravity);
// };
// changeGravity();

// Variation **************
// Device orientation based gravity
// https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event
window.addEventListener("deviceorientation", function(event) {
  engine.world.gravity.x = event.gamma;
  engine.world.gravity.y = event.beta;
  console.log(event.gamma);
})



// Next steps
// make canvas responsive to window resize







