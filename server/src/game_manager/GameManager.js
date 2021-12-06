import jwt from "jsonwebtoken";
import PlayerModel from "../models/PlayerModel";
import UserModel from "../models/UserModel";
import ChatModel from "../models/ChatModel";

import * as levelData from "../../public/assets/level/new_level.json";
import * as itemData from "../../public/assets/level/tools.json";
import * as enemyData from "../../public/assets/Enemies/enemies.json";

import Spawner from "./controllers/Spawner";
import {
  getRandonValues,
  randomNumber,
  SpawnerType,
  WeaponTypes,
} from "./utils";
import ItemModel from "../models/ItemModel";
import ChestModel from "../models/ChestModel";
import { v4 } from "uuid";
import MonsterModel from "../models/MonsterModel";

export default class GameManager {
  constructor(io) {
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.items = {};
    this.npcs = {};

    this.rangedObjects = {};

    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.npcLocations = {};

    this.itemsLocations = itemData.locations;

    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop,
    };
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
  }

  parseMapData() {
    this.levelData = levelData;
    this.levelData.layers.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === "npc_locations") {
        layer.objects.forEach((obj) => {
          if (this.npcLocations[obj.properties.spawner]) {
            this.npcLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.npcLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      }
    });
  }

  setupEventListeners() {
    this.io.on("connection", (socket) => {
      // player disconnected

      socket.on("savePlayerData", async () => {
        try {
          if (!this.players[socket.id].items) {
            this.players[socket.id].items = null;
          }

          if (!this.players[socket.id].equipedItems) {
            this.players[socket.id].equipedItems = null;
          }

          await UserModel.updateOne(
            { username: this.players[socket.id].playerName },
            {
              $set: {
                player: this.players[socket.id],
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("disconnect", () => {
        // delete user data from server

        console.log("disconnect");

        delete this.players[socket.id];

        // emit a message to all players to remove this player
        this.io.emit("disconnected", socket.id);
      });

      socket.on("sendMessage", async (message, token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { email } = decoded.user;
          await ChatModel.create({ email, message });
          this.io.emit("newMessage", {
            message,
            name: this.players[socket.id].playerName,
            frame: this.players[socket.id].frame,
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("newPlayer", async (token, key) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { name, _id } = decoded.user;

          const playerSchema = await UserModel.findById(_id);
          // create a new Player

          this.spawnPlayer(socket.id, name, key, playerSchema.player);

          // send the players object to the new player
          socket.emit("currentPlayers", this.players);

          // send the monsters object to the new player
          socket.emit("currentMonsters", this.monsters);

          // send the chests object to the new player
          socket.emit("currentChests", this.chests);

          // send the items object to the new player
          socket.emit("currentItems", this.items);

          // send the npcs object to the new player
          socket.emit("currentNpcs", this.npcs);

          // inform the other players of the new player that joined
          socket.broadcast.emit("spawnPlayer", this.players[socket.id]);
          socket.emit("updateItems", this.players[socket.id]);
          socket.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );
        } catch (error) {
          console.log(error);
          socket.emit("invalidToken");
        }
      });

      socket.on("playerMovement", (playerData) => {
        if (this.players[socket.id]) {
          this.players[socket.id].x = playerData.x;
          this.players[socket.id].y = playerData.y;
          this.players[socket.id].flipX = playerData.flipX;
          this.players[socket.id].actionAActive = playerData.actionAActive;
          this.players[socket.id].potionAActive = playerData.potionAActive;
          this.players[socket.id].frame = playerData.frame;
          this.players[socket.id].currentDirection =
            playerData.currentDirection;
          // emit a message to all players about the player that moved
          this.io.emit("playerMoved", this.players[socket.id]);
        }
      });

      socket.on("pickUpChest", (chestId) => {
        // update the spawner
        if (this.chests[chestId]) {
          const { gold } = this.chests[chestId];

          // updating the players gold
          this.players[socket.id].updateGold(gold);
          socket.emit("updateScore", this.players[socket.id].gold);
          socket.broadcast.emit(
            "updatePlayersScore",
            socket.id,
            this.players[socket.id].gold
          );
          // removing the chest
          this.deleteChest(chestId);
        }
      });

      socket.on("pickUpItem", (itemId) => {
        // update the spawner
        if (this.items[itemId]) {
          if (this.players[socket.id].canPickupItem()) {
            this.players[socket.id].addItem(this.items[itemId]);
            socket.emit("updateItems", this.players[socket.id]);
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );

            // removing the item
            this.deleteItems(itemId);
          }
        }
      });

      socket.on("playerDroppedItem", (itemId) => {
        this.players[socket.id].removeItem(itemId);
        socket.emit("updateItems", this.players[socket.id]);
        socket.broadcast.emit(
          "updatePlayersItems",
          socket.id,
          this.players[socket.id]
        );
      });

      socket.on("playerEquipedItem", (itemId) => {
        if (this.players[socket.id].items[itemId]) {
          if (this.players[socket.id].canEquipItem()) {
            this.players[socket.id].equipItem(
              this.players[socket.id].items[itemId]
            );

            socket.emit("updateItems", this.players[socket.id]);
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );
          }
        }
      });

      socket.on("playerUnequipedItem", (itemId) => {
        if (this.players[socket.id].equipedItems[itemId]) {
          if (this.players[socket.id].canPickupItem()) {
            this.players[socket.id].addItem(
              this.players[socket.id].equipedItems[itemId]
            );

            this.players[socket.id].removeEquipedItem(itemId);

            socket.emit("updateItems", this.players[socket.id]);
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );
          }
        }
      });

      socket.on("levelUp", () => {
        this.players[socket.id].levelUp();
        this.io.emit(
          "updatePlayerStats",
          socket.id,
          this.players[socket.id].level,
          this.players[socket.id].attack,
          this.players[socket.id].defense,
          this.players[socket.id].maxHealth,
          this.players[socket.id].exp,
          this.players[socket.id].maxExp
        );
      });

      socket.on("attackedPlayer", (attackedPlayerId) => {
        if (this.players[attackedPlayerId]) {
          // get required info from attacked player
          const { gold } = this.players[attackedPlayerId];
          const playerAttackValue = this.players[socket.id].attack;

          // subtract health from attacked player
          this.players[attackedPlayerId].playerAttacked(playerAttackValue);

          // check attacked players health, if dead send gold to other player
          if (this.players[attackedPlayerId].health <= 0) {
            // get the amount of gold, and update player object
            this.players[socket.id].updateGold(gold);

            // respawn attacked player
            this.players[attackedPlayerId].respawn(this.players);
            this.io.emit("respawnPlayer", this.players[attackedPlayerId]);

            // send update gold message to player
            socket.emit("updateScore", this.players[socket.id].gold);

            // reset the attacked players gold
            this.players[attackedPlayerId].updateGold(-gold);
            this.io
              .to(`${attackedPlayerId}`)
              .emit("updateScore", this.players[attackedPlayerId].gold);

            // add bonus health to the player
            this.players[socket.id].updateHealth(15);
            this.io.emit(
              "updatePlayerHealth",
              socket.id,
              this.players[socket.id].health
            );
          } else {
            this.io.emit(
              "updatePlayerHealth",
              attackedPlayerId,
              this.players[attackedPlayerId].health
            );
          }
        }
      });

      socket.on("monsterAttacked", (monsterId, dis) => {
        // update the spawner
        if (this.monsters[monsterId]) {
          const { gold, attack, exp } = this.monsters[monsterId];
          const playerAttackValue = this.players[socket.id].attack;
          // subtract health monster model
          this.monsters[monsterId].loseHealth(playerAttackValue);

          // check the monsters health, and if dead remove that object
          if (this.monsters[monsterId].health <= 0) {
            // updating the players gold
            this.players[socket.id].updateGold(gold);
            socket.emit("updateScore", this.players[socket.id].gold);

            //update xp
            this.players[socket.id].updateExp(exp);
            this.io.emit("updateXp", exp, socket.id);

            this.deleteMonster(monsterId);
          } else {
            // update the monsters health
            this.io.emit(
              "updateMonsterHealth",
              monsterId,
              this.monsters[monsterId].health
            );
          }
        }
      });

      socket.on("monsterAttack", (monsterId, playerId) => {
        const { attack } = this.monsters[monsterId];
        // update the players health
        this.players[playerId].playerAttacked(attack);
        this.io.emit(
          "updatePlayerHealth",
          playerId,
          this.players[playerId].health
        );

        // check the player's health, if below 0 have the player respawn
        if (this.players[playerId].health <= 0) {
          // update the gold the player has
          this.players[playerId].updateGold(
            parseInt(-this.players[playerId].gold / 2, 10)
          );
          socket.emit("updateScore", this.players[playerId].gold);

          // respawn the player
          this.players[playerId].respawn(this.players);
          this.io.emit("respawnPlayer", this.players[playerId]);
        }
      });

      socket.on("playerHit", (damage) => {});

      socket.on("healthPotion", (playerId, health) => {
        if (socket.id === playerId) {
          this.players[socket.id];
          this.players[socket.id].potion(health);
          this.io.emit(
            "updatePlayerHealth",
            socket.id,
            this.players[socket.id].health
          );
        }
      });

      socket.on("sendBuyItemMessage", (item) => {
        this.players[socket.id].potions++;

        this.players[socket.id].updateGold(-item.price);
        socket.emit("updateScore", this.players[socket.id].gold);
        socket.broadcast.emit(
          "updatePlayersScore",
          socket.id,
          this.players[socket.id].gold
        );
      });

      socket.on("monsterMovement", (monsterData) => {
        if (!this.monsters[monsterData.id]) return;
        this.monsters[monsterData.id].stateTime = monsterData.stateTime;
        this.monsters[monsterData.id].randomPosition = monsterData.randomPosition;
        // this.monsters[monsterData.id].x = monsterData.x;
        // this.monsters[monsterData.id].y = monsterData.y;
        // emit a message to all players about the monster that moved

        this.io.emit("monsterMoved", this.monsters[monsterData.id]);
      });

      socket.on("dropItem", (x, y, item) => {
        this.itemDictionary[item](x, y);
      });

      // player connected to our game
      console.log("player connected to our game");
    });
  }

  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      spawnerType: SpawnerType.CHEST,
      id: "",
    };
    let spawner;
    // create chest spawners
    Object.keys(this.chestLocations).forEach((key) => {
      config.id = `chest-${key}`;

      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create monster spawners
    Object.keys(this.monsterLocations).forEach((key) => {
      config.id = `monster-${key}`;
      config.limit = 8;
      config.spawnerType = SpawnerType.MONSTER;

      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create npc spawners
    Object.keys(this.npcLocations).forEach((key) => {
      config.id = `npc-${key}`;
      config.spawnerType = SpawnerType.NPC;

      spawner = new Spawner(
        config,
        this.npcLocations[key],
        this.addNpc.bind(this),
        this.deleteNpc.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create items spawners
    config.id = "item";
    config.spawnerType = SpawnerType.ITEM;
    spawner = new Spawner(
      config,
      this.itemsLocations,
      this.addItems.bind(this),
      this.deleteItems.bind(this)
    );
    this.spawners[spawner.id] = spawner;

    setInterval(() => {
      if ((Object.keys(this.monsters).length< 8)) {
        this.spawnMonster();
      }
    }, 3000);
  }
  spawnPlayer(playerId, name, key, playerSchema) {
    const player = new PlayerModel(
      playerId,
      this.playerLocations,
      this.players,
      name,
      key,
      undefined,
      playerSchema
    );
    this.players[playerId] = player;
  }

  addItems(itemId, item) {
    this.items[itemId] = item;
    this.io.emit("itemSpawned", item);
  }

  deleteItems(itemId) {
    delete this.items[itemId];
    this.io.emit("itemRemoved", itemId);
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.io.emit("chestSpawned", chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
    this.io.emit("chestRemoved", chestId);
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.io.emit("monsterSpawned", monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
    this.io.emit("monsterRemoved", monsterId);
  }

  addNpc(npcId, npc) {
    this.npcs[npcId] = npc;
    this.io.emit("npcSpawned", npc);
  }

  deleteNpc(npcId) {
    delete this.npcs[npcId];
    this.io.emit("npcRemoved", npcId);
  }

  drop(x, y) {}

  createChest(x, y) {
    const chest = new ChestModel(x, y, randomNumber(10, 20), `chest-${v4()}`);

    this.addChest(chest.id, chest);
  }

  createItem(x, y) {
    const randomItem =
      itemData.items[Math.floor(Math.random() * itemData.items.length)];

    const item = new ItemModel(
      x,
      y,
      `item-${v4()}`,
      randomItem.name,
      randomItem.frame,
      getRandonValues(),
      getRandonValues(),
      getRandonValues(),
      WeaponTypes.MELEE,
      "Description"
    );

    this.addItems(item.id, item);
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
      this.id,
      randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue, // exp value
      3000 //timer
    );
    this.addMonster(monster.id, monster);
  }
}
