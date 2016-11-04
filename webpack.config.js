var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
pixi = path.join(phaserModule, 'build/custom/pixi.js'),
p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: ['./src/js/game.js'],
  output: {
    path: './dist',
    filename: 'game.bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, loader: 'expose?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
      { test: /p2\.js/, loader: 'expose?p2' }
    ]
  },
  watch: true,
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
    }
  }
}
