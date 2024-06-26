"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _uuid = require("uuid");
/**
 * @class
 */
var ItemModel = exports["default"] = /*#__PURE__*/(0, _createClass2["default"])(function ItemModel(x, y, spawnerId, name, frame, attackValue, defenseValue, healthValue, type, description) {
  (0, _classCallCheck2["default"])(this, ItemModel);
  this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
  this.spawnerId = spawnerId;
  this.x = x;
  this.y = y;
  this.name = name;
  this.frame = frame;
  this.attackBonus = attackValue;
  this.defenseBonus = defenseValue;
  this.healthBonus = healthValue;
  this.type = type;
  this.description = description;
});
//# sourceMappingURL=ItemModel.js.map