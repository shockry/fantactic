import {game} from './game';
import {doOperation} from './lib/mathEffect';
//TODO: Maybe add default force to the group itself
let fans;

function init() {
  if (!fans) {
    fans = game.add.group();
    fans.enableBody = true;
    fans.inputEnableChildren = true;
    fans.onChildInputUp.add(setActiveFan, this);
  }
}

function createFan(position, name, img, {rotation = 0, active = false} = {}) {
  const fan = fans.create(position.x, position.y, img);

  fan.name = name;
  // fan.body.immovable = true;
  fan.body.collideWorldBounds = true;
  fan.input.enableDrag();
  if (img === 'box-rotated') { //Side fan
    fan.input.allowHorizontalDrag = false;
    const bounds = new Phaser.Rectangle(0, 0,
      game.cache.getImage(img).width, game.world.height);
    fan.input.boundsRect = bounds;
  } else {
    fan.input.allowVerticalDrag = false;
    const bounds = new Phaser.Rectangle(0, position.y,
      game.world.width, game.cache.getImage(img).height);
    fan.input.boundsRect = bounds;
  }
  fan.events.onDragUpdate.add(fanMovementJudge, this);
  fan.angle = rotation;
  fan.blow = false;
  fan.soak = false;
  fan.force = 20000;
  //Initial force (to control fan speed based on this number)
  fan.defaultForce = 20000;

  //Last active one is the only active
  if (active) {
    fans.forEach(function(fan) {
      setFanTint(fan, 0xFFFFFF);
    });
    setFanTint(fan, 0x48f442);
  }

  return fan;
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
  return fans.getTop();
}

//stops fan drag and retreat back a little to enable it again
function stopFanMovement(fan, axis, operator) {
  fan.input.disableDrag();
  fan.body.velocity.set(0, 0);
  fan[axis] = doOperation(operator, fan[axis], 0.1);
  fan.input.enableDrag();
}

function fanMovementJudge(fan) {
  if (fan.name === 'sideFan' &&
    fan.y + fan.height >= fans.getByName('bottomFan').y) {
    stopFanMovement(fan, 'y', '-');
  } else if (fan.name === 'bottomFan' &&
      fan.x <= fans.getByName('sideFan').x + fans.getByName('sideFan').width) {
    stopFanMovement(fan, 'x', '+');
  }
}

export default {
  init,
  get fans() {return fans},
  createFan,
  stopActiveFan,
  fanMovementJudge,
  get activeFan() {return getActiveFan()},
}
