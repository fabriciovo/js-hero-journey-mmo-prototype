import { SpawnerType, randomNumber, WeaponTypes } from "../utils";
import ChestModel from "../../models/ChestModel";
import MonsterModel from "../../models/MonsterModel";
import ItemModel from "../../models/ItemModel";
import * as itemData from "../../../public/assets/level/tools.json";
import * as enemyData from "../../../public/assets/Enemies/enemies.json";

import NpcModel from "../../models/NpcModel";

function getRandonValues() {
  const bonus = [
    -3, -5, -6, 0, 5, 3, 4, 7, 2, 1, 8, 10, 11, 23, 12, 13, 14, 15, 16, 9,
  ];
  return bonus[Math.floor(Math.random() * bonus.length)];
}

export default class Spawner {
  constructor(config, spawnLocations, addObject, deleteObject, moveObjects) {
    this.id = config.id;
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType;
    this.spawnLocations = spawnLocations;
    this.addObject = addObject;
    this.deleteObject = deleteObject;
    this.moveObjects = moveObjects;

    this.objectsCreated = [];

    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      if (this.objectsCreated.length < this.limit) {
        this.spawnObject();
      }
    }, this.spawnInterval);
    if (this.objectType === SpawnerType.MONSTER) this.moveMonsters();
  }

  spawnObject() {
    if (this.objectType === SpawnerType.CHEST) {
      this.spawnChest();
    } else if (this.objectType === SpawnerType.MONSTER) {
      this.spawnMonster();
    } else if (this.objectType === SpawnerType.ITEM) {
      this.spawnItem();
    } else if (this.objectType === SpawnerType.NPC) {
      this.spawnNpc();
    }
  }

  spawnItem() {
    const location = this.pickRandomLocation();

    const randomItem =
      itemData.items[Math.floor(Math.random() * itemData.items.length)];

    const item = new ItemModel(
      location[0],
      location[1],
      this.id,
      randomItem.name,
      randomItem.frame,
      getRandonValues(),
      getRandonValues(),
      getRandonValues(),
      WeaponTypes.MELEE,
      "Description"
    );
    this.objectsCreated.push(item);
    this.addObject(item.id, item);
  }

  spawnChest() {
    const location = this.pickRandomLocation();
    const chest = new ChestModel(
      location[0],
      location[1],
      randomNumber(10, 20),
      this.id
    );
    this.objectsCreated.push(chest);
    this.addObject(chest.id, chest);
  }

  spawnMonster() {
    const randomEnemy =
      enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];

    const location = this.pickRandomLocation();
    const monster = new MonsterModel(
      location[0],
      location[1],
      randomEnemy.goldValue, // gold value
      this.id,
      randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue // exp value
    );
    this.objectsCreated.push(monster);
    this.addObject(monster.id, monster);
  }

  spawnNpc() {
    const location = this.pickRandomLocation();
    const npc = new NpcModel(location[0], location[1], this.id);
    this.objectsCreated.push(npc);
    this.addObject(npc.id, npc);
  }

  pickRandomLocation() {
    const location =
      this.spawnLocations[
        Math.floor(Math.random() * this.spawnLocations.length)
      ];
    const invalidLocation = this.objectsCreated.some((obj) => {
      if (obj.x === location[0] && obj.y === location[1]) {
        return true;
      }
      return false;
    });

    if (invalidLocation) return this.pickRandomLocation();
    return location;
  }

  removeObject(id) {
    this.objectsCreated = this.objectsCreated.filter((obj) => obj.id !== id);
    this.deleteObject(id);
  }

  moveMonsters() {
    this.moveMonsterInterval = setInterval(() => {
      this.objectsCreated.forEach((monster) => {
        monster.move();
      });

      this.moveObjects();
    }, 1000);
  }
}
