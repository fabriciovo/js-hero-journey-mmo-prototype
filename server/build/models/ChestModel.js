"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _uuid = require("uuid");
var ChestModel = exports["default"] = /*#__PURE__*/(0, _createClass2["default"])(function ChestModel(x, y, gold, spawnerId) {
  (0, _classCallCheck2["default"])(this, ChestModel);
  this.id = "".concat(spawnerId, "-").concat((0, _uuid.v4)());
  this.spawnerId = spawnerId;
  this.x = x;
  this.y = y;
  this.gold = gold;
});
//# sourceMappingURL=ChestModel.js.map