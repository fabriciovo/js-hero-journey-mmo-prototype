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
    this.attack = 25;
    this.defense = 10;
    this.health = 150;
    this.maxHealth = 150;
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
    this.playerItems = {};
    this.maxNumberOfItems = 5;
  }

  (0, _createClass2["default"])(PlayerModel, [{
    key: "addItem",
    value: function addItem(item) {
      this.playerItems[item.id] = item;
      this.attack += item.attackBonus;
      this.defense += item.defenseBonus;
      this.maxHealth += item.healthBonus;
    }
  }, {
    key: "removeItem",
    value: function removeItem(itemId) {
      this.attack -= this.playerItems[itemId].attackBonus;
      this.defense -= this.playerItems[itemId].defenseBonus;
      this.maxHealth -= this.playerItems[itemId].healthBonus;
      delete this.playerItems[itemId];
    }
  }, {
    key: "canPickupItem",
    value: function canPickupItem() {
      if (Object.keys(this.playerItems).length < 5) {
        return true;
      }

      return false;
    }
  }, {
    key: "playerAttacked",
    value: function playerAttacked(attack) {
      var damage = this.defense - attack;
      console.log(damage);
      this.updateHealth(damage);
    }
  }, {
    key: "updateGold",
    value: function updateGold(gold) {
      this.gold += gold;
    }
  }, {
    key: "updateHealth",
    value: function updateHealth(health) {
      this.health += health;
      if (this.health > this.maxHealth) this.health = this.maxHealth;
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