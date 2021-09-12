"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _uuid = require("uuid");

/**
 * @class
 */
var ChestModel = function ChestModel(x, y, spawnerId, name, frame, attackValue, defenseValue, healthValue) {
  (0, _classCallCheck2["default"])(this, ChestModel);
  this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
  this.spawnerId = spawnerId;
  this.x = x;
  this.y = y;
  this.name = name;
  this.frame = frame;
  this.attackBonus = attackValue;
  this.defenseBonus = defenseValue;
  this.healthBonus = healthValue;
};

exports["default"] = ChestModel;
//# sourceMappingURL=ItemModel.js.map