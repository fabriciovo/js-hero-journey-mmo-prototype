"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _uuid = require("uuid");

var _utils = require("../game_manager/utils");

var MonsterModel = /*#__PURE__*/function () {
  function MonsterModel(x, y, gold, spawnerId, key, health, attack, exp, stateTime) {
    (0, _classCallCheck2["default"])(this, MonsterModel);
    this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
    this.spawnerId = spawnerId;
    this.x = x * 2;
    this.y = y * 2;
    this.gold = gold;
    this.key = key;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
    this.exp = exp;
    this.stateTime = stateTime;
    this.randomPosition = (0, _utils.randomNumber)(1, 8);
    this.targetPosition = {
      x: 0,
      y: 0
    };
    console.log("monstrocriado");
  }

  (0, _createClass2["default"])(MonsterModel, [{
    key: "setTargetPos",
    value: function setTargetPos(position) {
      this.targetPosition = {
        x: position.x,
        y: position.y
      };
    }
  }, {
    key: "move",
    value: function move() {
      var randomPosition = (0, _utils.randomNumber)(1, 8);
      var distance = 64;
      console.log("pokfespokdsfopk");

      switch (randomPosition) {
        case 1:
          this.x += distance;
          break;

        case 2:
          this.x -= distance;
          break;

        case 3:
          this.y += distance;
          break;

        case 4:
          this.y -= distance;
          break;

        case 5:
          this.x += distance;
          this.y += distance;
          break;

        case 6:
          this.x += distance;
          this.y -= distance;
          break;

        case 7:
          this.x -= distance;
          this.y += distance;
          break;

        case 8:
          this.x -= distance;
          this.y -= distance;
          break;

        default:
          break;
      }
    }
  }, {
    key: "loseHealth",
    value: function loseHealth(attack) {
      this.health -= attack;
    }
  }]);
  return MonsterModel;
}();

exports["default"] = MonsterModel;
//# sourceMappingURL=MonsterModel.js.map