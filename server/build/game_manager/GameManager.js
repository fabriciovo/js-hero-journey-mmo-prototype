"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _ChatModel = _interopRequireDefault(require("../models/ChatModel"));
var levelData = _interopRequireWildcard(require("../../public/assets/level/new_level.json"));
var _MonsterController = _interopRequireDefault(require("./controllers/MonsterController"));
var _PlayerController = _interopRequireDefault(require("./controllers/PlayerController"));
var _ItemController = _interopRequireDefault(require("./controllers/ItemController"));
var _NpcController = _interopRequireDefault(require("./controllers/NpcController"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var GameManager = exports["default"] = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.monsterController = undefined;
    this.playerController = undefined;
    this.itemController = undefined;
    this.npcController = undefined;
    this.levelData = levelData;
    this.playerLocations = [[200, 200]];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.npcLocations = [];
  }
  return (0, _createClass2["default"])(GameManager, [{
    key: "setup",
    value: function setup() {
      this.parseMapData();
      this.setupControllers();
      this.setupEventListeners();
    }
  }, {
    key: "setupControllers",
    value: function setupControllers() {
      this.monsterController = new _MonsterController["default"](this.io, this.monsterLocations);
      this.playerController = new _PlayerController["default"](this.io, this.playerLocations);
      this.itemController = new _ItemController["default"](this.io);
      this.npcController = new _NpcController["default"](this.io, this.npcLocations);
    }
  }, {
    key: "parseMapData",
    value: function parseMapData() {
      var _this = this;
      this.levelData = levelData;
      this.levelData.layers.forEach(function (layer) {
        if (layer.name === "player_locations") {
          layer.objects.forEach(function (obj) {
            _this.playerLocations.push([obj.x, obj.y]);
          });
        } else if (layer.name === "monster_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.monsterLocations[obj.properties.spawner]) {
              _this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
            } else {
              _this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
            }
          });
        } else if (layer.name === "chest_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.chestLocations[obj.properties.spawner]) {
              _this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
            } else {
              _this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
            }
          });
        } else if (layer.name === "npc_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.npcLocations[obj.properties.spawner]) {
              _this.npcLocations.push([obj.x, obj.y]);
            } else {
              _this.npcLocations.push([obj.x, obj.y]);
            }
          });
        }
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      this.io.on("connection", function (socket) {
        socket.on("connect_error", function (err) {
          console.log("connect_error due to ".concat(err.message));
        });
        _this2.monsterController.setupEventListeners(socket);
        _this2.itemController.setupEventListeners(socket);
        _this2.npcController.setupEventListeners(socket);
        _this2.playerController.setupEventListeners(socket);
        socket.on("sendMessage", /*#__PURE__*/function () {
          var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token, player) {
            var decoded, email;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                  email = decoded.user.email;
                  _context.next = 5;
                  return _ChatModel["default"].create({
                    email: email,
                    message: message
                  });
                case 5:
                  _this2.io.emit("newMessage", {
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
            }, _callee, null, [[0, 8]]);
          }));
          return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
          };
        }());
        socket.on("currents", function () {
          socket.emit("currentPlayers", _this2.playerController.players);
          socket.emit("currentMonsters", _this2.monsterController.monsters);
          socket.emit("currentChests", _this2.itemController.chests);
          socket.emit("currentItems", _this2.itemController.items);
          socket.emit("currentNpcs", _this2.npcController.npcs);
        });

        // player connected to our game
        console.log("player connected to our game");
      });
    }
  }]);
}();
//# sourceMappingURL=GameManager.js.map