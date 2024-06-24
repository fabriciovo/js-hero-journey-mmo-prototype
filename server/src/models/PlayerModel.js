export default class PlayerModel {
  constructor(
    playerId,
    spawnLocations,
    players,
    name,
    key,
    actionB,
    playerSchema
  ) {
    this.attack = playerSchema.attack;
    this.defense = playerSchema.defense;
    this.health = playerSchema.health;
    this.maxHealth = playerSchema.maxHealth;
    this.gold = playerSchema.gold;
    this.id = playerId;
    this.playerName = name;
    this.key = key;
    this.items = playerSchema.items || {};
    this.equipedItems = playerSchema.equipedItems || {};
    this.level = playerSchema.level;
    this.exp = playerSchema.exp;
    this.maxExp = playerSchema.maxExp;
    this.potions = playerSchema.potions;
    //this.playerItems =  {};

    this.maxNumberOfItems = 5;

    this.spawnLocations = spawnLocations;
    this.actionAActive = false;
    this.potionAActive = false;
    this.flipX = true;
    const location = this.generateLocation(players);
    this.x = location[0];
    this.y = location[1];
  }

  addItem(item) {
    console.log(item)
    if(item){
      this.items[item.id] = item;
    }
  }

  equipItem(item) {
    this.equipedItems[item.id] = item;
    this.attack += this.equipedItems[item.id].attackBonus;
    this.defense += this.equipedItems[item.id].defenseBonus;
    this.maxHealth += this.equipedItems[item.id].healthBonus;
    this.removeItem(item.id);
  }

  removeEquipedItem(itemId) {
    this.attack -= this.equipedItems[itemId].attackBonus;
    this.defense -= this.equipedItems[itemId].defenseBonus;
    this.maxHealth -= this.equipedItems[itemId].healthBonus;
    delete this.equipedItems[itemId];
  }

  removeItem(itemId) {
    // this.attack -= this.items[itemId].attackBonus;
    // this.defense -= this.items[itemId].defenseBonus;
    // this.maxHealth -= this.items[itemId].healthBonus;
    delete this.items[itemId];
  }

  canPickupItem() {
    if (Object.keys(this.items).length < 5) {
      return true;
    }
    return false;
  }

  canEquipItem() {
    if (Object.keys(this.equipedItems).length < 5) {
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

  potion(health) {
    this.updateHealth(health);
    this.potions--;
  }

  updateExp(exp) {
    this.exp += exp;
  }

  levelUp() {
    this.attack += 3;
    this.defense += 2;
    this.maxHealth += 1;
    this.level++;
    const calcNewExp = this.exp - this.maxExp;
    this.exp = calcNewExp <= 0 ? 0 : calcNewExp;
    this.maxExp = this.maxExp * 2;
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
    return [200, 200];
  }
}
