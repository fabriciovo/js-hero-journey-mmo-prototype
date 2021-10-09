"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("../utils");

var _ChestModel = _interopRequireDefault(require("../../models/ChestModel"));

var _MonsterModel = _interopRequireDefault(require("../../models/MonsterModel"));

var _ItemModel = _interopRequireDefault(require("../../models/ItemModel"));

var itemData = _interopRequireWildcard(require("../../../public/assets/level/tools.json"));

var enemyData = _interopRequireWildcard(require("../../../public/assets/Enemies/enemies.json"));

var _NpcModel = _interopRequireDefault(require("../../models/NpcModel"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getRandonValues() {
  var bonus = [-3, -5, -6, 0, 5, 3, 4, 7, 2, 1, 8, 10, 11, 23, 12, 13, 14, 15, 16, 9];
  return bonus[Math.floor(Math.random() * bonus.length)];
}

var Spawner = /*#__PURE__*/function () {
  function Spawner(config, spawnLocations, addObject, deleteObject, moveObjects) {
    (0, _classCallCheck2["default"])(this, Spawner);
    this.id = config.id;
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType;
    this.spawnLocations = spawnLocations;
    this.addObject = addObject;
    this.deleteObject = deleteObject;
    this.moveObjects = moveObjects;
    this.objectsCreated = [];
    this.start();
  }

  (0, _createClass2["default"])(Spawner, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.interval = setInterval(function () {
        if (_this.objectsCreated.length < _this.limit) {
          _this.spawnObject();
        }
      }, this.spawnInterval);
      if (this.objectType === _utils.SpawnerType.MONSTER) this.moveMonsters();
    }
  }, {
    key: "spawnObject",
    value: function spawnObject() {
      if (this.objectType === _utils.SpawnerType.CHEST) {
        this.spawnChest();
      } else if (this.objectType === _utils.SpawnerType.MONSTER) {
        this.spawnMonster();
      } else if (this.objectType === _utils.SpawnerType.ITEM) {
        this.spawnItem();
      } else if (this.objectType === _utils.SpawnerType.NPC) {
        this.spawnNpc();
      }
    }
  }, {
    key: "spawnItem",
    value: function spawnItem() {
      var location = this.pickRandomLocation();
      var randomItem = itemData.items[Math.floor(Math.random() * itemData.items.length)];
      var item = new _ItemModel["default"](location[0], location[1], this.id, randomItem.name, randomItem.frame, getRandonValues(), getRandonValues(), getRandonValues(), _utils.WeaponTypes.MELEE, "Description");
      this.objectsCreated.push(item);
      this.addObject(item.id, item);
    }
  }, {
    key: "spawnChest",
    value: function spawnChest() {
      var location = this.pickRandomLocation();
      var chest = new _ChestModel["default"](location[0], location[1], (0, _utils.randomNumber)(10, 20), this.id);
      this.objectsCreated.push(chest);
      this.addObject(chest.id, chest);
    }
  }, {
    key: "spawnMonster",
    value: function spawnMonster() {
      var randomEnemy = enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];
      var location = this.pickRandomLocation();
      var monster = new _MonsterModel["default"](location[0], location[1], randomEnemy.goldValue, // gold value
      this.id, randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue // exp value
      );
      this.objectsCreated.push(monster);
      this.addObject(monster.id, monster);
    }
  }, {
    key: "spawnNpc",
    value: function spawnNpc() {
      var location = this.pickRandomLocation();
      var npc = new _NpcModel["default"](location[0], location[1], this.id);
      this.objectsCreated.push(npc);
      this.addObject(npc.id, npc);
    }
  }, {
    key: "pickRandomLocation",
    value: function pickRandomLocation() {
      var location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
      var invalidLocation = this.objectsCreated.some(function (obj) {
        if (obj.x === location[0] && obj.y === location[1]) {
          return true;
        }

        return false;
      });
      if (invalidLocation) return this.pickRandomLocation();
      return location;
    }
  }, {
    key: "removeObject",
    value: function removeObject(id) {
      this.objectsCreated = this.objectsCreated.filter(function (obj) {
        return obj.id !== id;
      });
      this.deleteObject(id);
    }
  }, {
    key: "moveMonsters",
    value: function moveMonsters() {
      var _this2 = this;

      this.moveMonsterInterval = setInterval(function () {
        _this2.objectsCreated.forEach(function (monster) {
          monster.move();
        });

        _this2.moveObjects();
      }, 1000);
    }
  }]);
  return Spawner;
}();

exports["default"] = Spawner;
//# sourceMappingURL=Spawner.js.map