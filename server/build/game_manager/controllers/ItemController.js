"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ChestModel = _interopRequireDefault(require("../../models/ChestModel"));

var _ItemModel = _interopRequireDefault(require("../../models/ItemModel"));

var itemData = _interopRequireWildcard(require("../../../public/assets/level/tools.json"));

var _uuid = require("uuid");

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ItemController = /*#__PURE__*/function () {
  function ItemController(io) {
    (0, _classCallCheck2["default"])(this, ItemController);
    this.chests = {};
    this.items = {};
    this.io = io;
    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop.bind(this)
    };
  }

  (0, _createClass2["default"])(ItemController, [{
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      var _this = this;

      socket.on("playerPickupItem", function (itemId, player) {
        if (_this.items[itemId]) {
          if (player.canPickupItem()) {
            player.addItem(_this.items[itemId]);
            socket.emit("updateItems", player);
            socket.broadcast.emit("updatePlayersItems", socket.id, player);

            _this.deleteItems(itemId);
          }
        }
      });
      socket.on("pickUpChest", function (chestId, player) {
        if (_this.chests[chestId]) {
          var gold = _this.chests[chestId].gold; // updating the players gold

          player.updateGold(gold);
          socket.emit("updateScore", player.gold);
          socket.broadcast.emit("updatePlayersScore", socket.id, player.gold);

          _this.deleteChest(chestId);
        }
      });
      socket.on("dropItem", function (x, y, item) {
        _this.itemDictionary[item](x, y);
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
  return ItemController;
}();

exports["default"] = ItemController;
//# sourceMappingURL=ItemController.js.map