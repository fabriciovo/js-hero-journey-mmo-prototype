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
import MonsterController from "./controllers/MonsterController";

export default class GameManager {
  constructor(io) {
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.players = {};
    this.items = {};
    this.npcs = {};

    this.monsterController = new MonsterController(this.io);

    this.rangedObjects = {};

    this.playerLocations = [];
    this.chestLocations = {};
    this.npcLocations = {};

    this.itemsLocations = itemData.locations;

    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop.bind(this),
    };

    this.locationsDictionary = {};
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
  }

  parseMapData() {
    this.levelData = levelData;
    this.levelData.layers.forEach(({ name, objects }) => {
      //this.locationsDictionary[name](objects);
    });
  }

  setupEventListeners() {
    this.io.on("connection", (socket) => {
      // player disconnected

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

      socket.on("currents", () => {
        // send the players object to the new player
        socket.emit("currentPlayers", this.players);

        // send the monsters object to the new player
        socket.emit("currentMonsters", this.monsterController.getMonsterList());

        // send the chests object to the new player
        socket.emit("currentChests", this.chests);

        // send the items object to the new player
        socket.emit("currentItems", this.items);

        // send the npcs object to the new player
        socket.emit("currentNpcs", this.npcs);
      });

      socket.on("dropItem", (x, y, item) => {
        this.itemDictionary[item](x, y);
      });

      //-------------------MONSTER---------------
      this.monsterController.setupEventListeners(socket, this.players);

      // player connected to our game
      console.log("player connected to our game");
    });
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


}
