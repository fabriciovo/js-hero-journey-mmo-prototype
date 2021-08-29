
class GameManager {
    constructor(scene, mapData) {
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};
        this.players = {};

        this.chestLocations = {};
        this.playerLocations = [];

        this.monsterLocations = {};
    }

    setup() {
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData() {
        this.mapData.forEach((layer) => {
            debugger
            if (layer.name === 'spawnPlayer') {
                layer.objects.forEach((obj) => {
                    this.playerLocations.push([obj.x, obj.y]);
                })

            } else if (layer.name === 'spawnChest') {

                layer.objects.forEach((obj) => {
                    if (this.chestLocations[obj.properties.spawner]) {
                        this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
                    } else {
                        this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
                    }

                })

            } else if (layer.name === 'spawnMonsters') {
                layer.objects.forEach((obj) => {
                    if (this.monsterLocations[obj.properties.spawner]) {
                        this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
                    } else {
                        this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
                    }

                })
            }
        });
    }

    setupEventListener() {
        this.scene.events.on('pickUpChest', (chestId, playerId) => {
            if (this.chests[chestId]) {
                const { gold } = this.chests[chestId];

                this.players[playerId].updateGold(gold);
                this.scene.events.emit('updateScore', this.players[playerId].gold)


                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
                this.scene.events.emit('chestRemoved', chestId)
            }
        });

        this.scene.events.on('destroyEnemy', (monsterId) => {
            if (this.monsters[monsterId]) {
                this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
            }
        });

        this.scene.events.on('enemyAttacked', (monsterId,playerId) => {
            const { gold, attack } = this.monsters[monsterId];


            if (this.monsters[monsterId]) {
                console.log(this.monsters[monsterId])
                this.monsters[monsterId].loseHealth();
                if (this.monsters[monsterId].health <= 0) {

                    this.players[playerId].updateGold(gold);
                    this.scene.events.emit('updateScore', this.players[playerId].gold)
                    this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

                    this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
                    this.scene.events.emit('monsterRemoved', monsterId);
                } else {
                    this.players[playerId].updateHealth(-attack);
                    this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

                    this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);

                    if(this.players[playerId].health <= 0){
                        this.players[playerId].updateGold(parseInt(-this.players[playerId].gold / 2),10);
                        this.scene.events.emit('updateScore', this.players[playerId].gold);

                        this.players[playerId].respawn();
                        this.scene.events.emit('respawnPlayer', this.players[playerId]);

                    }
                }
            }
        });
    }


    setupSpawners() {
        const config = {
            spawnInterval: 3000,
            limit: 3,
            spawnerType: SpawnerType.MONSTER,
            id: ''
        };

        let spawner;

        Object.keys(this.chestLocations).forEach((key) => {
            config.id = `chest-${key}`;
            config.spawnerType = SpawnerType.CHEST;
            spawner = new Spawner(
                config,
                this.chestLocations[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this));
            this.spawners[spawner.id] = spawner;
        });


        Object.keys(this.monsterLocations).forEach((key) => {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            spawner = new Spawner(
                config,
                this.monsterLocations[key],
                this.addMonster.bind(this),
                this.deleteMonster.bind(this),
                this.moveMonsters.bind(this));
            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const player = new PlayerModel(this.playerLocations);
        this.players[player.id] = player;
        this.scene.events.emit('spawnPlayer', player);
    }


    addChest(chestId, chest) {
        this.chests[chestId] = chest;
        this.scene.events.emit('spawnChest', chest);
    }

    deleteChest(chestId) {
        delete this.chests[chestId];
    }

    addMonster(monsterId, monster) {
        this.monsters[monsterId] = monster;
        this.scene.events.emit('spawnMonster', monster);
    }

    deleteMonster(monsterId) {
        delete this.monsters[monsterId]
    }

    moveMonsters(){
        this.scene.events.emit('monstersMovement', this.monsters);
    }
}