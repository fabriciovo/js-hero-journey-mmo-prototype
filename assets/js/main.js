var config = {
    type: Phaser.AUTO,
    width: 576,
    height: 432,
    scene: [BootScene,TitleScene,GameScene,UiScene],
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

var game = new Phaser.Game(config);

