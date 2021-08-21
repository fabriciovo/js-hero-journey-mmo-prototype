class BootScene extends Phaser.Scene {
    constructor(){
        super('Boot');
    }

    preload(){
        this.loadTilemap();
        this.loadImages();
        this.loadSpriteSheets();
        
    }

    loadImages(){
        this.load.image('button1', 'assets/images/ui/blue_button01.png');
        this.load.image('button2', 'assets/images/ui/blue_button02.png');
        this.load.image('colored_packed', 'assets/colored_packed.png');
    }

    loadTilemap(){
        this.load.tilemapTiledJSON('map', 'assets/tilemap.json');
        
    }

    loadSpriteSheets(){
        this.load.spritesheet('items', 'assets/images/items.png',{ frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 16, frameHeight: 16 });
    }

    create(){
        this.scene.start('Title')
    }
}