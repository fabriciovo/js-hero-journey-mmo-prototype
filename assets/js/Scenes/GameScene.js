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

        this.createGroups();
        this.createWalls();

        this.createInputs();

        this.createGameManager();

    }

    update() {
        if (this.player) this.player.update(this.cursors);
    }

    createPlayer(location) {
        debugger
        this.player = new PlayerContainer(this, location[0] * 2, location[1] * 2, 'characters', 0);
    }
    createGroups() {
        this.chests = this.physics.add.group();
        this.monsters = this.physics.add.group();
    }

    spawnChest(chestObject) {
        let chest = this.chests.getFirstDead();

        if (!chest) {
            chest = new Chest(this, chestObject.x * 2, chestObject.y * 2, 'items', 0, chestObject.gold, chestObject.id);
            this.chests.add(chest)
        } else {
            chest.coins = chestObject.gold;
            chest.id = chestObject.id;
            chest.setPosition(chestObject.x * 2, chestObject.y * 2);
            chest.makeActive();
        }
    }
    spawnMonster(monsterObject) {
        let monster = this.chests.getFirstDead();


        if (!monster) {
            monster = new Monster(this, monsterObject.x * 2, monsterObject.y * 2, 'monsters', 0, monsterObject.id, monsterObject.health, monsterObject.maxHealth);
            this.monsters.add(monster)
        } else {
            monster.coins = monsterObject.gold;
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxHealth = monsterObject.maxHealth;
            monster.setTexture('monsters', monsterObject.frame);

            monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
            monster.makeActive();
        }
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

        this.physics.add.collider(this.monsters, this.map.blocked);

        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
        this.physics.add.overlap(this.player, this.monsters, this.enemyOverlap, null, this);
    }

    collectChest(player, chest) {
        this.score += chest.coins;
        this.events.emit('updateScore', this.score)
        chest.makeInactive();

        this.events.emit('pickUpChest', chest.id);
    }


    enemyOverlap(player, enemy){
        enemy.makeInactive();
        this.events.emit('destroyEnemy',enemy.id);
    }

    createMap() {
        this.map = new Map(this, 'map', 'colored');
    }

    createGameManager() {
        this.events.on('spawnPlayer', (location) => {
            this.createPlayer(location);
            this.addCollisions();
        });

        this.events.on('spawnChest', (chest) => {
            this.spawnChest(chest);
        });


        this.events.on('spawnMonster', (monster) => {
            this.spawnMonster(monster);
        });


        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}