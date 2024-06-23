import * as levelData from "../../public/assets/level/new_level.json";

import MonsterController from "./controllers/MonsterController";
import PlayerController from "./controllers/PlayerController";
import ItemController from "./controllers/ItemController";
import NpcController from "./controllers/NpcController";
import MessageController from "./controllers/MessageController";

export default class GameManager {
  constructor(io) {
    this.io = io;

    this.monsterController = undefined;
    this.playerController = undefined;
    this.itemController = undefined;
    this.npcController = undefined;
    this.messageController = undefined;

    this.levelData = levelData;

    this.playerLocations = [[200, 200]];
    this.chestLocations = {};
    this.monsterLocations = [];
    this.npcLocations = [];
  }

  setup() {
    this.parseMapData();
    this.setupControllers();
    this.setupEventListeners();
  }

  setupControllers() {
    this.monsterController = new MonsterController(
      this.io,
      this.monsterLocations
    );
    this.playerController = new PlayerController(this.io, this.playerLocations);
    this.itemController = new ItemController(this.io);
    this.npcController = new NpcController(this.io, this.npcLocations);
    this.messageController = new MessageController(this.io);
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
          this.monsterLocations.push([obj.x, obj.y]);
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
            this.npcLocations.push([obj.x, obj.y]);
          } else {
            this.npcLocations.push([obj.x, obj.y]);
          }
        });
      }
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

      socket.on("currents", () => {
        socket.emit("currentPlayers", this.playerController.players);
        socket.emit("currentMonsters", this.monsterController.monsters);
        socket.emit("currentChests", this.itemController.chests);
        socket.emit("currentItems", this.itemController.items);
        socket.emit("currentNpcs", this.npcController.npcs);
      });

      // player connected to our game
      console.log("player connected to our game");
    });
  }
}
