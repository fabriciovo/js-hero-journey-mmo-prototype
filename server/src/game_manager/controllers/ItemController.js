import ChestModel from "../../models/ChestModel.js";
import ItemModel from "../../models/ItemModel.js";
import * as itemData from "../../../public/assets/level/tools.json";
import { v4 } from "uuid";
import { getRandonValues, randomNumber, WeaponTypes } from "../utils";

export default class ItemController {
  constructor(io) {
    this.chests = {};
    this.items = {};
    this.io = io;

    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop.bind(this),
    };
  }

  _eventDrop(socket) {
    return socket.on("dropItem", (x, y, item) => {
      this.itemDictionary[item](x, y);
    });
  }

  setupEventListeners(socket) {
    this._eventDrop(socket);
    socket.on("playerCollectedItem", (itemId) => {
      socket.emit("collectedItem", this.items[itemId]);
      this.deleteItems(itemId);
    });
  }

  addItems(itemId, item) {
    this.items[itemId] = item;
    this.io.emit("itemSpawned", item);
  }

  deleteItems(itemId) {
    delete this.items[itemId];
    this.io.emit("itemRemoved", itemId);
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.io.emit("chestSpawned", chest);
  }

  deleteChest(chestId) {
    this.io.emit("chestRemoved", chestId);
  }

  drop(x, y) {}

  createChest(x, y) {
    const chest = new ChestModel(x, y, randomNumber(10, 20), `chest-${v4()}`);
    this.addChest(chest.id, chest);
  }

  createItem(x, y) {
    const randomItem =
      itemData.items[Math.floor(Math.random() * itemData.items.length)];

    const item = new ItemModel(
      x,
      y,
      `item-${v4()}`,
      randomItem.name,
      randomItem.frame,
      getRandonValues(),
      getRandonValues(),
      getRandonValues(),
      WeaponTypes.MELEE,
      "Description"
    );

    this.addItems(item.id, item);
  }
}
