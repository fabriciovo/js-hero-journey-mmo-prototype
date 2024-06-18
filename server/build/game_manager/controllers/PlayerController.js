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
var PlayerController = exports["default"] = /*#__PURE__*/function () {
  function PlayerController(io) {
    (0, _classCallCheck2["default"])(this, PlayerController);
    this.players = {};
    this.playerLocations = [];
    this.io = io;
  }
  return (0, _createClass2["default"])(PlayerController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      this._eventNewPlayer(socket);
      this._eventPlayerMovement(socket);
      this._eventPickupChest(socket);
      this._eventPickupItem(socket);
      this._eventPlayerDroppedItem(socket);
      this._eventPlayerEquipedItem(socket);
      this._eventPlayerUnequipedItem(socket);
      this._eventHealthPotion(socket);
      this._eventPickupItem(socket);
      this._eventAttackedPlayer(socket);
      this._eventPlayerHit(socket);
      this._eventSendBuyItemMessage(socket);
      this._eventPlayerUpdateXp(socket);
      this._eventDisconnect(socket);
    }
  }, {
    key: "_eventSavePlayerData",
    value: function _eventSavePlayerData(socket) {
      var _this = this;
      return socket.on("savePlayerData", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
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
        }, _callee, null, [[0, 7]]);
      })));
    }
  }, {
    key: "_eventNewPlayer",
    value: function _eventNewPlayer(socket) {
      var _this2 = this;
      socket.on("newPlayer", /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, key, instanceId) {
          var decoded, _decoded$user, name, _id, playerSchema, player;
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                console.log("Player newPlayer");
                _context2.prev = 1;
                decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                _decoded$user = decoded.user, name = _decoded$user.name, _id = _decoded$user._id;
                _context2.next = 6;
                return _UserModel["default"].findById(_id);
              case 6:
                playerSchema = _context2.sent;
                player = _this2._spawnPlayer(socket.id, name, key, playerSchema.player);
                socket.emit("currentPlayers", _this2.players, instanceId);

                // inform the other players of the new player that joined
                socket.broadcast.emit("spawnPlayer", player);
                socket.emit("updateItems", player);
                socket.broadcast.emit("updatePlayersItems", socket.id, player);
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
          }, _callee2, null, [[1, 14]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "_eventPlayerMovement",
    value: function _eventPlayerMovement(socket) {
      var _this3 = this;
      return socket.on("playerMovement", function (playerData) {
        if (_this3.players[socket.id]) {
          _this3.players[socket.id].x = playerData.x;
          _this3.players[socket.id].y = playerData.y;
          _this3.players[socket.id].flipX = playerData.flipX;
          _this3.players[socket.id].actionAActive = playerData.actionAActive;
          _this3.players[socket.id].potionAActive = playerData.potionAActive;
          _this3.players[socket.id].frame = playerData.frame;
          _this3.players[socket.id].currentDirection = playerData.currentDirection;
          // emit a message to all players about the player that moved
          _this3.io.emit("playerMoved", _this3.players[socket.id]);
        }
      });
    }
  }, {
    key: "_eventPickupChest",
    value: function _eventPickupChest(socket) {
      var _this4 = this;
      return socket.on("pickUpChest", function (chestId) {
        _this4.io.emit("playerPickupChest", chestId, _this4.players[socket.id]);
      });
    }
  }, {
    key: "_eventPickupItem",
    value: function _eventPickupItem(socket) {
      var _this5 = this;
      return socket.on("levelUp", function () {
        _this5.players[socket.id].levelUp();
        _this5.io.emit("updatePlayerStats", socket.id, _this5.players[socket.id].level, _this5.players[socket.id].attack, _this5.players[socket.id].defense, _this5.players[socket.id].maxHealth, _this5.players[socket.id].exp, _this5.players[socket.id].maxExp);
      });
    }
  }, {
    key: "_eventPlayerDroppedItem",
    value: function _eventPlayerDroppedItem(socket) {
      var _this6 = this;
      return socket.on("playerDroppedItem", function (itemId) {
        _this6.players[socket.id].removeItem(itemId);
        socket.emit("updateItems", _this6.players[socket.id]);
        socket.broadcast.emit("updatePlayersItems", socket.id, _this6.players[socket.id]);
      });
    }
  }, {
    key: "_eventPlayerEquipedItem",
    value: function _eventPlayerEquipedItem(socket) {
      var _this7 = this;
      return socket.on("playerEquipedItem", function (itemId) {
        if (_this7.players[socket.id].items[itemId]) {
          if (_this7.players[socket.id].canEquipItem()) {
            _this7.players[socket.id].equipItem(_this7.players[socket.id].items[itemId]);
            socket.emit("updateItems", _this7.players[socket.id]);
            socket.broadcast.emit("updatePlayersItems", socket.id, _this7.players[socket.id]);
          }
        }
      });
    }
  }, {
    key: "_eventPlayerUnequipedItem",
    value: function _eventPlayerUnequipedItem(socket) {
      var _this8 = this;
      return socket.on("playerUnequipedItem", function (itemId) {
        if (_this8.players[socket.id].equipedItems[itemId]) {
          if (_this8.players[socket.id].canPickupItem()) {
            _this8.players[socket.id].addItem(_this8.players[socket.id].equipedItems[itemId]);
            _this8.players[socket.id].removeEquipedItem(itemId);
            socket.emit("updateItems", _this8.players[socket.id]);
            socket.broadcast.emit("updatePlayersItems", socket.id, _this8.players[socket.id]);
          }
        }
      });
    }
  }, {
    key: "_eventHealthPotion",
    value: function _eventHealthPotion(socket) {
      var _this9 = this;
      return socket.on("healthPotion", function (playerId, health) {
        _this9.players[playerId];
        _this9.players[playerId].potion(health);
        _this9.io.emit("updatePlayerHealth", playerId, _this9.players[playerId].health);
      });
    }
  }, {
    key: "_eventAttackedPlayer",
    value: function _eventAttackedPlayer(socket) {
      var _this10 = this;
      return socket.on("attackedPlayer", function (attackedPlayerId) {
        if (_this10.players[attackedPlayerId]) {
          // get required info from attacked player
          var gold = _this10.players[attackedPlayerId].gold;
          var playerAttackValue = _this10.players[socket.id].attack;

          // subtract health from attacked player
          _this10.players[attackedPlayerId].playerAttacked(playerAttackValue);

          // check attacked players health, if dead send gold to other player
          if (_this10.players[attackedPlayerId].health <= 0) {
            // get the amount of gold, and update player object
            _this10.players[socket.id].updateGold(gold);

            // respawn attacked player
            _this10.players[attackedPlayerId].respawn(_this10.players);
            _this10.io.emit("respawnPlayer", _this10.players[attackedPlayerId]);

            // send update gold message to player
            socket.emit("updateScore", _this10.players[socket.id].gold);

            // reset the attacked players gold
            _this10.players[attackedPlayerId].updateGold(-gold);
            _this10.io.to("".concat(attackedPlayerId)).emit("updateScore", _this10.players[attackedPlayerId].gold);

            // add bonus health to the player
            _this10.players[socket.id].updateHealth(15);
            _this10.io.emit("updatePlayerHealth", socket.id, _this10.players[socket.id].health);
          } else {
            _this10.io.emit("updatePlayerHealth", attackedPlayerId, _this10.players[attackedPlayerId].health);
          }
        }
      });
    }
  }, {
    key: "_eventPlayerHit",
    value: function _eventPlayerHit(socket) {
      var _this11 = this;
      return socket.on("playerHit", function (playerId, monsterAttack) {
        var gold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
        _this11.players[playerId].playerAttacked(monsterAttack);
        // check attacked players health, if dead send gold to other player
        if (_this11.players[playerId].health <= 0) {
          // get the amount of gold, and update player object
          _this11.players[playerId].updateGold(gold);

          // respawn attacked player
          _this11.players[playerId].respawn(_this11.players);
          _this11.io.emit("respawnPlayer", _this11.players[playerId]);

          // send update gold message to player
          socket.emit("updateScore", _this11.players[socket.id].gold);

          // reset the attacked players gold
          _this11.players[playerId].updateGold(-gold);
          _this11.io.to("".concat(playerId)).emit("updateScore", _this11.players[playerId].gold);

          // add bonus health to the player
          _this11.players[socket.id].updateHealth(15);
          _this11.io.emit("updatePlayerHealth", socket.id, _this11.players[socket.id].health);
        } else {
          _this11.io.emit("updatePlayerHealth", playerId, _this11.players[playerId].health);
        }
      });
    }
  }, {
    key: "_eventSendBuyItemMessage",
    value: function _eventSendBuyItemMessage(socket) {
      var _this12 = this;
      return socket.on("sendBuyItemMessage", function (item) {
        _this12.players[socket.id].potions++;
        _this12.players[socket.id].updateGold(-item.price);
        socket.emit("updateScore", _this12.players[socket.id].gold);
        socket.broadcast.emit("updatePlayersScore", socket.id, _this12.players[socket.id].gold);
        // check the player's health, if below 0 have the player respawn
        if (_this12.players[playerId].health <= 0) {
          // update the gold the player has
          _this12.players[playerId].updateGold(parseInt(-_this12.players[playerId].gold / 2, 10));
          _this12.players[playerId].updateExp(parseInt(-_this12.players[playerId].exp / 2, 10));
          socket.emit("updateScore", _this12.players[playerId].gold);

          // respawn the player
          _this12.players[playerId].respawn(_this12.players);
          _this12.io.emit("respawnPlayer", _this12.players[playerId]);
        }
      });
    }
  }, {
    key: "_eventPlayerUpdateXp",
    value: function _eventPlayerUpdateXp(socket) {
      var _this13 = this;
      return socket.on("playerUpdateXp", function (playerId, exp) {
        _this13.players[playerId].updateExp(exp);
        _this13.io.emit("updateXp", exp, socket.id);
      });
    }
  }, {
    key: "_eventDisconnect",
    value: function _eventDisconnect(socket) {
      var _this14 = this;
      return socket.on("disconnect", function () {
        // delete user data from server

        console.log("Player Disconnect");
        delete _this14.players[socket.id];

        // emit a message to all players to remove this player
        _this14.io.emit("disconnected", socket.id);
      });
    }
  }, {
    key: "_spawnPlayer",
    value: function _spawnPlayer(playerId, name, key, playerSchema) {
      var player = new _PlayerModel["default"](playerId, [[200, 200], [400, 400]], this.players, name, key, undefined, playerSchema);
      this.players[playerId] = player;
      return this.players[playerId];
    }
  }]);
}();
//# sourceMappingURL=PlayerController.js.map