"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _MonsterModel = _interopRequireDefault(require("../../models/MonsterModel"));

var enemyData = _interopRequireWildcard(require("../../../public/assets/Enemies/enemies.json"));

var _uuid = require("uuid");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MonsterController = /*#__PURE__*/function () {
  function MonsterController(io) {
    (0, _classCallCheck2["default"])(this, MonsterController);
    this.monsters = {};
    this.monsterLocations = [];
    this.io = io;
    this.setupSpawn();
    this.init();
  }

  (0, _createClass2["default"])(MonsterController, [{
    key: "init",
    value: function init() {
      this.update();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners(socket, playerList) {
      var _this = this;

      socket.on("monsterAttacked", function (monsterId) {
        // update the spawner
        if (_this.monsters[monsterId]) {
          var monster = _this.monsters[monsterId];
          var exp = monster.exp;
          var playerAttackValue = playerList[socket.id].attack; // subtract health monster model

          monster.loseHealth(playerAttackValue); // check the monsters health, and if dead remove that object

          if (monster.health <= 0) {
            //update xp
            playerList[socket.id].updateExp(exp);

            _this.io.emit("updateXp", exp, socket.id);

            _this.deleteMonster(monster.id);
          } else {
            // update the monsters health
            _this.io.emit("updateMonsterHealth", monsterId, monster.health);
          }
        }
      });
      socket.on("monsterAttack", function (monsterId, playerId) {
        if (!_this.monsters[monsterId]) return;
        var attack = _this.monsters[monsterId].attack; // update the players health

        playerList[playerId].playerAttacked(attack);

        _this.io.emit("updatePlayerHealth", playerId, playerList[playerId].health); // check the player's health, if below 0 have the player respawn


        if (playerList[playerId].health <= 0) {
          // update the gold the player has
          playerList[playerId].updateGold(parseInt(-playerList[playerId].gold / 2, 10));
          playerList[playerId].updateExp(parseInt(-playerList[playerId].exp / 2, 10));
          socket.emit("updateScore", playerList[playerId].gold); // respawn the player

          playerList[playerId].respawn(playerList);

          _this.io.emit("respawnPlayer", playerList[playerId]);
        }
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      setInterval(function () {
        Object.keys(_this2.monsters).forEach(function (id) {
          if (!_this2.monsters[id]) return;

          _this2._movement(_this2.monsters[id]);
        });
      }, 1000);
    }
  }, {
    key: "setupSpawn",
    value: function setupSpawn() {
      var _this3 = this;

      setInterval(function () {
        if (Object.keys(_this3.monsters).length <= 8) {
          _this3.spawnMonster();
        }
      }, 8000);
    }
  }, {
    key: "pickRandomLocation",
    value: function pickRandomLocation() {
      var location = this.monsterLocations[Math.floor(Math.random() * this.monsterLocations.length)];

      if (this.monsters.length > 0) {
        var invalidLocation = this.monsters.some(function (obj) {
          if (obj.x === location[0] && obj.y === location[1]) {
            return true;
          }

          return false;
        });
        if (invalidLocation) return this.pickRandomLocation();
        return location || [200, 200];
      }

      return location || [200, 200];
    }
  }, {
    key: "spawnMonster",
    value: function spawnMonster() {
      var randomEnemy = enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];
      var location = this.pickRandomLocation();
      var monster = new _MonsterModel["default"](location[0], location[1], randomEnemy.goldValue, // gold value
      "monster-".concat((0, _uuid.v4)()), randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue, // exp value
      3000 //timer
      );
      this.addMonster(monster.id, monster);
    }
  }, {
    key: "addMonster",
    value: function addMonster(monsterId, monster) {
      this.monsters[monsterId] = monster;
      this.io.emit("monsterSpawned", monster);
    }
  }, {
    key: "deleteMonster",
    value: function deleteMonster(monsterId) {
      delete this.monsters[monsterId];
      this.io.emit("monsterRemoved", monsterId);
    }
  }, {
    key: "addLocation",
    value: function addLocation(x, y) {
      this.monsterLocations.push([x, y]);
    }
  }, {
    key: "getMonsterList",
    value: function getMonsterList() {
      return this.monsters;
    }
  }, {
    key: "getMonster",
    value: function getMonster(monsterId) {
      return this.monsters[monsterId];
    }
  }, {
    key: "getMonsterLocationList",
    value: function getMonsterLocationList() {
      return this.monsterLocations;
    }
  }, {
    key: "_movement",
    value: function _movement(monster) {
      monster.move();
      this.io.emit("monsterMovement", monster);
    }
  }]);
  return MonsterController;
}();

exports["default"] = MonsterController;
//# sourceMappingURL=MonsterController.js.map