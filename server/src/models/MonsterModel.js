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
    this.randomPosition = randomNumber(1, 8);
    this.targetPosition = { x: 0, y: 0 };
    this.monsterChasing = false;
  }

  setTargetPos(position) {
    this.targetPosition = { x: position.x, y: position.y };
  }

  setChasing(value) {
    this.monsterChasing = value
  }
  
  getMonsterChase() {
    return this.monsterChasing;
  }
  move() {
    if(this.monsterChasing) return
    const randomPosition = randomNumber(1, 9);
    const distance = 64;
    switch (randomPosition) {
      case 1:
        this.setTargetPos({ x: (this.x += distance), y: this.y });
        break;
      case 2:
        this.setTargetPos({ x: (this.x -= distance), y: this.y });

        break;
      case 3:
        this.setTargetPos({ x: this.x, y: (this.y += distance) });
        break;
      case 4:
        this.setTargetPos({ x: this.x, y: (this.y -= distance) });
        break;
      case 5:
        this.setTargetPos({ x: (this.x += distance), y: (this.y += distance) });

        break;
      case 6:
        this.setTargetPos({ x: (this.x += distance), y: (this.y -= distance) });

        break;
      case 7:
        this.setTargetPos({ x: (this.x -= distance), y: (this.y += distance) });

        break;
      case 8:
        this.setTargetPos({ x: (this.x -= distance), y: (this.y -= distance) });

        break;
        case 8:
          this.setTargetPos({ x: this.x , y: this.y  });
  
          break;
      default:

        break;
    }
  }

  loseHealth(attack) {
    this.health -= attack;
  }
}
