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

var _UserModel = _interopRequireDefault(require("../../models/UserModel"));

var _PlayerModel = _interopRequireDefault(require("../../models/PlayerModel"));

var PlayerController = /*#__PURE__*/function () {
  function PlayerController(io) {
    (0, _classCallCheck2["default"])(this, PlayerController);
    this.players = {};
    this.playerLocations = [];
    this.io = io;
    this.init();
  }

  (0, _createClass2["default"])(PlayerController, [{
    key: "init",
    value: function init() {}
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      var _this = this;

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
      socket.on("newPlayer", /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, key) {
          var decoded, _decoded$user, name, _id, playerSchema;

          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  console.log("newPlayer");
                  _context2.prev = 1;
                  decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                  _decoded$user = decoded.user, name = _decoded$user.name, _id = _decoded$user._id;
                  _context2.next = 6;
                  return _UserModel["default"].findById(_id);

                case 6:
                  playerSchema = _context2.sent;

                  // create a new Player
                  _this.spawnPlayer(socket.id, name, key, playerSchema.player);

                  socket.emit("currents"); // inform the other players of the new player that joined

                  socket.broadcast.emit("spawnPlayer", _this.players[socket.id]);
                  socket.emit("updateItems", _this.players[socket.id]);
                  socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]);
                  _context2.next = 18;
                  break;

                case 14:
                  _context2.prev = 14;
                  _context2.t0 = _context2["catch"](1);
                  console.log(_context2.t0);
                  socket.emit("invalidToken");

                case 18:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[1, 14]]);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
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

        socket.on("pickUpChest", function (chestId) {
          // update the spawner
          if (_this.chests[chestId]) {
            var gold = _this.chests[chestId].gold; // updating the players gold

            _this.players[socket.id].updateGold(gold);

            socket.emit("updateScore", _this.players[socket.id].gold);
            socket.broadcast.emit("updatePlayersScore", socket.id, _this.players[socket.id].gold); // removing the chest
            //this.deleteChest(chestId);
          }
        });
        socket.on("pickUpItem", function (itemId) {
          // update the spawner
          if (_this.items[itemId]) {
            if (_this.players[socket.id].canPickupItem()) {
              _this.players[socket.id].addItem(_this.items[itemId]);

              socket.emit("updateItems", _this.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this.players[socket.id]); // removing the item
              //this.deleteItems(itemId);
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
        socket.on("disconnect", function () {
          // delete user data from server
          console.log("Player Disconnect");
          delete _this.players[socket.id]; // emit a message to all players to remove this player

          _this.io.emit("disconnected", socket.id);
        });
      });
    }
  }, {
    key: "spawnPlayer",
    value: function spawnPlayer(playerId, name, key, playerSchema) {
      var player = new _PlayerModel["default"](playerId, [[200, 200], [400, 400]], this.players, name, key, undefined, playerSchema);
      this.players[playerId] = player;
    }
  }, {
    key: "getPlayerList",
    value: function getPlayerList() {
      return this.players;
    }
  }]);
  return PlayerController;
}();

exports["default"] = PlayerController;
//# sourceMappingURL=PlayerController.js.map