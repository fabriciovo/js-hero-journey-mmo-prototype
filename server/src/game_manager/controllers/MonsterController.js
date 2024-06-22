import MonsterModel from "../../models/MonsterModel";
import * as enemyData from "../../../public/assets/Enemies/enemies.json";
import { v4 } from "uuid";

export default class MonsterController {
  constructor(io, locations) {
    this.monsters = {};
    this.monsterLocations = locations;
    this.io = io;

    this.setupSpawn();
    this.init();
  }

  init() {
    this.update();
  }

  setupEventListeners(socket) {
    return socket.on("monsterHit", (monsterId, playerAttack, playerId) => {
      if (!this.monsters[monsterId]) return;
      const monster = this.monsters[monsterId];
      const { exp } = monster;
      const playerAttackValue = playerAttack;
      monster.loseHealth(playerAttackValue);

      if (monster.health <= 0) {
        this.io.emit("updateXp", exp, playerId);
        this.deleteMonster(monster.id);
      } else {
        socket.emit("updateMonsterHealth", monsterId, monster.health);
      }
    });
  }

  update() {
    setInterval(() => {
      Object.keys(this.monsters).forEach((id) => {
        if (!this.monsters[id]) return;
        this._movement(this.monsters[id]);
      });
    }, 1000);
  }

  setupSpawn() {
    setInterval(() => {
      if (Object.keys(this.monsters).length <= 8) {
        this.spawnMonster();
      }
    }, 3000);
  }

  pickRandomLocation() {
    const location =
      this.monsterLocations[
        Math.floor(Math.random() * this.monsterLocations.length)
      ];

    if (this.monsters.length > 0) {
      const invalidLocation = this.monsters.some((obj) => {
        if (obj.x === location[0] && obj.y === location[1]) {
          return true;
        }
        return false;
      });

      if (invalidLocation) return this.pickRandomLocation();
      return location || [200, 200];
    }
    return location || [200, 200];
  }

  spawnMonster() {
    const randomEnemy =
      enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];
    const location = this.pickRandomLocation();
    const monster = new MonsterModel(
      location[0],
      location[1],
      randomEnemy.goldValue, // gold value
      `monster-${v4()}`,
      randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue, // exp value
      3000 //timer
    );
    this.addMonster(monster.id, monster);
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.io.emit("monsterSpawned", monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
    this.io.emit("monsterRemoved", monsterId);
  }

  addLocation(x, y) {
    this.monsterLocations.push([x, y]);
  }

  getMonsterList() {
    return this.monsters;
  }

  getMonster(monsterId) {
    return this.monsters[monsterId];
  }
  getMonsterLocationList() {
    return this.monsterLocations;
  }

  _movement(monster) {
    monster.move();
    this.io.emit("monsterMovement", monster);
  }
}
