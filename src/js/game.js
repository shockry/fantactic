import 'pixi';
import 'p2';
import Phaser from 'phaser';
import bootState from './boot';
import loadState from './load';
import menuState from './menu';
import playState from './play';
import winState from './win';

export const game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('boot');
