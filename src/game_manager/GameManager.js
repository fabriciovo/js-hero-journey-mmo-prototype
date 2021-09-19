import jwt from "jsonwebtoken";
import PlayerModel from "./PlayerModel";
import * as levelData from "../../public/assets/level/large_level.json";
import * as itemData from "../../public/assets/level/tools.json";

import Spawner from "./Spawner";
import ChatModel from "../models/ChatModel";
import { SpawnerType } from "./utils";
import UserModel from "../models/UserModel";
import mongoose from "mongoose";
import { async } from "regenerator-runtime";
export default class GameManager {
  constructor(io) {
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.items = {};

    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.itemsLocations = itemData.locations;
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
      }
    });
  }

  setupEventListeners() {
    this.io.on("connection", (socket) => {
      // player disconnected

      /*socket.on("disconnect", async () => {
        // delete user data from server
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { data } = decoded.user;
          console.log(data)
          await UserModel.save({ data });
          console.log(this.players[socket.id]);

          delete this.players[socket.id];

          // emit a message to all players to remove this player
          this.io.emit("disconnected", socket.id);
        } catch (error) {
          console.log(error);
        }
      });*/

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

      socket.on("sendMessage", async (message, token, player) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { name, email } = decoded.user;
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

      socket.on("newPlayer", async (token, frame) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { name, _id } = decoded.user;

          const playerSchema = await UserModel.findById(_id);
          // create a new Player
          this.spawnPlayer(socket.id, name, frame, playerSchema.player);

          // send the players object to the new player
          socket.emit("currentPlayers", this.players);

          // send the monsters object to the new player
          socket.emit("currentMonsters", this.monsters);

          // send the chests object to the new player
          socket.emit("currentChests", this.chests);

          // send the items object to the new player
          socket.emit("currentItems", this.items);

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
          this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
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
            this.spawners[this.items[itemId].spawnerId].removeObject(itemId);
          }
        }
      });

      socket.on("equipedItem", (itemId) => {
        if (this.items[itemId]) {
          if (this.players[socket.id].canEquipItem()) {
            this.players[socket.id].equipItem(this.items[itemId]);
            socket.emit("updateItems", this.players[socket.id]);
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );
          }
        }
      });

      socket.on("monsterAttacked", (monsterId) => {
        // update the spawner
        if (this.monsters[monsterId]) {
          const { gold, attack } = this.monsters[monsterId];
          const playerAttackValue = this.players[socket.id].attack;
          // subtract health monster model
          this.monsters[monsterId].loseHealth(playerAttackValue);

          // check the monsters health, and if dead remove that object
          if (this.monsters[monsterId].health <= 0) {
            // updating the players gold
            this.players[socket.id].updateGold(gold);
            socket.emit("updateScore", this.players[socket.id].gold);

            // removing the monster
            this.spawners[this.monsters[monsterId].spawnerId].removeObject(
              monsterId
            );
            this.io.emit("monsterRemoved", monsterId);
            // add bonus health to the player
            this.players[socket.id].updateHealth(15);
            this.io.emit(
              "updatePlayerHealth",
              socket.id,
              this.players[socket.id].health
            );
          } else {
            // update the players health
            this.players[socket.id].playerAttacked(attack);
            this.io.emit(
              "updatePlayerHealth",
              socket.id,
              this.players[socket.id].health
            );

            // update the monsters health
            this.io.emit(
              "updateMonsterHealth",
              monsterId,
              this.monsters[monsterId].health
            );

            // check the player's health, if below 0 have the player respawn
            if (this.players[socket.id].health <= 0) {
              // update the gold the player has
              this.players[socket.id].updateGold(
                parseInt(-this.players[socket.id].gold / 2, 10)
              );
              socket.emit("updateScore", this.players[socket.id].gold);

              // respawn the player
              this.players[socket.id].respawn(this.players);
              this.io.emit("respawnPlayer", this.players[socket.id]);
            }
          }
        }
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
      config.spawnerType = SpawnerType.MONSTER;

      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this),
        this.moveMonsters.bind(this)
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
  }
  spawnPlayer(playerId, name, frame, playerSchema) {
    const player = new PlayerModel(
      playerId,
      this.playerLocations,
      this.players,
      name,
      frame,
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

  moveMonsters() {
    this.io.emit("monsterMovement", this.monsters);
  }
}
