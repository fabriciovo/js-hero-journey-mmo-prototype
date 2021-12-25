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
    this.targetPos = { x: 0, y: 0 };
  }

  setTarget(target) {
    this.targetPos = {
      x: target.x,
      y: target.y,
    };
  }
  move() {
    const randomPosition = randomNumber(1, 9);
    const distance = 64;
    switch (randomPosition) {
      case 1:
        this.setTarget({ x: (this.x += distance), y: this.y });
        break;
      case 2:
        this.setTarget({ x: (this.x -= distance), y: this.y });
        break;
      case 3:
        this.setTarget({ x: this.x, y: (this.y += distance) });
        break;
      case 4:
        this.setTarget({ x: this.x, y: (this.y -= distance) });
        break;
      case 5:
        this.setTarget({ x: (this.x += distance), y: (this.y += distance) });
        break;
      case 6:
        this.setTarget({ x: (this.x += distance), y: (this.y -= distance) });

        break;
      case 7:
        this.setTarget({ x: (this.x -= distance), y: (this.y += distance) });

        break;
      case 8:
        this.setTarget({ x: (this.x -= distance), y: (this.y -= distance) });

        break;
      case 9:
        this.setTarget({ x: this.x, y: this.y });
        break;

      default:
        break;
    }
  }

  loseHealth(attack) {
    this.health -= attack;
  }

  getId() {
    return this.id;
  }
}
