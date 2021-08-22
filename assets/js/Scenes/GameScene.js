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
        this.player = new Player(this, 200, 200, 'characters', 0);
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
        this.physics.add.collider(this.player, this.map.blocked);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    }

    collectChest(player, chest) {
        this.score += chest.coins;
        this.events.emit('updateScore', this.score)
        chest.destroy();
    }

    createMap(){
        this.map = new Map(this, 'map','colored');
    }
}