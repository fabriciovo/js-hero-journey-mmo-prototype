import jwt from "jsonwebtoken";

import UserModel from "../../models/UserModel";
import PlayerModel from "../../models/PlayerModel";
export default class AttackController {
  constructor(io) {
    this.npcs = {};
    this.npcsLocations = [];
    this.io = io;
  }


  setupEventListeners(socket) {

  }
  
  addNpc(npcId, npc) {
    this.npcs[npcId] = npc;
    this.io.emit("npcSpawned", npc);
  }

  deleteNpc(npcId) {
    delete this.npcs[npcId];
    this.io.emit("npcRemoved", npcId);
  }
}
