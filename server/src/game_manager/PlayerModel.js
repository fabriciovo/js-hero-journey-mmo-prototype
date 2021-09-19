export default class PlayerModel {
  constructor(playerId, spawnLocations, players, name, frame, playerSchema) {
    this.attack = playerSchema.attack;
    this.defense = playerSchema.defense;
    this.health = playerSchema.health;
    this.maxHealth = playerSchema.maxHealth;
    this.gold = playerSchema.gold;
    this.id = playerId;
    this.playerName = name;
    this.frame = frame;
    this.items = playerSchema.items || {};
    //this.playerItems =  {};

    this.maxNumberOfItems = 5;

    this.spawnLocations = spawnLocations;
    this.playerAttacking = false;
    this.flipX = true;
    const location = this.generateLocation(players);
    this.x = location[0];
    this.y = location[1];
  }

  addItem(item) {
    this.items[item.id] = item;
    this.attack += item.attackBonus;
    this.defense += item.defenseBonus;
    this.maxHealth += item.healthBonus;
  }
  removeItem(itemId) {
    this.attack -= this.items[itemId].attackBonus;
    this.defense -= this.items[itemId].defenseBonus;
    this.maxHealth -= this.items[itemId].healthBonus;
    delete this.items[itemId];
  }

  canPickupItem() {
    if (Object.keys(this.items).length < 5) {
      return true;
    }
    return false;
  }

  playerAttacked(attack) {
    let damage = this.defense - attack;
    if (damage > 0) damage = 0;

    this.updateHealth(damage);
  }

  updateGold(gold) {
    this.gold += gold;
  }

  updateHealth(health) {
    this.health += health;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }

  respawn(players) {
    this.health = this.maxHealth;
    const location = this.generateLocation(players);
    this.x = location[0];
    this.y = location[1];
  }

  generateLocation(players) {
    const location =
      this.spawnLocations[
        Math.floor(Math.random() * this.spawnLocations.length)
      ];
    const invalidLocation = Object.keys(players).some((key) => {
      if (players[key].x === location[0] && players[key].y === location[1]) {
        return true;
      } else {
        return false;
      }
    });

    if (invalidLocation) {
      return this.generateLocation(players);
    } else {
      return location;
    }
  }
}
