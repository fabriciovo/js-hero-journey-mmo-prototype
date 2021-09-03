import v4 from 'uuid/v4';

export default class PlayerModel {
    constructor(spawnLocations){
        this.health = 3;
        this.maxHealth = 3;
        this.gold = 0;
        this.id = this.id = `player-${v4()}`;
        this.spawnLocations = spawnLocations;

        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        [this.x,this.y] = location;

    }

    updateGold(gold){
        this.gold += gold;
    }


    updateHealth(health){
        this.health += health;
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
    }
    

    respawn(){
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        this.x = location[0] * 2;
        this.y = location[1] * 2;
    }
}