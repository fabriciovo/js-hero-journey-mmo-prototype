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

var _PlayerModel = _interopRequireDefault(require("../models/PlayerModel"));

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

var _ChatModel = _interopRequireDefault(require("../models/ChatModel"));

var levelData = _interopRequireWildcard(require("../../public/assets/level/new_level.json"));

var itemData = _interopRequireWildcard(require("../../public/assets/level/tools.json"));

var enemyData = _interopRequireWildcard(require("../../public/assets/Enemies/enemies.json"));

var _Spawner = _interopRequireDefault(require("./controllers/Spawner"));

var _utils = require("./utils");

var _ItemModel = _interopRequireDefault(require("../models/ItemModel"));

var _ChestModel = _interopRequireDefault(require("../models/ChestModel"));

var _uuid = require("uuid");

var _MonsterModel = _interopRequireDefault(require("../models/MonsterModel"));

var _MonsterController = _interopRequireDefault(require("./controllers/MonsterController"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var GameManager = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.players = {};
    this.items = {};
    this.npcs = {};
    this.monsterController = new _MonsterController["default"](this.io);
    this.rangedObjects = {};
    this.playerLocations = [];
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
        socket.on("savePlayerData", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!_this.players[socket.id].items) {
                    _this.players[socket.id].items = null;
                  }

                  if (!_this.players[socket.id].equipedItems) {
                    _this.players[socket.id].equipedItems = null;
                  }

                  _context.next = 5;
                  return _UserModel["default"].updateOne({
                    username: _this.players[socket.id].playerName
                  }, {
                    $set: {
                      player: _this.players[socket.id]
                    }
                  });

                case 5:
                  _context.next = 10;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](0);
                  console.log(_context.t0);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 7]]);
        })));
        socket.on("disconnect", function () {
          // delete user data from server
          console.log("disconnect");
          delete _this.players[socket.id]; // emit a message to all players to remove this player

          _this.io.emit("disconnected", socket.id);
        });
        socket.on("sendMessage", /*#__PURE__*/function () {
          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, token) {
            var decoded, email;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                    email = decoded.user.email;
                    _context2.next = 5;
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

                    _context2.next = 11;
                    break;

                  case 8:
                    _context2.prev = 8;
                    _context2.t0 = _context2["catch"](0);
                    console.log(_context2.t0);

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[0, 8]]);
          }));

          return function (_x, _x2) {
            return _ref3.apply(this, arguments);
          };
        }());
        socket.on("newPlayer", /*#__PURE__*/function () {
          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token, key) {
            var decoded, _decoded$user, name, _id, playerSchema;

            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                    _decoded$user = decoded.user, name = _decoded$user.name, _id = _decoded$user._id;
                    _context3.next = 5;
                    return _UserModel["default"].findById(_id);

                  case 5:
                    playerSchema = _context3.sent;

                    // create a new Player
                    _this.spawnPlayer(socket.id, name, key, playerSchema.player); // send the players object to the new player


                    socket.emit("currentPlayers", _this.players); // send the monsters object to the new player

                    socket.emit("currentMonsters", _this.monsterController.getMonsterList()); // send the chests object to the new player

                    socket.emit("currentChests", _this.chests); // send the items object to the new player

                    socket.emit("currentItems", _this.items); // send the npcs object to the new player

                    socket.emit("currentNpcs", _this.npcs); // inform the other players of the new player that joined

                    socket.broadcast.emit("spawnPlayer", _this.players[socket.id]);
                    socket.emit("updateItems", _this.players[socket.id]);
                    socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]);
                    _context3.next = 21;
                    break;

                  case 17:
                    _context3.prev = 17;
                    _context3.t0 = _context3["catch"](0);
                    console.log(_context3.t0);
                    socket.emit("invalidToken");

                  case 21:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, null, [[0, 17]]);
          }));

          return function (_x3, _x4) {
            return _ref4.apply(this, arguments);
          };
        }());
        socket.on("playerMovement", function (playerData) {
          if (_this.players[socket.id]) {
            _this.players[socket.id].x = playerData.x;
            _this.players[socket.id].y = playerData.y;
            _this.players[socket.id].flipX = playerData.flipX;
            _this.players[socket.id].actionAActive = playerData.actionAActive;
            _this.players[socket.id].potionAActive = playerData.potionAActive;
            _this.players[socket.id].frame = playerData.frame;
            _this.players[socket.id].currentDirection = playerData.currentDirection; // emit a message to all players about the player that moved

            _this.io.emit("playerMoved", _this.players[socket.id]);
          }
        });
        socket.on("pickUpChest", function (chestId) {
          // update the spawner
          if (_this.chests[chestId]) {
            var gold = _this.chests[chestId].gold; // updating the players gold

            _this.players[socket.id].updateGold(gold);

            socket.emit("updateScore", _this.players[socket.id].gold);
            socket.broadcast.emit("updatePlayersScore", socket.id, _this.players[socket.id].gold); // removing the chest

            _this.deleteChest(chestId);
          }
        });
        socket.on("pickUpItem", function (itemId) {
          // update the spawner
          if (_this.items[itemId]) {
            if (_this.players[socket.id].canPickupItem()) {
              _this.players[socket.id].addItem(_this.items[itemId]);

              socket.emit("updateItems", _this.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]); // removing the item

              _this.deleteItems(itemId);
            }
          }
        });
        socket.on("playerDroppedItem", function (itemId) {
          _this.players[socket.id].removeItem(itemId);

          socket.emit("updateItems", _this.players[socket.id]);
          socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]);
        });
        socket.on("playerEquipedItem", function (itemId) {
          if (_this.players[socket.id].items[itemId]) {
            if (_this.players[socket.id].canEquipItem()) {
              _this.players[socket.id].equipItem(_this.players[socket.id].items[itemId]);

              socket.emit("updateItems", _this.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]);
            }
          }
        });
        socket.on("playerUnequipedItem", function (itemId) {
          if (_this.players[socket.id].equipedItems[itemId]) {
            if (_this.players[socket.id].canPickupItem()) {
              _this.players[socket.id].addItem(_this.players[socket.id].equipedItems[itemId]);

              _this.players[socket.id].removeEquipedItem(itemId);

              socket.emit("updateItems", _this.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]);
            }
          }
        });
        socket.on("levelUp", function () {
          _this.players[socket.id].levelUp();

          _this.io.emit("updatePlayerStats", socket.id, _this.players[socket.id].level, _this.players[socket.id].attack, _this.players[socket.id].defense, _this.players[socket.id].maxHealth, _this.players[socket.id].exp, _this.players[socket.id].maxExp);
        });
        socket.on("attackedPlayer", function (attackedPlayerId) {
          if (_this.players[attackedPlayerId]) {
            // get required info from attacked player
            var gold = _this.players[attackedPlayerId].gold;
            var playerAttackValue = _this.players[socket.id].attack; // subtract health from attacked player

            _this.players[attackedPlayerId].playerAttacked(playerAttackValue); // check attacked players health, if dead send gold to other player


            if (_this.players[attackedPlayerId].health <= 0) {
              // get the amount of gold, and update player object
              _this.players[socket.id].updateGold(gold); // respawn attacked player


              _this.players[attackedPlayerId].respawn(_this.players);

              _this.io.emit("respawnPlayer", _this.players[attackedPlayerId]); // send update gold message to player


              socket.emit("updateScore", _this.players[socket.id].gold); // reset the attacked players gold

              _this.players[attackedPlayerId].updateGold(-gold);

              _this.io.to("".concat(attackedPlayerId)).emit("updateScore", _this.players[attackedPlayerId].gold); // add bonus health to the player


              _this.players[socket.id].updateHealth(15);

              _this.io.emit("updatePlayerHealth", socket.id, _this.players[socket.id].health);
            } else {
              _this.io.emit("updatePlayerHealth", attackedPlayerId, _this.players[attackedPlayerId].health);
            }
          }
        });
        socket.on("healthPotion", function (playerId, health) {
          if (socket.id === playerId) {
            _this.players[socket.id];

            _this.players[socket.id].potion(health);

            _this.io.emit("updatePlayerHealth", socket.id, _this.players[socket.id].health);
          }
        });
        socket.on("sendBuyItemMessage", function (item) {
          _this.players[socket.id].potions++;

          _this.players[socket.id].updateGold(-item.price);

          socket.emit("updateScore", _this.players[socket.id].gold);
          socket.broadcast.emit("updatePlayersScore", socket.id, _this.players[socket.id].gold);
        });
        socket.on("dropItem", function (x, y, item) {
          _this.itemDictionary[item](x, y);
        }); //-------------------MONSTER---------------

        _this.monsterController.setupEventListeners(socket, _this.players); // player connected to our game


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
  }, {
    key: "spawnPlayer",
    value: function spawnPlayer(playerId, name, key, playerSchema) {
      var player = new _PlayerModel["default"](playerId, [[200, 200], [400, 400]], this.players, name, key, undefined, playerSchema);
      this.players[playerId] = player;
    }
  }, {
    key: "spawnMonster",
    value: function spawnMonster() {
      var randomEnemy = enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];
      var location = this.pickRandomLocation();
      var monster = new _MonsterModel["default"](location[0], location[1], randomEnemy.goldValue, // gold value
      this.id, randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue, // exp value
      3000 //timer
      );
      this.addMonster(monster.id, monster);
    }
  }]);
  return GameManager;
}();

exports["default"] = GameManager;
//# sourceMappingURL=GameManager.js.map