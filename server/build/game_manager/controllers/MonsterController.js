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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var MonsterController = exports["default"] = /*#__PURE__*/function () {
  function MonsterController(io) {
    (0, _classCallCheck2["default"])(this, MonsterController);
    this.monsters = {};
    this.monsterLocations = [];
    this.io = io;
    this.setupSpawn();
    this.init();
  }
  return (0, _createClass2["default"])(MonsterController, [{
    key: "init",
    value: function init() {
      this.update();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      var _this = this;
      return socket.on("monsterHit", function (monsterId, playerAttack, playerId) {
        if (!_this.monsters[monsterId]) return;
        var monster = _this.monsters[monsterId];
        var exp = monster.exp;
        var playerAttackValue = playerAttack;
        monster.loseHealth(playerAttackValue);
        if (monster.health <= 0) {
          socket.emit("playerUpdateXp", playerId, exp);
          _this.deleteMonster(monster.id);
        } else {
          socket.emit("updateMonsterHealth", monsterId, monster.health);
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
      }, 3000);
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
      console.log("spawnMonster");
      var location = this.pickRandomLocation();
      var monster = new _MonsterModel["default"](location[0], location[1], randomEnemy.goldValue, // gold value
      "monster-".concat((0, _uuid.v4)()), randomEnemy.key,
      // key
      randomEnemy.healthValue,
      // health value
      randomEnemy.attackValue,
      // attack value
      randomEnemy.expValue,
      // exp value
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
}();
//# sourceMappingURL=MonsterController.js.map