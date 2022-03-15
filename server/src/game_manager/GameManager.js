import jwt from "jsonwebtoken";

import ChatModel from "../models/ChatModel";

import * as levelData from "../../public/assets/level/new_level.json";

import MonsterController from "./controllers/MonsterController";
import PlayerController from "./controllers/PlayerController";
import ItemController from "./controllers/ItemController";
import NpcController from "./controllers/NpcController";
import MessageController from "./controllers/MessageController";
import CurrentController from "./controllers/currentController";

export default class GameManager {
  constructor(io) {
    this.io = io;

    this.monsterController = new MonsterController(this.io);
    this.playerController = new PlayerController(this.io);
    this.itemController = new ItemController(this.io);
    this.npcController = new NpcController(this.io);
    this.messageController = new MessageController(this.io);
    this.currentController = new CurrentController(this.io);

    this.instanceId = "instance-0";

    this.rangedObjects = {};

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
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      this.monsterController.setupEventListeners(socket);
      this.itemController.setupEventListeners(socket);
      this.npcController.setupEventListeners(socket);
      this.playerController.setupEventListeners(socket);
      this.messageController.setupEventListeners(socket);
      this.currentController.setupEventListeners(socket);


      socket.emit("currentPlayers", this.playerController.players, this.instanceId);
      socket.emit("currentMonsters", this.monsterController.monsters, this.instanceId);
      socket.emit("currentChests", this.itemController.chests, this.instanceId);
      socket.emit("currentItems", this.itemController.items, this.instanceId);

      // player connected to our game
      console.log("player connected to our game");
    });
  }
}
