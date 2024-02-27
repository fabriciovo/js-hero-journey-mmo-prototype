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
var MonsterModel = exports["default"] = /*#__PURE__*/function () {
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
    this.targetPos = {
      x: 0,
      y: 0
    };
  }
  (0, _createClass2["default"])(MonsterModel, [{
    key: "setTarget",
    value: function setTarget(target) {
      this.targetPos = {
        x: target.x,
        y: target.y
      };
    }
  }, {
    key: "move",
    value: function move() {
      var randomPosition = (0, _utils.randomNumber)(1, 9);
      var distance = 64;
      switch (randomPosition) {
        case 1:
          this.setTarget({
            x: this.x += distance,
            y: this.y
          });
          break;
        case 2:
          this.setTarget({
            x: this.x -= distance,
            y: this.y
          });
          break;
        case 3:
          this.setTarget({
            x: this.x,
            y: this.y += distance
          });
          break;
        case 4:
          this.setTarget({
            x: this.x,
            y: this.y -= distance
          });
          break;
        case 5:
          this.setTarget({
            x: this.x += distance,
            y: this.y += distance
          });
          break;
        case 6:
          this.setTarget({
            x: this.x += distance,
            y: this.y -= distance
          });
          break;
        case 7:
          this.setTarget({
            x: this.x -= distance,
            y: this.y += distance
          });
          break;
        case 8:
          this.setTarget({
            x: this.x -= distance,
            y: this.y -= distance
          });
          break;
        case 9:
          this.setTarget({
            x: this.x,
            y: this.y
          });
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
  }, {
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }]);
  return MonsterModel;
}();
//# sourceMappingURL=MonsterModel.js.map