import {game} from './game';

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#332233';

  game.state.start('load');
}

export default {
  create,
}
