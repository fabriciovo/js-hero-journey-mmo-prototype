"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _uuid = require("uuid");
var NpcController = exports["default"] = /*#__PURE__*/function () {
  function NpcController(io, npcsLocations) {
    (0, _classCallCheck2["default"])(this, NpcController);
    this.npcs = {};
    this.npcsLocations = npcsLocations;
    this.io = io;
    this.spawnNpc();
  }
  return (0, _createClass2["default"])(NpcController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {}
  }, {
    key: "spawnNpc",
    value: function spawnNpc() {
      var location = this.npcsLocations[0];
      var npc = {
        x: location[0],
        y: location[1],
        id: "npc-".concat((0, _uuid.v4)())
      };
      this.addNpc(npc.id, npc);
    }
  }, {
    key: "addNpc",
    value: function addNpc(npcId, npc) {
      this.npcs[npcId] = npc;
      this.io.emit("npcSpawned", npc);
    }
  }, {
    key: "deleteNpc",
    value: function deleteNpc(npcId) {
      delete this.npcs[npcId];
      this.io.emit("npcRemoved", npcId);
    }
  }]);
}();
//# sourceMappingURL=NpcController.js.map