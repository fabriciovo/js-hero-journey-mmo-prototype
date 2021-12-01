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

var _uuid = require("uuid");

var SceneObject = /*#__PURE__*/function () {
  function SceneObject(data, itemData, sceneId, io, socket) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, SceneObject);
    this.id = "".concat(sceneId, "-").concat((0, _uuid.v4)());
    this.data = data;
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.items = {};
    this.npcs = {};
    this.playerLocations = [];
    this.chestLocations = [];
    this.monsterLocations = [];
    this.npcLocations = [];
    this.spawners = [];
    this.itemLocations = itemData.itemLocations;
    this.getLocations = {
      player_locations: function player_locations(layer) {
        layer.objects.forEach(function (obj) {
          _this.playerLocations.push([obj.x, obj.y]);
        });
      },
      monster_locations: function monster_locations(layer) {
        layer.objects.forEach(function (obj) {
          _this.monsterLocations.push([obj.x, obj.y]);
        });
      },
      chest_locations: function chest_locations(layer) {
        layer.objects.forEach(function (obj) {
          _this.monsterLocations.push([obj.x, obj.y]);
        });
      },
      npc_locations: function npc_locations(layer) {
        layer.objects.forEach(function (obj) {
          _this.npcLocations.push([obj.x, obj.y]);
        });
      }
    };
    this.parseMapData();
    this.setupEventListeners(io, socket);
    this.setupSpawners();
  }

  (0, _createClass2["default"])(SceneObject, [{
    key: "parseMapData",
    value: function parseMapData() {
      var _this2 = this;

      this.data.layers.forEach(function (layer) {
        _this2.getLocations[layer.name](layer);
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners(io, socket) {
      var _this3 = this;

      socket.on("sendMessage", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message, token, player) {
          var decoded, _decoded$user, name, email;

          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
                  _decoded$user = decoded.user, name = _decoded$user.name, email = _decoded$user.email;
                  _context.next = 5;
                  return ChatModel.create({
                    email: email,
                    message: message
                  });

                case 5:
                  io.emit("newMessage", {
                    message: message,
                    name: _this3.players[socket.id].playerName,
                    frame: _this3.players[socket.id].frame
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
      socket.on("newPlayer", /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, key, room) {
          var decoded, _decoded$user2, name, _id, playerSchema;

          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
                  _decoded$user2 = decoded.user, name = _decoded$user2.name, _id = _decoded$user2._id;
                  _context2.next = 4;
                  return UserModel.findById(_id);

                case 4:
                  playerSchema = _context2.sent;

                  // create a new Player
                  _this3.spawnPlayer(socket.id, name, key, playerSchema.player); // send the players object to the new player


                  socket.emit("createPlayer", _this3.players[socket.id], true); // send the players object to the new player

                  socket.emit("currentPlayers", _this3.players, false); // send the monsters object to the new player

                  socket.emit("currentMonsters", _this3.monsters); // send the chests object to the new player

                  socket.emit("currentChests", _this3.chests); // send the items object to the new player

                  socket.emit("currentItems", _this3.items); // send the npcs object to the new player

                  socket.emit("currentNpcs", _this3.npcs); // inform the other players of the new player that joined

                  socket.broadcast.emit("spawnPlayer", _this3.players[socket.id]);
                  socket.emit("updateItems", _this3.players[socket.id]);
                  socket.broadcast.emit("updatePlayersItems", socket.id, _this3.players[socket.id]);

                case 15:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
      socket.on("playerMovement", function (playerData) {
        if (_this3.players[socket.id]) {
          _this3.players[socket.id].x = playerData.x;
          _this3.players[socket.id].y = playerData.y;
          _this3.players[socket.id].flipX = playerData.flipX;
          _this3.players[socket.id].actionAActive = playerData.actionAActive;
          _this3.players[socket.id].actionBActive = playerData.actionBActive;
          _this3.players[socket.id].potionAActive = playerData.potionAActive;
          _this3.players[socket.id].frame = playerData.frame;
          _this3.players[socket.id].currentDirection = playerData.currentDirection; // emit a message to all players about the player that moved

          socket.broadcast.emit("playerMoved", _this3.players[socket.id]);
        }
      });
      socket.on("pickUpChest", function (chestId) {
        // update the spawner
        if (_this3.chests[chestId]) {
          var gold = _this3.chests[chestId].gold; // updating the players gold

          _this3.players[socket.id].updateGold(gold);

          socket.to("world_1").emit("updateScore", _this3.players[socket.id].gold);
          socket.to("world_1").broadcast.emit("updatePlayersScore", socket.id, _this3.players[socket.id].gold); // removing the chest

          _this3.spawners[_this3.chests[chestId].spawnerId].removeObject(chestId);
        }
      });
      socket.on("pickUpItem", function (itemId) {
        // update the spawner
        if (_this3.items[itemId]) {
          if (_this3.players[socket.id].canPickupItem()) {
            _this3.players[socket.id].addItem(_this3.items[itemId]);

            socket.emit("updateItems", _this3.players[socket.id]);
            io.broadcast.emit("updatePlayersItems", socket.id, _this3.players[socket.id]); // removing the item

            _this3.spawners[_this3.items[itemId].spawnerId].removeObject(itemId);
          }
        }
      });
      socket.on("playerDroppedItem", function (itemId) {
        _this3.players[socket.id].removeItem(itemId);

        socket.emit("updateItems", _this3.players[socket.id]);

        _this3.broadcast.emit("updatePlayersItems", socket.id, _this3.players[socket.id]);
      });
      socket.on("playerEquipedItem", function (itemId) {
        if (_this3.players[socket.id].items[itemId]) {
          if (_this3.players[socket.id].canEquipItem()) {
            _this3.players[socket.id].equipItem(_this3.players[socket.id].items[itemId]);

            socket.emit("updateItems", _this3.players[socket.id]);
            io.broadcast.emit("updatePlayersItems", socket.id, _this3.players[socket.id]);
          }
        }
      });
      socket.on("playerUnequipedItem", function (itemId) {
        if (_this3.players[socket.id].equipedItems[itemId]) {
          if (_this3.players[socket.id].canPickupItem()) {
            _this3.players[socket.id].addItem(_this3.players[socket.id].equipedItems[itemId]);

            _this3.players[socket.id].removeEquipedItem(itemId);

            socket.emit("updateItems", _this3.players[socket.id]);

            _this3.broadcast.emit("updatePlayersItems", socket.id, _this3.players[socket.id]);
          }
        }
      });
      socket.on("levelUp", function () {
        _this3.players[socket.id].levelUp();

        io.emit("updatePlayerStats", socket.id, _this3.players[socket.id].level, _this3.players[socket.id].attack, _this3.players[socket.id].defense, _this3.players[socket.id].maxHealth, _this3.players[socket.id].exp, _this3.players[socket.id].maxExp);
      });
      socket.on("attackedPlayer", function (attackedPlayerId) {
        if (_this3.players[attackedPlayerId]) {
          // get required info from attacked player
          var gold = _this3.players[attackedPlayerId].gold;
          var playerAttackValue = _this3.players[socket.id].attack; // subtract health from attacked player

          _this3.players[attackedPlayerId].playerAttacked(playerAttackValue); // check attacked players health, if dead send gold to other player


          if (_this3.players[attackedPlayerId].health <= 0) {
            // get the amount of gold, and update player object
            _this3.players[socket.id].updateGold(gold); // respawn attacked player


            _this3.players[attackedPlayerId].respawn(_this3.players);

            io.broadcast.emit("respawnPlayer", _this3.players[attackedPlayerId]); // send update gold message to player

            socket.emit("updateScore", _this3.players[socket.id].gold); // reset the attacked players gold

            _this3.players[attackedPlayerId].updateGold(-gold);

            io.to("".concat(attackedPlayerId)).emit("updateScore", _this3.players[attackedPlayerId].gold); // add bonus health to the player

            _this3.players[socket.id].updateHealth(15);

            io.emit("updatePlayerHealth", socket.id, _this3.players[socket.id].health);
          } else {
            io.emit("updatePlayerHealth", attackedPlayerId, _this3.players[attackedPlayerId].health);
          }
        }
      });
      socket.on("monsterAttacked", function (monsterId, dis) {
        // update the spawner
        if (_this3.monsters[monsterId]) {
          var _this3$monsters$monst = _this3.monsters[monsterId],
              gold = _this3$monsters$monst.gold,
              attack = _this3$monsters$monst.attack,
              exp = _this3$monsters$monst.exp;
          var playerAttackValue = _this3.players[socket.id].attack; // subtract health monster model

          _this3.monsters[monsterId].loseHealth(playerAttackValue); // check the monsters health, and if dead remove that object


          if (_this3.monsters[monsterId].health <= 0) {
            // updating the players gold
            _this3.players[socket.id].updateGold(gold);

            socket.emit("updateScore", _this3.players[socket.id].gold); //socket.emit("dropItem", item);
            //update xp

            _this3.players[socket.id].updateExp(exp);

            io.emit("updateXp", exp, socket.id); // removing the monster

            _this3.spawners[_this3.monsters[monsterId].spawnerId].removeObject(monsterId);

            io.emit("monsterRemoved", monsterId);
          } else {
            // update the monsters health
            io.emit("updateMonsterHealth", monsterId, _this3.monsters[monsterId].health);

            if (dis < 90) {
              // update the players health
              _this3.players[socket.id].playerAttacked(attack);

              io.emit("updatePlayerHealth", socket.id, _this3.players[socket.id].health); // check the player's health, if below 0 have the player respawn

              if (_this3.players[socket.id].health <= 0) {
                // update the gold the player has
                _this3.players[socket.id].updateGold(parseInt(-_this3.players[socket.id].gold / 2, 10));

                socket.emit("updateScore", _this3.players[socket.id].gold); // respawn the player

                _this3.players[socket.id].respawn(_this3.players);

                io.emit("respawnPlayer", _this3.players[socket.id]);
              }
            }
          }
        }
      });
      socket.on("playerHit", function (damage) {});
      socket.on("healthPotion", function (playerId, health) {
        if (socket.id === playerId) {
          _this3.players[socket.id];

          _this3.players[socket.id].potion(health);

          io.emit("updatePlayerHealth", socket.id, _this3.players[socket.id].health);
        }
      });
      socket.on("sendBuyItemMessage", function (item) {
        _this3.players[socket.id].potions++;

        _this3.players[socket.id].updateGold(-item.price);

        socket.emit("updateScore", _this3.players[socket.id].gold);
        socket.broadcast.emit("updatePlayersScore", socket.id, _this3.players[socket.id].gold);
      });
    }
  }, {
    key: "setupSpawners",
    value: function setupSpawners() {}
  }]);
  return SceneObject;
}();

exports["default"] = SceneObject;
//# sourceMappingURL=SceneObject.js.map