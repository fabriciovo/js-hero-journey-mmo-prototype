class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        
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

    createPlayer(playerObject) {
        this.player = new PlayerContainer(this, 
            playerObject.x * 2, 
            playerObject.y * 2, 
            'characters', 
            0,
            playerObject.health,
            playerObject.maxHealth,
            playerObject.id);
    }
    createGroups() {
        this.chests = this.physics.add.group();
        this.monsters = this.physics.add.group();
        this.monsters.runChildUpdate = true;
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
            monster = new Monster(this, monsterObject.x, monsterObject.y, 'monsters', 0, monsterObject.id, monsterObject.health, monsterObject.maxHealth);
            this.monsters.add(monster)
        } else {
            monster.coins = monsterObject.gold;
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxHealth = monsterObject.maxHealth;
            monster.setTexture('monsters', monsterObject.frame);

            monster.setPosition(monsterObject.x, monsterObject.y);
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
        this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);
    }

    collectChest(player, chest) {
        this.events.emit('pickUpChest', chest.id, player.id);
    }


    enemyOverlap(weapon, enemy){
        if(this.player.playerAttacking && !this.player.swordHit){
            this.player.swordHit = true;
            console.log(enemy)
            this.events.emit('enemyAttacked',enemy.id, this.player.id);
        }
        
    }

    createMap() {
        this.map = new Map(this, 'map', 'colored');
    }

    createGameManager() {
        this.events.on('spawnPlayer', (playerObject) => {
            this.createPlayer(playerObject);
            this.addCollisions();
        });

        this.events.on('spawnChest', (chest) => {
            this.spawnChest(chest);
        });

        this.events.on('chestRemoved', (chestId) => {
            this.chests.getChildren().forEach((chest)=>{
                if(chest.id === chestId){
                    chest.makeInactive();
                }
            });
        });

        this.events.on('spawnMonster', (monster) => {
            this.spawnMonster(monster);
        });

        this.events.on('monsterRemoved', (monsterId) => {
            this.monsters.getChildren().forEach((monster)=>{
                if(monster.id === monsterId){
                    monster.makeInactive();
                }
            });
        });
    
        this.events.on('updateMonsterHealth', (monsterId, health) => {
            this.monsters.getChildren().forEach((monster)=>{
                if(monster.id === monsterId){
                    monster.updateHealth(health);
                }
            });
        });

        this.events.on('monstersMovement', (monsters) => {
            this.monsters.getChildren().forEach((monster)=>{
                Object.keys(monsters).forEach((monsterId) =>{
                    if(monsterId === monster.id){
                        this.physics.moveToObject(monster, monsters[monsterId],40);
                    }
                });
            });
        });

        this.events.on('updatePlayerHealth', (playerId, health) => {
            this.player.updateHealth(health);
        });

        this.events.on('respawnPlayer', (playerObject) => {
            this.player.respawn(playerObject);
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}