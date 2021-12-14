import ModalWindow from "./ModalWindow";
import { DEPTH, iconsetSlotsTypes } from "../../utils/utils";

export default class SlotsWindow extends ModalWindow {
  constructor(scene, opts, data) {
    super(scene, opts);
    this.playerObject = {};
    this.slots = [];
    this.data = data;
    this.graphics.setDepth(DEPTH.UI);
    this.selectedItem = undefined;
    this.selectedItemNumber = undefined;
    this.createWindow();
    this.hideWindow();
  }

  calculateWindowDimension() {
    let x = this.x + this.scene.scale.width / 4 - 50;
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
      this.checkPlayersItem(this.slots,this.playerObject.weapons)
    } else {
      this.rect = this.scene.add.rectangle(
        x + 1,
        y + 1,
        rectWidth - 1,
        rectHeight - 1
      );
      if (this.debug) this.rect.setFillStyle(0x6666ff);
      this.rect.setOrigin(0, 0);
      this.rect.setDisplaySize(rectWidth - 1, rectHeight - 1);

      // create mainContainer for positioning elements
      this.mainContainer = this.scene.add.container(x + 1, y + 1);
      this.mainContainer.setDepth(DEPTH.UI);
      this.mainContainer.setAlpha(this.textAlpha);
      this.mainContainer.setPosition(x + 1, y + 1);

      this.mainContainer.setSize(rectWidth - 1, rectHeight - 1);
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
    this.slotsContainer = this.scene.add.container(0, 80);
    this.mainContainer.add(this.slotsContainer);

    //create items title
    this.title = this.scene.add.text(
      this.mainContainer.width / 2 - 40,
      -60,
      "Title",
      { fontSize: "22px", fill: "#ffffff", align: "center" }
    );

    this.slotsContainer.add(this.title);

    for (let x = 0; x < this.data.items.length; x += 1) {
      const yPos = 20;
      const xPos = 90 * x;
      this.slots[x] = this.data.items[x];

      this.slots[x].itemImage = this.scene.add
        .image(90 + xPos, yPos, "iconset", this.data.items[x].frame)
        .setScale(2)
        .setTint(0)
        .setInteractive();

      this.slots[x].slotImage = this.scene.add
        .image(90 + xPos, yPos, "iconset", iconsetSlotsTypes.SLOT_2)
        .setScale(3)
        .setInteractive();

      this.slots[x].itemImage.on("pointerover", () => {
        this.scene.descriptionWindow.showBookDescription(this.slots[x]);
        this.scene.descriptionWindow.showWindow();
      });

      this.slots[x].itemImage.on("pointerout", () => {
        this.scene.descriptionWindow.resetWindow();
        this.scene.descriptionWindow.hideWindow();
        
      });
      this.slotsContainer.add(this.slots[x].slotImage);
      this.slotsContainer.add(this.slots[x].itemImage);


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

    this.updateSlots(playerObject);

    this.checkPlayersItem(this.slots, this.playerObject.weapons);

    // check player items slots
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

  checkPlayersItem(data, playerItems) {
    playerItems.forEach((playerItem) => {
      data.forEach((item) => {
        if (playerItem.name === item.name) {
          item.itemImage.setTint(0xffffff);
          item.canEquip = true;
          item.slotImage.setInteractive({ cursor: "pointer" });
          item.itemImage.setInteractive({ cursor: "pointer" });
        }
      });
    });
  }


  updateSlots(playerObject) {
    // populate inventory items
    const keys = Object.keys(playerObject.weapons);
    for (let i = 0; i < keys.length; i += 1) {
      this.updateSlotItem(playerObject.weapons[keys[i]], i);
    }
  }

  updateSlotItem(item, itemNumber) {
    this.slots[itemNumber].id = item.id;
    this.slots[itemNumber].itemImage.setFrame(item.frame);

    this.showSlotItem(itemNumber);
  }

  showSlotItem(itemNumber) {
    this.slots[itemNumber].itemImage.setAlpha(1);
    this.slots[itemNumber].slotImage.setAlpha(1);

  }
}
