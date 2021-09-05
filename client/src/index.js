import * as Phaser from 'phaser';
import io from 'socket.io-client';
import scenes from './scenes/scenes';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0,
      },
    },
  },
  pixelArt: true,
  roundPixels: true,
};

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const socket = io('http://localhost:3000');
    this.globals = { socket };
    this.scene.start('Boot');
  }
}

window.onload = () => {
  window.game = new Game();
};
