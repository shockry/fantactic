import 'pixi';
import 'p2';
import Phaser from 'phaser'

const game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {preload: preload, create: create, update: update});

let stars;
let boxes, star;

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

  createBox({x: game.world.width/2, y: game.world.height - game.cache.getImage('box').height},
    'bottomFan')

  stars = game.add.group();
  stars.enableBody = true;

  star = stars.create(game.world.width/2 + 100, 400, 'star');
  // star.scale.setTo(2, 2);
  // star.inputEnabled = true;
  // star.input.enableDrag();
  // star.body.gravity.y = 160;
  star.body.bounce.x = 0.2;
  star.body.bounce.y = 0.2;
  star.body.collideWorldBounds = true;

  game.input.keyboard.addCallbacks(this, onDown, onUp, onPress);

  // star.events.onDragStart.add(dragStart, this);
  // star.events.onDragStop.add(dragStop, this);

  // box.events.onDragStart.add(dragStart, this);
  // box.events.onDragStop.add(dragStop, this);
  // box.events.onDragUpdate.add(dragUpdate, this);
}

function update() {
  // game.physics.arcade.collide(stars, boxes);//, collectStar, null, this);
  // game.debug.body(box);
  // console.log(star.y, box.y); 239, 139
  // if (star.body.x >= box.body.x && star.body.width + star.body.x <= box.body.x + box.body.width) {
  //   // console.log("Yeah");
  //   // box.body.moves = false;

  const activeFan = boxes.getTop();
  if (activeFan.blow) {
    move('up', 20000);
  } else if (activeFan.soak) {
    move('down', 20000);
  }
}

function move(direction, force) {
  const activeFan = boxes.getTop();
  const distance = activeFan.body.y - star.body.y;
  const distanceSquare = distance * distance;
  const fanforce = force / distanceSquare;
  if (direction === 'up') {
    star.y -= fanforce;
  } else {
    if (distance > fanforce) {
      star.y += fanforce;
    }
  }
}

function createBox(position, name, rotation = 0) {
  // box = boxes.create(game.world.width/2,
  //   game.world.height - game.cache.getImage('box').height, 'box');

  const box = boxes.create(position.x, position.y, 'box');

  box.name = name;
  box.rotation = rotation;
  box.body.immovable = true;
  box.blow = false;
  box.soak = false;

  box.bringToTop();

  return box;
  // box.body.checkCollision.down = false;
  // box.inputEnabled = true;
  // box.input.enableDrag();
}

function onDown(key) {
  // if (key.keyIdentifier === 'Up') {
  //   star.body.velocity.y = -20;
  // }
}

function onUp(key) {
  // console.log(key.key);
  // if (key.keyIdentifier === 'Up') {
  //   star.body.velocity.y = 0;
  // }
}

function onPress(key) {
  const activeFan = boxes.getTop();
  if (key === 'w') {
    activeFan.soak = false;
    activeFan.blow = true;
  } else if (key === 's') {
    activeFan.blow = false;
    activeFan.soak = true;
  } else {
    activeFan.blow = false;
    activeFan.soak = false;
  }
  // if (!box.running) {
  //   // star.body.velocity.y = -20;
  //   box.running = true;
  // } else {
  //   // star.body.velocity.y = 20;
  //   box.running = false;
  // }
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
  if (box.body.y > (star.body.y+star.body.height)) {
    box.body.y = star.body.y+star.body.height + 10;
  }
}

function collectStar(star, box) {
  // star.kill();
}
