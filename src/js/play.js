import {game} from './game';
import {doOperation} from './lib/mathEffect';
import Fan from './Fan';
import Map from './lib/Map';
import Swipe from 'phaser-swipe';

let star, collectables, stars, cursors, scoreText, swipe;
let score = 0;

const directionInfo = {'up': {axis: 'y', operator: '-'},
                      'down': {axis: 'y', operator: '+'},
                      'left': {axis: 'x', operator: '-'},
                      'right': {axis: 'x', operator: '+'}};


function create() {
  game.stage.backgroundColor = '#333333';

  const gameMap = game.add.tilemap('level1');
  gameMap.addTilesetImage('tilesheet', 'gameTiles');

  Fan.init();
  Fan.createFromMap(gameMap);

  collectables = game.add.group();
  collectables.enableBody = true;

  gameMap.createFromObjects('objectsLayer', 2, 'collectable', 0, true, false, collectables);

  stars = game.add.group();
  stars.enableBody = true;

  star = Map.createOneOfType(gameMap, 'objectsLayer', 'target', stars);
  star.body.collideWorldBounds = true;

  scoreText = game.add.text(game.width-game.width/4, 2, `Score: ${score}`,
    {font: "bold 20pt Arial", fill: "#FFFFFF"});

  game.input.keyboard.addCallbacks(this, null, onKeyUp);
  cursors = game.input.keyboard.createCursorKeys();
  swipe = new Swipe(game);
}

function update() {
  game.physics.arcade.collide(stars, collectables, collect);

  const activeFan = Fan.activeFan;
  const fanVelocity = 85;

  const swipeDirection = swipe.check();
  swipeHandler(swipeDirection);

  if (activeFan.name === 'sideFan') {
    if (activeFan.blow) {
      move('right', activeFan.force);
    } else if (activeFan.soak) {
      move('left', activeFan.force);
    }
    //Moving the fan itself
    activeFan.body.velocity.y = 0;
    if (cursors.up.isDown) {
      activeFan.body.velocity.y = -fanVelocity;
    } else if (cursors.down.isDown) {
      activeFan.body.velocity.y = fanVelocity;
    }
  } else {
    if (activeFan.blow) {
      move('up', activeFan.force);
    } else if (activeFan.soak) {
      move('down', activeFan.force);
    }
    //Moving the fan itself
    activeFan.body.velocity.x = 0;
    if (cursors.right.isDown) {
      activeFan.body.velocity.x = fanVelocity;
    } else if (cursors.left.isDown) {
      activeFan.body.velocity.x = -fanVelocity;
    }
  }
  Fan.fanMovementJudge(activeFan);
  scoreText.setText(`Score: ${score}`);
}

function move(direction, force) {
  const activeFan = Fan.activeFan;

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
      Fan.stopActiveFan(activeFan.blow, activeFan.soak);
    }
  }
}

function moveTarget(target, actionInfo, amountToTravel) {
  target[actionInfo.axis] =
    doOperation(actionInfo.operator,
      target[actionInfo.axis], amountToTravel);
}

function onKeyUp(key) {
  const activeFan = Fan.activeFan;
  const keyCode = key.keyCode;
  switch (keyCode) {
    case 87: //w
      activeFan.soak = false;
      activeFan.blow = true;
      break;
    case 83: //s
      activeFan.blow = false;
      activeFan.soak = true;
      break;
    case 49: //1
      activeFan.force = activeFan.defaultForce;
      break;
    case 50: //2
      activeFan.force = activeFan.defaultForce * 2;
      break;
    case 51: //3
      activeFan.force = activeFan.defaultForce * 3;
      break;
    case 32: //Spacebar
      Fan.stopActiveFan();
  }
}

function collect(target, collectable) {
  collectable.destroy();
  score += 1;
  if (collectables.length === 0) {
    Fan.stopActiveFan();
    game.state.start('win');
  }
}

function swipeHandler(direction) {
  if (direction !== null) {
    switch (direction.direction){
      case swipe.DIRECTION_UP:
        if (Fan.activeFan.name === 'bottomFan') {
          swipeJudge('blow');
        }
        break;
      case swipe.DIRECTION_DOWN:
        if (Fan.activeFan.name === 'bottomFan') {
          swipeJudge('soak');
        }
        break;
      case swipe.DIRECTION_LEFT:
        if (Fan.activeFan.name === 'sideFan') {
          swipeJudge('soak');
        }
        break;
      case swipe.DIRECTION_RIGHT:
        if (Fan.activeFan.name === 'sideFan') {
          swipeJudge('blow');
        }
        break;
    }
  }
}

function swipeJudge(act) {
  if (act === 'blow') {
    if (Fan.activeFan.soak) {
      Fan.stopActiveFan();
    } else {
      Fan.activeFan.soak = false;
      Fan.activeFan.blow = true;
    }
  } else {
    if (Fan.activeFan.blow) {
      Fan.stopActiveFan();
    } else {
      Fan.activeFan.blow = false;
      Fan.activeFan.soak = true;
    }
  }
}

export default {
  create,
  update,
}
