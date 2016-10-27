import 'pixi';
import 'p2';
import Phaser from 'phaser'

const game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {preload: preload, create: create, update: update});

let stars;
let boxes, box, star;

function preload () {
  game.load.image('star', 'src/assets/images/star.png');
  game.load.image('sky', 'src/assets/images/sky.png');
  game.load.image('box', 'src/assets/images/carton-box.png');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  const sky = game.add.sprite(0, 0, 'sky');

  boxes = game.add.group();
  boxes.enableBody = true;

  box = boxes.create(game.world.width - game.cache.getImage('box').width, 200, 'box');
  box.body.immovable = true;
  box.body.checkCollision.down = false;
  // box.body.maxVelocity = 200;
  box.inputEnabled = true;
  box.input.enableDrag();

  stars = game.add.group();
  stars.enableBody = true;

  star = stars.create(200, 100, 'star');
  star.scale.setTo(2, 2);
  star.inputEnabled = true;
  star.input.enableDrag();
  star.body.gravity.y = 500;
  // star.body.bounce.x = 0.2;
  // star.body.bounce.y = 0.2;
  star.body.collideWorldBounds = true;

  star.events.onDragStart.add(dragStart, this);
  star.events.onDragStop.add(dragStop, this);

  box.events.onDragStart.add(dragStart, this);
  box.events.onDragStop.add(dragStop, this);
  box.events.onDragUpdate.add(dragUpdate, this);
}

function update() {
  // game.physics.arcade.collide(stars, boxes, collectStar, null, this);
  // game.physics.arcade.overlap(stars, boxes, collectStar, null, this);
  game.debug.body(box);
  // console.log(star.y, box.y); 239, 139
  if (star.body.x >= box.body.x && star.body.width + star.body.x <= box.body.x + box.body.width) {
    // console.log("Yeah");
    // box.body.moves = false;
    const distance = box.body.y - star.body.y;
    const distanceSquare = distance * distance;
    // console.log((2000 / (distanceSquare)) % game.world.height);
    // console.log(200 / distanceSquare);
    // console.log(star.body.y);
    star.body.velocity.y = -500 / distanceSquare;// / distanceSquare;// % game.world.height;
    // console.log(star.body.velocity.y);
  }
  else {
    // box.body.moves = true;
  }
}

function dragStart(star) {
  star.body.moves = false;
  // star.dragX = star.x;
  // star.dragY = star.y;
  // star.dragTime = new Date();
  // console.log(`(${star.x}, ${star.y})`);
}

function dragStop(star) {
  star.body.moves = true;
  // const timeDelta = Date.now() - star.dragTime;
  // const velocityX = (star.x - star.dragX) - (timeDelta % 10);
  // const velocityY = (star.y - star.dragY) - (timeDelta % 10);
  //
  // star.body.velocity.setTo(velocityX, velocityY);
  // console.log(`(${star.x}, ${star.y})`);
}

function dragUpdate(box) {
  // if (box.body.y > (star.body.y+star.body.height)) {
  //   box.body.y = star.body.y+star.body.height + 10;
  // }
}

function collectStar(star, box) {
  // star.kill();
}
