import { v4 } from "uuid";

export default class NpcController {
  constructor(io, npcsLocations) {
    this.npcs = {};
    this.npcsLocations = npcsLocations;
    this.io = io;

    this.spawnNpc();
  }

  setupEventListeners(socket) {}

  spawnNpc() {
    const location = this.npcsLocations[0];
    const npc = {
      x: location[0],
      y: location[1],
      id: `npc-${v4()}`,
    };
    this.addNpc(npc.id, npc);
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
