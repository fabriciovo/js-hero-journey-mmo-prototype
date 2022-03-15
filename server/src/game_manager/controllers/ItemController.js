import ChestModel from "../../models/ChestModel";
import ItemModel from "../../models/ItemModel";
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

  setupEventListeners(socket) {
    socket.on("playerPickupItem", (itemId, player) => {
      if (this.items[itemId]) {
        if (player.canPickupItem()) {
          player.addItem(this.items[itemId]);
          socket.emit("updateItems", player);
          socket.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            player
          );
          this.deleteItems(itemId);
        }
      }

    });

    socket.on("pickUpChest", (chestId, player) => {
      if (this.chests[chestId]) {
        const { gold } = this.chests[chestId];
        // updating the players gold
        player.updateGold(gold);
        socket.emit("updateScore", player.gold);
        socket.broadcast.emit(
          "updatePlayersScore",
          socket.id,
          player.gold
        );
      this.deleteChest(chestId);
      }
    });

    socket.on("dropItem", (x, y, item) => {
      this.itemDictionary[item](x, y);
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
    delete this.chests[chestId];
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
