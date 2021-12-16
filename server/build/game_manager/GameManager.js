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

var itemData = _interopRequireWildcard(require("../../public/assets/level/tools.json"));

var enemyData = _interopRequireWildcard(require("../../public/assets/Enemies/enemies.json"));

var _utils = require("./utils");

var _ItemModel = _interopRequireDefault(require("../models/ItemModel"));

var _ChestModel = _interopRequireDefault(require("../models/ChestModel"));

var _uuid = require("uuid");

var _MonsterController = _interopRequireDefault(require("./controllers/MonsterController"));

var _PlayerController = _interopRequireDefault(require("./controllers/PlayerController"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var GameManager = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.items = {};
    this.npcs = {};
    this.monsterController = new _MonsterController["default"](this.io);
    this.playerController = new _PlayerController["default"](this.io);
    this.rangedObjects = {};
    this.chestLocations = {};
    this.npcLocations = {};
    this.itemsLocations = itemData.locations;
    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop.bind(this)
    };
    this.locationsDictionary = {};
  }

  (0, _createClass2["default"])(GameManager, [{
    key: "setup",
    value: function setup() {
      this.parseMapData();
      this.setupEventListeners();
    }
  }, {
    key: "parseMapData",
    value: function parseMapData() {
      this.levelData = levelData;
      this.levelData.layers.forEach(function (_ref) {//this.locationsDictionary[name](objects);

        var name = _ref.name,
            objects = _ref.objects;
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;

      this.io.on("connection", function (socket) {
        // player disconnected
        socket.on("sendMessage", /*#__PURE__*/function () {
          var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token) {
            var decoded, email;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
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
                    _this.io.emit("newMessage", {
                      message: message,
                      name: _this.players[socket.id].playerName,
                      frame: _this.players[socket.id].frame
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

          return function (_x, _x2) {
            return _ref2.apply(this, arguments);
          };
        }());
        socket.on("currents", function () {
          // send the players object to the new player
          socket.emit("currentPlayers", _this.playerController.getPlayerList()); // send the monsters object to the new player

          socket.emit("currentMonsters", _this.monsterController.getMonsterList()); // send the chests object to the new player

          socket.emit("currentChests", _this.chests); // send the items object to the new player

          socket.emit("currentItems", _this.items); // send the npcs object to the new player

          socket.emit("currentNpcs", _this.npcs);
        });
        socket.on("dropItem", function (x, y, item) {
          _this.itemDictionary[item](x, y);
        }); //-------------------MONSTER---------------

        _this.monsterController.setupEventListeners(socket);

        _this.playerController.setupEventListeners(socket); // player connected to our game


        console.log("player connected to our game");
      });
    }
  }, {
    key: "addItems",
    value: function addItems(itemId, item) {
      this.items[itemId] = item;
      this.io.emit("itemSpawned", item);
    }
  }, {
    key: "deleteItems",
    value: function deleteItems(itemId) {
      delete this.items[itemId];
      this.io.emit("itemRemoved", itemId);
    }
  }, {
    key: "addChest",
    value: function addChest(chestId, chest) {
      this.chests[chestId] = chest;
      this.io.emit("chestSpawned", chest);
    }
  }, {
    key: "deleteChest",
    value: function deleteChest(chestId) {
      delete this.chests[chestId];
      this.io.emit("chestRemoved", chestId);
    }
  }, {
    key: "addNpc",
    value: function addNpc(npcId, npc) {
      this.npcs[npcId] = npc;
      this.io.emit("npcSpawned", npc);
    }
  }, {
    key: "deleteNpc",
    value: function deleteNpc(npcId) {
      delete this.npcs[npcId];
      this.io.emit("npcRemoved", npcId);
    }
  }, {
    key: "drop",
    value: function drop(x, y) {}
  }, {
    key: "createChest",
    value: function createChest(x, y) {
      var chest = new _ChestModel["default"](x, y, (0, _utils.randomNumber)(10, 20), "chest-".concat((0, _uuid.v4)()));
      this.addChest(chest.id, chest);
    }
  }, {
    key: "createItem",
    value: function createItem(x, y) {
      var randomItem = itemData.items[Math.floor(Math.random() * itemData.items.length)];
      var item = new _ItemModel["default"](x, y, "item-".concat((0, _uuid.v4)()), randomItem.name, randomItem.frame, (0, _utils.getRandonValues)(), (0, _utils.getRandonValues)(), (0, _utils.getRandonValues)(), _utils.WeaponTypes.MELEE, "Description");
      this.addItems(item.id, item);
    }
  }]);
  return GameManager;
}();

exports["default"] = GameManager;
//# sourceMappingURL=GameManager.js.map