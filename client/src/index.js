import *  as Pahser from 'phaser'
import scenes from './scenes/scenes';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: scenes,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    }
};
class Game extends Phaser.Game {
    constructor(){
        super(config);
        this.scene.start('Boot')
    }
}

window.onload = () =>{
    window.game = new Game();
}

const game = new Phaser.Game(config);
window.game = game;
