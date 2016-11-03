import 'pixi';
import 'p2';
import Phaser from 'phaser';
import {doOperation} from './lib/mathEffect';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {preload: preload, create: create, update: update});

let stars;
let boxes, star;

const directionInfo = {'up': {axis: 'y', operator: '-'},
                      'down': {axis: 'y', operator: '+'},
                      'left': {axis: 'x', operator: '-'},
                      'right': {axis: 'x', operator: '+'}};

function preload () {
  game.load.image('star', 'src/assets/images/star.png');
  game.load.image('sky', 'src/assets/images/sky.png');
  game.load.image('box', 'src/assets/images/carton-box.png');
  game.load.image('box-rotated', 'src/assets/images/carton-box-rotated.png');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  const sky = game.add.sprite(0, 0, 'sky');

  boxes = game.add.group();
  boxes.enableBody = true;
  boxes.inputEnableChildren = true;
  boxes.onChildInputUp.add(setActiveFan, this);

  createBox({x: 0, y: game.world.height/2 - game.cache.getImage('box-rotated').height/2},
        'sideFan', 'box-rotated');

  createBox({x: game.world.width/2, y: game.world.height - game.cache.getImage('box').height},
      'bottomFan', 'box', {active: true});

  stars = game.add.group();
  stars.enableBody = true;

  star = stars.create(game.world.width/2, 400, 'star');
  // star.scale.setTo(2, 2);
  // star.inputEnabled = true;
  // star.input.enableDrag();
  // star.body.gravity.y = 160;
  // star.body.bounce.x = 0.2;
  // star.body.bounce.y = 0.2;
  star.body.collideWorldBounds = true;

  game.input.keyboard.addCallbacks(this, null, null, onPress);

  // star.events.onDragStart.add(dragStart, this);
  // star.events.onDragStop.add(dragStop, this);

  // box.events.onDragStart.add(dragStart, this);
  // box.events.onDragStop.add(dragStop, this);
  // box.events.onDragUpdate.add(dragUpdate, this);
}

function update() {
  // game.physics.arcade.collide(stars, boxes);//, collectStar, ()=>boxes.enableCollide);//, null, this);

  const activeFan = getActiveFan();
  game.debug.body(activeFan);
  if (activeFan.name === 'sideFan') {
    if (activeFan.blow) {
      move('right', activeFan.force);
    } else if (activeFan.soak) {
      move('left', activeFan.force);
    }
  } else {
    if (activeFan.blow) {
      move('up', activeFan.force);
    } else if (activeFan.soak) {
      move('down', activeFan.force);
    }
  }
}

function move(direction, force) {
  const activeFan = getActiveFan();

  //Check if the target is in the range of one of the fans
  if ((star.body.x >= activeFan.body.x &&
    star.body.width + star.body.x <= activeFan.body.x + activeFan.body.width) ||
    (star.body.y >= activeFan.body.y &&
      star.body.height + star.body.y <= activeFan.body.y + activeFan.body.height)) {

    const distance = activeFan.name === 'bottomFan'?
      activeFan.body.y - (star.body.y + star.body.height):
      star.body.x - activeFan.body.width;

    const distanceSquare = 1 + distance * distance;

    let fanforce = force / distanceSquare;
    // setting a maximum to avoid teleporting to the end of the world
    fanforce = fanforce > star.width? star.width: fanforce;

    /*If the intended soak force will be greater than the space
    left between the target and the fan, just travel that distance and halt */
    const amountToTravel = distance < fanforce && activeFan.soak?
        distance: fanforce;

    //Increase/decrease the x or y of the target by the amount to travel.
    //Depends on the current direction
    const actionInfo = directionInfo[direction];

    moveTarget(star, actionInfo, amountToTravel);

    //If collided with a fan or the world boundaries, stop whatever you're doing
    if ((distance === 0 && activeFan.soak) ||
      ((star.y <= 0 || star.x + star.width >= game.world.width) &&
        activeFan.blow)) {
      stopActiveFan(activeFan.blow, activeFan.soak);
    }
  }
}

function moveTarget(target, actionInfo, amountToTravel) {
  target[actionInfo.axis] =
    doOperation(actionInfo.operator,
      target[actionInfo.axis], amountToTravel);
}

function createBox(position, name, img, {rotation = 0, active = false} = {}) {
  const box = boxes.create(position.x + game.cache.getImage(img).width/2,
      position.y + game.cache.getImage(img).height/2, img);

  box.name = name;
  box.anchor.setTo(0.5, 0.5);
  box.body.immovable = true;
  // box.body.allowRotation = true;
  box.angle = rotation;
  box.blow = false;
  box.soak = false;
  box.force = 20000;
  box.defaultForce = 20000;

  //Last active one is the only active
  if (active) {
    boxes.forEach(function(fan) {
      setFanTint(fan, 0xFFFFFF);
    });
    setFanTint(box, 0x48f442);
  }

  return box;
  // box.body.checkCollision.down = false;
  // box.inputEnabled = true;
  // box.input.enableDrag();
}

function setActiveFan(fan) {
  //Revert current active fan properties
  stopActiveFan();
  const currentActiveFan = getActiveFan();
  currentActiveFan.tint = 0xFFFFFF;
  //Set new active fan
  fan.bringToTop();
  setFanTint(fan, 0x48f442);
}

function setFanTint(fan, tint) {
  fan.tint = tint;
}

function onPress(key) {
  const activeFan = getActiveFan();
  switch (key) {
    case 'w':
      activeFan.soak = false;
      activeFan.blow = true;
      break;
    case 's':
      activeFan.blow = false;
      activeFan.soak = true;
      break;
    case '1':
      activeFan.force = activeFan.defaultForce;
      break;
    case '2':
      activeFan.force = activeFan.defaultForce * 2;
      break;
    case '3':
      activeFan.force = activeFan.defaultForce * 3;
      break;
    default:
      stopActiveFan();
  }
}

function stopActiveFan(blow = true, soak = true) {
  const activeFan = getActiveFan();
  if (blow) {
    activeFan.blow = false;
  }
  if (soak) {
    activeFan.soak = false;
  }
}

function getActiveFan() {
  return boxes.getTop();
}
