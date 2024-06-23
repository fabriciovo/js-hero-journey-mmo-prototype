"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var CurrentController = exports["default"] = /*#__PURE__*/function () {
  function CurrentController(io) {
    (0, _classCallCheck2["default"])(this, CurrentController);
    this.io = io;
    this.instanceId = "instance-0";
  }
  return (0, _createClass2["default"])(CurrentController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {}
  }, {
    key: "_addNewZone",
    value: function _addNewZone() {}
  }, {
    key: "_currentZones",
    value: function _currentZones() {}
  }, {
    key: "_changeZone",
    value: function _changeZone() {}
  }]);
}();
//# sourceMappingURL=currentController.js.map