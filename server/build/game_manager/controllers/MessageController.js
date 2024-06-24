"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _ChatModel = _interopRequireDefault(require("../../models/ChatModel.js"));
var MessageController = exports["default"] = /*#__PURE__*/function () {
  function MessageController(io) {
    (0, _classCallCheck2["default"])(this, MessageController);
    this.io = io;
  }
  return (0, _createClass2["default"])(MessageController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      this._sendMessage(socket);
    }
  }, {
    key: "_sendMessage",
    value: function _sendMessage(socket) {
      var _this = this;
      socket.on("sendMessage", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token) {
          var decoded, _decoded$user, email, name;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                _decoded$user = decoded.user, email = _decoded$user.email, name = _decoded$user.name;
                _context.next = 5;
                return _ChatModel["default"].create({
                  email: email,
                  message: message
                });
              case 5:
                _this.io.emit("newMessage", {
                  message: message,
                  name: name
                });
                _context.next = 11;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
              case 11:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 8]]);
        }));
        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
}();
//# sourceMappingURL=MessageController.js.map