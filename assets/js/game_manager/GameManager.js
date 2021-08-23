
class GameManager {
    constructor(scene, mapData) {
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};

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
        this.scene.events.on('pickUpChest',(chestId)=>{
            if(this.chests[chestId]){
                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
            }
         });

         this.scene.events.on('destroyEnemy',(enemyId)=>{
            if(this.monsters[enemyId]){
                this.spawners[this.monsters[enemyId].spawnerId].removeObject(enemyId);
            }
         });
    }


    setupSpawners() {
        const config = {
            spawnInterval:3000,
            limit:3,
            spawnerType:SpawnerType.MONSTER,
            id: ''
        };

        let spawner;

        Object.keys(this.chestLocations).forEach((key)=>{
            config.id = `chest-${key}`;
            config.spawnerType = SpawnerType.CHEST;
            spawner = new Spawner(
                config,
                this.chestLocations[key], 
                this.addChest.bind(this),
                this.deleteChest.bind(this));
            this.spawners[spawner.id] = spawner;
        });


        Object.keys(this.monsterLocations).forEach((key)=>{
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            spawner = new Spawner(
                config,
                this.monsterLocations[key], 
                this.addMonster.bind(this),
                this.deleteMonster.bind(this));
            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer',location);
    }


    addChest(chestId, chest){
        this.chests[chestId] = chest;
        this.scene.events.emit('spawnChest',chest);
    }

    deleteChest(chestId){
        delete this.chests[chestId];
    }

    addMonster(monsterId, monster){
        this.monsters[monsterId] = monster;
        this.scene.events.emit('spawnMonster',monster);
    }

    deleteMonster(monsterId){
        delete this.monsters[monsterId]
    }
}