"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _ChestModel = _interopRequireDefault(require("../../models/ChestModel.js"));
var _ItemModel = _interopRequireDefault(require("../../models/ItemModel.js"));
var itemData = _interopRequireWildcard(require("../../../public/assets/level/tools.json"));
var _uuid = require("uuid");
var _utils = require("../utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var ItemController = exports["default"] = /*#__PURE__*/function () {
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
  return (0, _createClass2["default"])(ItemController, [{
    key: "_eventDrop",
    value: function _eventDrop(socket) {
      var _this = this;
      return socket.on("dropItem", function (x, y, item) {
        _this.itemDictionary[item](x, y);
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners(socket) {
      var _this2 = this;
      this._eventDrop(socket);
      socket.on("playerCollectedItem", function (itemId) {
        socket.emit("collectedItem", _this2.items[itemId]);
        _this2.deleteItems(itemId);
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
}();
//# sourceMappingURL=ItemController.js.map