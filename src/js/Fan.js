import {game} from './game';
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
  const fan = fans.create(position.x + game.cache.getImage(img).width/2,
      position.y + game.cache.getImage(img).height/2, img);

  fan.name = name;
  fan.anchor.setTo(0.5, 0.5);
  fan.body.immovable = true;
  fan.body.collideWorldBounds = true;
  // fan.body.allowRotation = true;
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

export default {
  init,
  get fans() {return fans},
  createFan,
  stopActiveFan,
  get activeFan() {return getActiveFan()},
}
