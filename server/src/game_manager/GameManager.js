import jwt from "jsonwebtoken";

import ChatModel from "../models/ChatModel";

import * as levelData from "../../public/assets/level/new_level.json";

import MonsterController from "./controllers/MonsterController";
import PlayerController from "./controllers/PlayerController";
import ItemController from "./controllers/ItemController";
import NpcController from "./controllers/NpcController";

export default class GameManager {
  constructor(io) {
    this.io = io;

    this.monsterController = new MonsterController(this.io);
    this.playerController = new PlayerController(this.io);
    this.itemController = new ItemController(this.io);
    this.npcController = new NpcController(this.io);

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


      socket.on("sendMessage", async (message, token, player) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { email } = decoded.user;
          await ChatModel.create({ email, message });
          this.io.emit("newMessage", {
            message,
            name: player.playerName,
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("currents", () => {
        console.log("currents")
        socket.emit("currentPlayers", this.playerController.players);
        socket.emit("currentMonsters", this.monsterController.monsters);
        socket.emit("currentChests", this.itemController.chests);
        socket.emit("currentItems", this.itemController.items);
      });

      // player connected to our game
      console.log("player connected to our game");
    });
  }
}
