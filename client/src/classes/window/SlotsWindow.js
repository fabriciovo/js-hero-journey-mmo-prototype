import ModalWindow from "./ModalWindow";
import { DEPTH, iconsetSlotsTypes } from "../../utils/utils";

export default class SlotsWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);
    this.playerObject = {};
    this.slots = {};
    this.data = this.scene.gameScene.cache.json.get("weaponsData");
    this.graphics.setDepth(DEPTH.UI);
    this.selectedItem = undefined;
    this.selectedItemNumber = undefined;
    this.createWindow();
    this.hideWindow();
  }

  calculateWindowDimension() {
    let x = this.x + this.scene.scale.width / 4 + 140;
    let y = this.y + this.scene.scale.height * 0.1;

    if (this.scene.scale.width < 750) {
      x = this.x + 40;
      y = this.y + 40;
    }

    const rectHeight = this.windowHeight - 5;
    const rectWidth = this.windowWidth;
    return {
      x,
      y,
      rectWidth,
      rectHeight,
    };
  }

  createInnerWindowRectangle({ x, y, rectWidth, rectHeight }) {
    if (this.rect) {
      this.rect.setPosition(x + 1, y + 1);
      this.rect.setDisplaySize(rectWidth - 1, rectHeight - 1);

      // update the position of our mainContainer
      this.mainContainer.setPosition(x + 1, y + 1);
      this.mainContainer.setSize(rectWidth - 1, rectHeight - 1);

      // center the title text
      this.title.setPosition(
        this.mainContainer.width / 2,
        this.mainContainer.height / 2
      );

      // update mainContainer positions
      this.updateContainerPositions();
    } else {
      this.rect = this.scene.add.rectangle(
        x + 1,
        y + 1,
        rectWidth - 1,
        rectHeight - 1
      );
      if (this.debug) this.rect.setFillStyle(0x6666ff);
      this.rect.setOrigin(0, 0);

      // create mainContainer for positioning elements
      this.mainContainer = this.scene.add.container(x + 1, y + 1);
      this.mainContainer.setDepth(DEPTH.UI_POPUP);
      this.mainContainer.setAlpha(this.textAlpha);

      this.createSlots();
    }
  }

  updateContainerPositions() {
    this.mainContainer.setSize(this.mainContainer.width / 2, 40);
    for (let x = 0; x < 5; x += 1) {
      //this.inventorySlots[x].item.x = this.mainContainer.width * 0.1;
    }
  }

  createSlots() {
    const self = this
    this.slotsContainer = this.scene.add.container(0, 80);
    this.mainContainer.add(this.slotsContainer);
    this.itemsContainer = this.scene.add.container(0, 20);
    this.slotsContainer.add(this.itemsContainer);
    // create items title
    this.title = this.scene.add.text(
      this.mainContainer.width / 2,
      140,
      "Title",
      { fontSize: "22px", fill: "#ffffff", align: "center" }
    );
    this.title.setOrigin(0.5);

    this.slotsContainer.add(this.title);


    for (let x = 0; x < 5; x += 1) {
      const yPos = 0;
      const xPos = 90 * x;
      this.slots[x] = this.data.items[x];
      this.slots[x].itemImage = this.scene.add
        .image(90 + xPos, yPos, "iconset", this.data.items[x].frame)
        .setScale(3)
        .setInteractive()
        .setTint(0);
      this.itemsContainer.add(this.slots[x].itemImage);
    }

  }

  removeItem(itemNumber) {
    if (itemNumber >= 0) {
      this.playerObject.dropItem(this.selectedItemNumber);
      this.update(this.playerObject);
      this.hideWindow();
      this.showWindow(this.playerObject);
      this.unselectedItem();
    }
  }

  resize(gameSize) {
    if (gameSize.width < 750) {
      this.windowWidth = this.scene.scale.width - 80;
      this.windowHeight = this.scene.scale.height - 80;
    } else {
      this.windowWidth = this.scene.scale.width / 2;
      this.windowHeight = this.scene.scale.height * 0.8;
    }

    this.redrawWindow();
  }

  hideWindow() {
    this.unselectedItem();

    this.rect.disableInteractive();
    this.mainContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.mainContainer.setAlpha(1);
    this.graphics.setAlpha(1);

    // populate slots
    this.populateSlots(playerObject);
  }

  showSlots(itemNumber) {
    console.log("showSlots");
    //this.slots[itemNumber].item.setAlpha(1);
  }

  populateSlot(item, itemNumber) {
    console.log("updateSlots");
    // this.slots[itemNumber].id = item.id;
    // this.slots[itemNumber].item.setFrame(item.frame);
    // this.slots[itemNumber].itemName = item.name;
    // this.slots[itemNumber].attack = item.attackBonus;
    // this.slots[itemNumber].defense = item.defenseBonus;
    // this.slots[itemNumber].health = item.healthBonus;

    this.showSlots(itemNumber);
  }

  selectItem(item, x) {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
    }
    this.selectedItem = item;
    this.selectedItemNumber = x;
    this.selectedItem.item.setTint(0xff0000);
    this.showButtons();
  }

  unselectedItem() {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.selectedItemNumber = undefined;
      this.hideButtons();
    }
  }

  updateSlot() {
    if (this.selectedItem && this.playerObject) {
      this.playerObject.updateSlot(this.selectedItemNumber);
      this.unselectedItem();
      this.updateSlots(this.playerObject);
      this.hideWindow();
      this.showWindow(this.playerObject);
    }
  }

  showItemDescription(item) {
    this.scene.descriptionWindow.setItemDescription(item);
  }

  populateSlots(playerObjectList) {
    // populate slot items
    const keys = Object.keys(playerObjectList);
    for (let i = 0; i < keys.length; i += 1) {
      //this.populateSlot(playerObjectList[keys[i]], i);
    }
  }
}
