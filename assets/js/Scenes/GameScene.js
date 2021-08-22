class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.score = 0;
    }

    init() {
        this.scene.launch('Ui');
    }

    preload() {

    }

    create() {
        this.createMap();
        this.createPlayer();
        this.createChest();
        this.createWalls();
        this.addCollisions();
        this.createInputs();

    }

    update() {
        this.player.update(this.cursors);
    }

    createPlayer() {
        this.player = new Player(this, 128, 128, 'characters', 0);
    }
    createChest() {
        this.chests = this.physics.add.group();
        this.spawnChest();
    }
    spawnChest(){
       const chest = new Chest(this, 300, 300, 'items', 0);
       this.chests.add(chest)
    }
    createInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    createWalls() {
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();
    }
    addCollisions() {
        this.physics.add.collider(this.player, this.blocked);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    }

    collectChest(player, chest) {
        this.score += chest.coins;
        this.events.emit('updateScore', this.score)
        chest.destroy();
    }

    createMap(){
        this.map = this.make.tilemap({key:'map'});
        console.log(this.map)
        this.tiles = this.map.addTilesetImage('colored','colored_packed',16,16);

        this.background =  this.map.createLayer(0, this.tiles, 0, 0);
        
        this.blocked =  this.map.createLayer(1, this.tiles, 0, 0);
        this.blocked.setCollisionByExclusion([-1]);

        this.background.setScale(2);
        this.blocked.setScale(2);

        this.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.physics.world.bounds.height = this.map.heightInPixels * 2;

        this.cameras.main.setBounds(0,0,this.map.widthInPixels * 2, this.map.heightInPixels * 2)
    }
}