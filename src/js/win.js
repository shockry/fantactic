import {game} from './game';

function create() {
  game.stage.backgroundColor = '#5a92ed';
  const text = game.add.text(0, 0, "Woho! you won!",
    {font: "bold 70pt Arial",
    boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
  text.setTextBounds(0, 100, game.width, game.height/2);

  let restartText = "Tap anywhere to restart";
  if (game.device.desktop) {
    restartText = "Click anywhere to restart";
  }
  const playAgainText = game.add.text(0, 0, restartText,
    {font: "bold 20pt Arial",
    boundsAlignH: "center", boundsAlignV: "middle", fill: "#fff89b"});
  playAgainText.setTextBounds(0, 200, game.width, game.height/2);

  game.input.onDown.addOnce(play);

}

function play() {
  game.state.start('load');
}

export default {
  create,
}
