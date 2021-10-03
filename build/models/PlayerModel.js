"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var PlayerModel = /*#__PURE__*/function () {
  function PlayerModel(playerId, spawnLocations, players, name, key, playerSchema) {
    (0, _classCallCheck2["default"])(this, PlayerModel);
    this.attack = playerSchema.attack;
    this.defense = playerSchema.defense;
    this.health = playerSchema.health;
    this.maxHealth = playerSchema.maxHealth;
    this.gold = playerSchema.gold;
    this.id = playerId;
    this.playerName = name;
    this.key = key;
    this.items = playerSchema.items || {};
    this.equipedItems = playerSchema.equipedItems || {};
    this.level = playerSchema.level;
    this.exp = playerSchema.exp;
    this.maxExp = playerSchema.maxExp;
    this.potions = playerSchema.potions; //this.playerItems =  {};

    this.maxNumberOfItems = 5;
    this.spawnLocations = spawnLocations;
    this.actionAActive = false;
    this.flipX = true;
    var location = this.generateLocation(players);
    this.x = location[0];
    this.y = location[1];
  }

  (0, _createClass2["default"])(PlayerModel, [{
    key: "addItem",
    value: function addItem(item) {
      this.items[item.id] = item;
    }
  }, {
    key: "equipItem",
    value: function equipItem(item) {
      this.equipedItems[item.id] = item;
      this.attack += this.equipedItems[item.id].attackBonus;
      this.defense += this.equipedItems[item.id].defenseBonus;
      this.maxHealth += this.equipedItems[item.id].healthBonus;
      this.removeItem(item.id);
    }
  }, {
    key: "removeEquipedItem",
    value: function removeEquipedItem(itemId) {
      this.attack -= this.equipedItems[itemId].attackBonus;
      this.defense -= this.equipedItems[itemId].defenseBonus;
      this.maxHealth -= this.equipedItems[itemId].healthBonus;
      delete this.equipedItems[itemId];
    }
  }, {
    key: "removeItem",
    value: function removeItem(itemId) {
      // this.attack -= this.items[itemId].attackBonus;
      // this.defense -= this.items[itemId].defenseBonus;
      // this.maxHealth -= this.items[itemId].healthBonus;
      delete this.items[itemId];
    }
  }, {
    key: "canPickupItem",
    value: function canPickupItem() {
      if (Object.keys(this.items).length < 5) {
        return true;
      }

      return false;
    }
  }, {
    key: "canEquipItem",
    value: function canEquipItem() {
      if (Object.keys(this.equipedItems).length < 5) {
        return true;
      }

      return false;
    }
  }, {
    key: "playerAttacked",
    value: function playerAttacked(attack) {
      var damage = this.defense - attack;
      if (damage > 0) damage = 0;
      this.updateHealth(damage);
    }
  }, {
    key: "updateGold",
    value: function updateGold(gold) {
      this.gold += gold;
    }
  }, {
    key: "potion",
    value: function potion(health) {
      this.updateHealth(health);
      this.potions--;
    }
  }, {
    key: "updateExp",
    value: function updateExp(exp) {
      this.exp += exp;
    }
  }, {
    key: "levelUp",
    value: function levelUp() {
      this.attack += 3;
      this.defense += 2;
      this.maxHealth += 1;
      this.level++;
      var calcNewExp = this.exp - this.maxExp;
      this.exp = calcNewExp;
      this.maxExp = this.maxExp * 2;
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