export default class PlayerModel {
    constructor(playerId, spawnLocations, players) {
        this.health = 10;
        this.maxHealth = 10;
        this.gold = 0;
        this.id = playerId;
        this.spawnLocations = spawnLocations;
        this.playerAttacking = false;
        this.flipX = true;
        const location = this.generateLocation(players);
        this.x = location[0];
        this.y = location[1];
    }

    updateGold(gold) {
        this.gold += gold;
    }

    updateHealth(health) {
        this.health += health;
        if (this.health > 10) this.health = 10;
    }

    respawn(players) {
        this.health = this.maxHealth;
        const location = this.generateLocation(players);
        this.x = location[0];
        this.y = location[1];
    }


    generateLocation(players){
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        const invalidLocation = Object.keys(players).some(key =>{
            if(players[key].x === location[0] && players[key].y === location[1]){
                return true;
            }else{
                return false;
            }
        });

        if(invalidLocation){
            return this.generateLocation(players);
        }else{
            return location;
        }

    }


}
