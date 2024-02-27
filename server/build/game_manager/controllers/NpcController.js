"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _UserModel = _interopRequireDefault(require("../../models/UserModel"));
var _PlayerModel = _interopRequireDefault(require("../../models/PlayerModel"));
var AttackController = exports["default"] = /*#__PURE__*/function () {
  function AttackController(io) {
    (0, _classCallCheck2["default"])(this, AttackController);
    this.npcs = {};
    this.npcsLocations = [];
    this.io = io;
  }
  (0, _createClass2["default"])(AttackController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {}
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
  return AttackController;
}();
//# sourceMappingURL=NpcController.js.map