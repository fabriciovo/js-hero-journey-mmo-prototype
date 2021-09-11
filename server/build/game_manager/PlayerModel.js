"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var PlayerModel = /*#__PURE__*/function () {
  function PlayerModel(playerId, spawnLocations, players, name, frame) {
    (0, _classCallCheck2["default"])(this, PlayerModel);
    this.health = 10;
    this.maxHealth = 10;
    this.gold = 0;
    this.id = playerId;
    this.spawnLocations = spawnLocations;
    this.playerAttacking = false;
    this.flipX = true;
    var location = this.generateLocation(players);
    this.x = location[0];
    this.y = location[1];
    this.playerName = name;
    this.frame = frame;
  }

  (0, _createClass2["default"])(PlayerModel, [{
    key: "updateGold",
    value: function updateGold(gold) {
      this.gold += gold;
    }
  }, {
    key: "updateHealth",
    value: function updateHealth(health) {
      this.health += health;
      if (this.health > 10) this.health = 10;
    }
  }, {
    key: "respawn",
    value: function respawn(players) {
      this.health = this.maxHealth;
      var location = this.generateLocation(players);
      this.x = location[0];
      this.y = location[1];
    }
  }, {
    key: "generateLocation",
    value: function generateLocation(players) {
      var location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
      var invalidLocation = Object.keys(players).some(function (key) {
        if (players[key].x === location[0] && players[key].y === location[1]) {
          return true;
        } else {
          return false;
        }
      });

      if (invalidLocation) {
        return this.generateLocation(players);
      } else {
        return location;
      }
    }
  }]);
  return PlayerModel;
}();

exports["default"] = PlayerModel;
//# sourceMappingURL=PlayerModel.js.map