import {game} from './game';

function create() {
  game.stage.backgroundColor = '#333322';
  let welcomeText = game.add.text(0, 0, "Welcome to",
    {font: "bold 20pt Arial",
      boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
  welcomeText.setTextBounds(0, 20, game.width, game.height/4);

  let fantacticText = game.add.text(0, 0, "FANTACTIC!",
    {font: "bold 50pt Arial",
      boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
  fantacticText.setTextBounds(0, 130, game.width, game.height/4);

  if (game.device.desktop) {
    let goalText = game.add.text(0, 0,
      `Your target is to collect all the thingies by blowing fans into an object!`,
      {font: "bold 15pt Arial",
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#11FFFF"});
    goalText.setTextBounds(0, 150, game.width, game.height/2);

    let instructionsText = game.add.text(0, 0,
      `Click the fan to select, drag or use the cursor keys to move.
      Use 'w' to blow and 's' to soak.
      Spacebar will stop whatever the fan is doing.
      1, 2 and 3 will change the fan force.`,
      {font: "15pt Arial", align: 'center',
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
    instructionsText.setTextBounds(0, 250, game.width, game.height/2);

    let startText = game.add.text(0, 0,
      `Click anywhere to play!`,
      {font: "bold 15pt Arial",
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#AAFFFF"});
    startText.setTextBounds(0, 350, game.width, game.height/2);
  } else {
    let goalText = game.add.text(0, 0,
      `Collect all the thingies by blowing fans into an object!`,
      {font: "bold 20pt Arial",
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#11FFFF"});
    goalText.setTextBounds(0, 120, game.width, game.height/2);

    let instructionsText = game.add.text(0, 0,
      `Tap the fan to select
      Drag to move
      Swipe to control the fans`,
      {font: "35pt Arial", align: 'center',
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
    instructionsText.setTextBounds(0, 250, game.width, game.height/2);

    let startText = game.add.text(0, 0,
      `Tap anywhere to play!`,
      {font: "bold 40pt Arial",
        boundsAlignH: "center", boundsAlignV: "middle", fill: "#AAFFFF"});
    startText.setTextBounds(10, 400, game.width, game.height/2);
  }

  game.input.onDown.addOnce(play);

}

function play() {
  game.state.start('play');
}

export default {
  create,
}
