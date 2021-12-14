import MonsterModel from "../../models/MonsterModel";
import * as enemyData from "../../../public/assets/Enemies/enemies.json";
import { v4 } from "uuid";

export default class MonsterController {
  constructor(io) {
    this.monsters = {};
    this.monsterLocations = [];
    this.io = io;

    this.setupSpawn();
    this.init();
  }

  init() {
    this.update();
  }

  setupEventListeners(socket, playerList) {
    socket.on("monsterAttacked", (monsterId) => {
      // update the spawner
      if (this.monsters[monsterId]) {
        const monster = this.monsters[monsterId];
        const { exp } = monster;
        const playerAttackValue = playerList[socket.id].attack;
        // subtract health monster model
        monster.loseHealth(playerAttackValue);

        // check the monsters health, and if dead remove that object
        if (monster.health <= 0) {
          //update xp
          playerList[socket.id].updateExp(exp);
          this.io.emit("updateXp", exp, socket.id);

          this.deleteMonster(monster.id);
        } else {
          // update the monsters health
          this.io.emit("updateMonsterHealth", monsterId, monster.health);
        }
      }
    });

    socket.on("monsterAttack", (monsterId, playerId) => {
      if (!this.monsters[monsterId]) return;
      const { attack } = this.monsters[monsterId];
      // update the players health
      playerList[playerId].playerAttacked(attack);
      this.io.emit("updatePlayerHealth", playerId, playerList[playerId].health);

      // check the player's health, if below 0 have the player respawn
      if (playerList[playerId].health <= 0) {
        // update the gold the player has
        playerList[playerId].updateGold(
          parseInt(-playerList[playerId].gold / 2, 10)
        );
        playerList[playerId].updateExp(
          parseInt(-playerList[playerId].exp / 2, 10)
        );
        socket.emit("updateScore", playerList[playerId].gold);

        // respawn the player
        playerList[playerId].respawn(playerList);
        this.io.emit("respawnPlayer", playerList[playerId]);
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
    }, 8000);
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
