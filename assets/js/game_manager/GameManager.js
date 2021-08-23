
class GameManager {
    constructor(scene, mapData) {
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};

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

            } else if (layer.name === 'monster_location') {
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

    }

    addChest(id, chest){
        this.chests[id] = chest;
        console.log(chest)
    }

    deleteChest(){

    }

    setupSpawners() {
        Object.keys(this.chestLocations).forEach((key)=>{
            const config = {
                spawnInterval:3000,
                limit:3,
                spawnerType:'CHEST',
                id: `chest-${key}`
            };
            const spawner = new Spawner(
                config,
                this.chestLocations[key], 
                this.addChest.bind(this),
                this.deleteChest.bind(this));
            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        
        this.scene.events.emit('spawnPlayer',location);
    }
}