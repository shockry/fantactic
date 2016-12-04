import {game} from './game';

function preload() {
  let text = game.add.text(0, 0, "Loading...",
    {boundsAlignH: "center", boundsAlignV: "middle", fill: "#FFFFFF"});
  text.setTextBounds(0, 200, game.width, game.height/2);

  game.load.image('star', 'src/assets/images/star.png');
  game.load.image('box', 'src/assets/images/carton-box.png');
  game.load.image('box-rotated', 'src/assets/images/carton-box-rotated.png');
  game.load.image('collectable', 'src/assets/images/jelly.png');
  game.load.tilemap('level1', 'src/assets/levels/tester.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('gameTiles', 'src/assets/images/tilesheet.png');

}

function create() {
  game.state.start('menu');
}

export default {
  preload,
  create,
}
