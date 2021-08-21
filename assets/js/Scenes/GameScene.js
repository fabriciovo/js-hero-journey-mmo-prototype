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
        this.createPlayer();
        this.createChest();
        this.createWalls();
        this.addCollisions();
        this.createInputs();
        this.createMap();
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
        this.physics.add.collider(this.player, this.wall);
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
        this.tiles = this.map.addTilesetImage('colored_packed','colored_packed',16,16);
        this.tilemap =  this.map.createLayer(0, this.tiles, 0, 0);
        this.tilemap2 =  this.map.createLayer(1, this.tiles, 0, 0);
        this.tilemap.setScale(2);
        this.tilemap2.setScale(2);
    }
}