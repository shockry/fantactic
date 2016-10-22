import 'pixi';
import 'p2';
import Phaser from 'phaser'

const game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {preload: preload, create: create});

let stars;

function preload () {
  game.load.image('star', 'src/assets/images/star.png');
  game.load.image('sky', 'src/assets/images/sky.png');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  const sky = game.add.sprite(0, 0, 'sky');

  stars = game.add.group();
  stars.enableBody = true;
  const star = stars.create(200, 100, 'star');
  star.scale.setTo(2, 2);


  star.inputEnabled = true;
  star.input.enableDrag();
  star.body.gravity.y = 160;
  star.body.collideWorldBounds = true;

  star.events.onDragStart.add(dragStart, this);
  star.events.onDragStop.add(dragStop, this);
}

function dragStart(star) {
  star.body.moves = false;
  star.dragX = star.x;
  star.dragY = star.y;
  star.dragTime = new Date();
  console.log(`(${star.x}, ${star.y})`);
}

function dragStop(star) {
  star.body.moves = true;
  const timeDelta = Date.now() - star.dragTime;
  const velocityX = (star.x - star.dragX) * (timeDelta % 10);
  const velocityY = (star.y - star.dragY) * (timeDelta % 10);

  star.body.velocity.setTo(velocityX, velocityY);
  console.log(`(${star.x}, ${star.y})`);
}
