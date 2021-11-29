import { v4 } from "uuid";
import { randomNumber } from "../game_manager/utils";

export default class MonsterModel {
  constructor(x, y, gold, spawnerId, key, health, attack, exp, stateTime) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x * 2;
    this.y = y * 2;
    this.gold = gold;
    this.key = key;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.exp = exp;
    this.stateTime = stateTime;
    this.randomPosition = randomNumber(1,8);
  }

  loseHealth(attack) {
    this.health -= attack;
  }
}
