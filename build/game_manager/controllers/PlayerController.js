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
  function PlayerController(io, playerLocations) {
    (0, _classCallCheck2["default"])(this, PlayerController);
    this.players = {};
    this.playerLocations = playerLocations;
    this.io = io;
  }
  return (0, _createClass2["default"])(PlayerController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      var _this = this;
      this._eventNewPlayer(socket);
      this._eventPlayerMovement(socket);
      this._eventPickupChest(socket);
      this._eventPickupItem(socket);
      this._eventPlayerDroppedItem(socket);
      this._eventPlayerEquipedItem(socket);
      this._eventPlayerUnequipedItem(socket);
      this._eventHealthPotion(socket);
      this._eventAttackedPlayer(socket);
      this._eventPlayerHit(socket);
      this._eventSendBuyItemMessage(socket);
      this._eventPlayerUpdateXp(socket);
      this._eventLevelUp(socket);
      this._eventDisconnect(socket);
      this._eventSavePlayerData(socket);
      socket.on("playerGetItem", function (item, playerId) {
        var player = _this.players[playerId];
        player.addItem(item);
        socket.emit("updateItems", player);
        socket.broadcast.emit("updatePlayersItems", playerId, player);
      });
    }
  }, {
    key: "_eventSavePlayerData",
    value: function _eventSavePlayerData(socket) {
      var _this2 = this;
      return socket.on("savePlayerData", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              if (!_this2.players[socket.id].items) {
                _this2.players[socket.id].items = null;
              }
              if (!_this2.players[socket.id].equipedItems) {
                _this2.players[socket.id].equipedItems = null;
              }
              _context.next = 5;
              return _UserModel["default"].updateOne({
                username: _this2.players[socket.id].playerName
              }, {
                $set: {
                  player: _this2.players[socket.id]
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
      var _this3 = this;
      return socket.on("newPlayer", /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, key, instanceId) {
          var decoded, _decoded$user, name, _id, playerSchema, player;
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                _decoded$user = decoded.user, name = _decoded$user.name, _id = _decoded$user._id;
                _context2.next = 5;
                return _UserModel["default"].findById(_id);
              case 5:
                playerSchema = _context2.sent;
                console.log(name);
                player = _this3._spawnPlayer(socket.id, name, key, playerSchema.player);
                socket.emit("currentPlayers", _this3.players, instanceId);

                // inform the other players of the new player that joined
                socket.broadcast.emit("spawnPlayer", player);
                socket.emit("updateItems", player);
                socket.broadcast.emit("updatePlayersItems", socket.id, player);
                _context2.next = 18;
                break;
              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                socket.emit("invalidToken");
              case 18:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 14]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "_eventPlayerMovement",
    value: function _eventPlayerMovement(socket) {
      var _this4 = this;
      return socket.on("playerMovement", function (playerData) {
        if (_this4.players[socket.id]) {
          _this4.players[socket.id].x = playerData.x;
          _this4.players[socket.id].y = playerData.y;
          _this4.players[socket.id].flipX = playerData.flipX;
          _this4.players[socket.id].actionAActive = playerData.actionAActive;
          _this4.players[socket.id].potionAActive = playerData.potionAActive;
          _this4.players[socket.id].frame = playerData.frame;
          _this4.players[socket.id].currentDirection = playerData.currentDirection;
          // emit a message to all players about the player that moved
          _this4.io.emit("playerMoved", _this4.players[socket.id]);
        }
      });
    }
  }, {
    key: "_eventPickupChest",
    value: function _eventPickupChest(socket) {
      var _this5 = this;
      return socket.on("pickUpChest", function (chestId) {
        var player = _this5.players[socket.id];
        player.updateGold(20);
        socket.emit("updateScore", player.gold);
        socket.broadcast.emit("updatePlayersScore", socket.id, player.gold);
        _this5.io.emit("chestRemoved", chestId);
      });
    }
  }, {
    key: "_eventPickupItem",
    value: function _eventPickupItem(socket) {
      var _this6 = this;
      return socket.on("pickUpItem", function (itemId) {
        var player = _this6.players[socket.id];
        if (player.canPickupItem()) {
          socket.emit("collectItem", itemId);
        }
      });
    }
  }, {
    key: "_eventPlayerDroppedItem",
    value: function _eventPlayerDroppedItem(socket) {
      var _this7 = this;
      return socket.on("playerDroppedItem", function (itemId) {
        _this7.players[socket.id].removeItem(itemId);
        socket.emit("updateItems", _this7.players[socket.id]);
        socket.broadcast.emit("updatePlayersItems", socket.id, _this7.players[socket.id]);
      });
    }
  }, {
    key: "_eventPlayerEquipedItem",
    value: function _eventPlayerEquipedItem(socket) {
      var _this8 = this;
      return socket.on("playerEquipedItem", function (itemId) {
        if (_this8.players[socket.id].items[itemId]) {
          if (_this8.players[socket.id].canEquipItem()) {
            _this8.players[socket.id].equipItem(_this8.players[socket.id].items[itemId]);
            socket.emit("updateItems", _this8.players[socket.id]);
            socket.broadcast.emit("updatePlayersItems", socket.id, _this8.players[socket.id]);
          }
        }
      });
    }
  }, {
    key: "_eventPlayerUnequipedItem",
    value: function _eventPlayerUnequipedItem(socket) {
      var _this9 = this;
      return socket.on("playerUnequipedItem", function (itemId) {
        if (_this9.players[socket.id].equipedItems[itemId]) {
          if (_this9.players[socket.id].canPickupItem()) {
            _this9.players[socket.id].addItem(_this9.players[socket.id].equipedItems[itemId]);
            _this9.players[socket.id].removeEquipedItem(itemId);
            socket.emit("updateItems", _this9.players[socket.id]);
            socket.broadcast.emit("updatePlayersItems", socket.id, _this9.players[socket.id]);
          }
        }
      });
    }
  }, {
    key: "_eventLevelUp",
    value: function _eventLevelUp(socket) {
      var _this10 = this;
      return socket.on("levelUp", function () {
        _this10.players[socket.id].levelUp();
        _this10.io.emit("updatePlayerStats", socket.id, _this10.players[socket.id].level, _this10.players[socket.id].attack, _this10.players[socket.id].defense, _this10.players[socket.id].maxHealth, _this10.players[socket.id].exp, _this10.players[socket.id].maxExp);
      });
    }
  }, {
    key: "_eventHealthPotion",
    value: function _eventHealthPotion(socket) {
      var _this11 = this;
      return socket.on("healthPotion", function (playerId, health) {
        _this11.players[playerId];
        _this11.players[playerId].potion(health);
        _this11.io.emit("updatePlayerHealth", playerId, _this11.players[playerId].health);
      });
    }
  }, {
    key: "_eventAttackedPlayer",
    value: function _eventAttackedPlayer(socket) {
      var _this12 = this;
      return socket.on("attackedPlayer", function (attackedPlayerId) {
        if (_this12.players[attackedPlayerId]) {
          // get required info from attacked player
          var gold = _this12.players[attackedPlayerId].gold;
          var playerAttackValue = _this12.players[socket.id].attack;

          // subtract health from attacked player
          _this12.players[attackedPlayerId].playerAttacked(playerAttackValue);

          // check attacked players health, if dead send gold to other player
          if (_this12.players[attackedPlayerId].health <= 0) {
            // get the amount of gold, and update player object
            _this12.players[socket.id].updateGold(gold);

            // respawn attacked player
            _this12.players[attackedPlayerId].respawn(_this12.players);
            _this12.io.emit("respawnPlayer", _this12.players[attackedPlayerId]);

            // send update gold message to player
            socket.emit("updateScore", _this12.players[socket.id].gold);

            // reset the attacked players gold
            _this12.players[attackedPlayerId].updateGold(-gold);
            _this12.io.to("".concat(attackedPlayerId)).emit("updateScore", _this12.players[attackedPlayerId].gold);

            // add bonus health to the player
            _this12.players[socket.id].updateHealth(15);
            _this12.io.emit("updatePlayerHealth", socket.id, _this12.players[socket.id].health);
          } else {
            _this12.io.emit("updatePlayerHealth", attackedPlayerId, _this12.players[attackedPlayerId].health);
          }
        }
      });
    }
  }, {
    key: "_eventPlayerHit",
    value: function _eventPlayerHit(socket) {
      var _this13 = this;
      return socket.on("playerHit", function (playerId, monsterAttack) {
        _this13.players[playerId].playerAttacked(monsterAttack);
        _this13.io.emit("updatePlayerHealth", playerId, _this13.players[playerId].health);
        // check the player's health, if below 0 have the player respawn
        if (_this13.players[playerId].health <= 0) {
          // update the gold the player has
          _this13.players[playerId].updateGold(parseInt(-_this13.players[playerId].gold / 2, 10));
          socket.emit("updateScore", _this13.players[playerId].gold);

          // respawn the player
          _this13.players[playerId].respawn(_this13.players);
          _this13.io.emit("respawnPlayer", _this13.players[playerId]);
        }
      });
    }
  }, {
    key: "_eventSendBuyItemMessage",
    value: function _eventSendBuyItemMessage(socket) {
      var _this14 = this;
      return socket.on("sendBuyItemMessage", function (item) {
        _this14.players[socket.id].potions++;
        _this14.players[socket.id].updateGold(-item.price);
        socket.emit("updateScore", _this14.players[socket.id].gold);
        socket.broadcast.emit("updatePlayersScore", socket.id, _this14.players[socket.id].gold);
      });
    }
  }, {
    key: "_eventPlayerUpdateXp",
    value: function _eventPlayerUpdateXp(socket) {
      var _this15 = this;
      return socket.on("playerUpdateXp", function (playerId, exp) {
        _this15.players[playerId].updateExp(exp);
        _this15.io.emit("updateXp", exp, socket.id);
      });
    }
  }, {
    key: "_eventDisconnect",
    value: function _eventDisconnect(socket) {
      var _this16 = this;
      return socket.on("disconnect", function () {
        // delete user data from server

        console.log("Player Disconnect");
        delete _this16.players[socket.id];

        // emit a message to all players to remove this player
        _this16.io.emit("disconnected", socket.id);
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