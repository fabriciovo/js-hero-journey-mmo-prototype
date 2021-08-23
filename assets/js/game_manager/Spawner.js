
class Spawner {
    constructor(config, spawnLocations, addObject, deletedObject, moveObjects) {
        this.id = config.id;
        this.spawnInterval = config.spawnInterval;
        this.limit = config.limit;
        this.objectType = config.spawnerType;
        this.spawnLocations = spawnLocations;
        this.addObject = addObject;
        this.deletedObject = deletedObject;
        this.moveObjects = moveObjects;
        this.objectsCreated = [];

        this.start();

    }


    start() {
        this.interval = setInterval(() => {
            if (this.objectsCreated.length < this.limit) {
                this.spawnObject();
            }
        }, this.spawnInterval)

        if (this.objectType === SpawnerType.MONSTER) {
            this.moveMonsters();
        }
    }

    spawnObject() {
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if (this.objectType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }

    spawnChest() {
        const location = this.pickRandomLocation();
        const chest = new ChestModel(location[0], location[1], 10, this.id);
        this.objectsCreated.push(chest);
        this.addObject(chest.id, chest);
    }

    spawnMonster() {
        const location = this.pickRandomLocation();
        const monster = new MonsterModel(
            location[0], location[1], 10, this.id,
            1,10,1);
        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }

    pickRandomLocation() {
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        const invalidLocation = this.objectsCreated.some((obj) => {
            if (obj.x === location[0] && obj.y === location[1]) {
                return true;
            }
            return false;
        })

        if (invalidLocation) return this.pickRandomLocation();
        return location
    }

    removeObject(id) {
        this.objectsCreated = this.objectsCreated.filter((obj) => obj.id !== id);
        this.deletedObject(id)
    }

    moveMonsters(){
        this.moveMonstersInterval = setInterval(()=>{
            this.objectsCreated.forEach((monster)=>{
                monster.move();
            })
            this.moveObjects();
        },1000);
    }

}