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

var MessageController = /*#__PURE__*/function () {
  function MessageController(io) {
    (0, _classCallCheck2["default"])(this, MessageController);
    this.io = io;
  }

  (0, _createClass2["default"])(MessageController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      this._sendMessage(socket);
    }
  }, {
    key: "_sendMessage",
    value: function _sendMessage(socket) {
      var _this = this;

      socket.on("sendMessage", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token, player) {
          var decoded, email;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
                  email = decoded.user.email;
                  _context.next = 5;
                  return ChatModel.create({
                    email: email,
                    message: message
                  });

                case 5:
                  _this.io.emit("newMessage", {
                    message: message,
                    name: player.playerName
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
            }
          }, _callee, null, [[0, 8]]);
        }));

        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
  return MessageController;
}();

exports["default"] = MessageController;
//# sourceMappingURL=MessageController.js.map