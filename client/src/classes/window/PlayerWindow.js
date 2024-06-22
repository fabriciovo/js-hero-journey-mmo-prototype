import { DEPTH } from "../../utils/utils";
import ModalWindow from "./ModalWindow";
export default class PlayerWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.playerObject = {};
    this.mainPlayer = false;
    this.equipedItems = {};
    this.playerSlots = {};
    this.graphics.setDepth(DEPTH.UI);
    this.createWindow();
    this.hideWindow();
    this.selectedItem = undefined;
    this.selectedItemNumber = undefined;
  }

  calculateWindowDimension() {
    let x = this.x + this.scene.scale.width / 9;
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

      // update the position of our inventory container
      this.statsContainer.setPosition(x + 1, y + 1);
      this.statsContainer.setSize(rectWidth - 1, rectHeight - 1);

      // center the title text
      this.titleText.setPosition(this.statsContainer.width / 2, 20);

      // update inventory container positions
      this.updateStatsContainerPositions();
    } else {
      this.rect = this.scene.add.rectangle(
        x + 1,
        y + 1,
        rectWidth - 1,
        rectHeight - 1
      );
      if (this.debug) this.rect.setFillStyle(0x6666ff);
      this.rect.setOrigin(0, 0);

      // create inventory container for positioning elements
      this.statsContainer = this.scene.add.container(x + 1, y + 1);
      this.statsContainer.setDepth(DEPTH.UI);
      this.statsContainer.setAlpha(this.textAlpha);

      // create inventory title
      this.titleText = this.scene.add.text(
        this.statsContainer.width / 2 + 200,
        20,
        "Stats",
        { fontSize: "22px", fill: "#ffffff", align: "center" }
      );
      this.titleText.setOrigin(0.5);
      this.statsContainer.add(this.titleText);

      // create Equipment stats
      this.createEquipmentStats();
      this.createEquipmentButtons();
      this.createEquipmentSlots();
    }
  }

  createEquipmentStats() {
    const textOptions = {
      fontSize: "22px",
      fill: "#ffffff",
    };

    // create attack stats information
    this.swordIcon = this.scene.add
      .image(90, this.scene.scale.height / 2 + 240, "inventorySword")
      .setScale(1.5);
    this.statsContainer.add(this.swordIcon);
    this.swordStatText = this.scene.add.text(
      90,
      this.scene.scale.height / 2 + 240,
      "100",
      textOptions
    );
    this.statsContainer.add(this.swordStatText);

    // create defense stats information
    this.shieldIcon = this.scene.add
      .image(180, this.scene.scale.height / 2 + 240, "inventoryShield")
      .setScale(1.5);
    this.statsContainer.add(this.shieldIcon);
    this.shieldStatText = this.scene.add.text(
      180,
      this.scene.scale.height / 2 + 240,
      "100",
      textOptions
    );
    this.statsContainer.add(this.shieldStatText);

    // create gold stats information
    this.goldIcon = this.scene.add
      .image(270, this.scene.scale.height / 2 + 240, "inventoryGold")
      .setScale(1.5);
    this.statsContainer.add(this.goldIcon);
    this.goldStatText = this.scene.add.text(
      290,
      this.scene.scale.height / 2 + 240,
      "100",
      textOptions
    );
    this.statsContainer.add(this.goldStatText);
  }

  updateStatsContainerPositions() {
    this.statsContainer.setSize(this.statsContainer.width - 40, 80);
    this.swordIcon.x = this.statsContainer.width * 0.1;
    this.swordStatText.x = this.statsContainer.width * 0.1 + 30;
    this.shieldIcon.x = this.statsContainer.width * 0.5;
    this.shieldStatText.x = this.statsContainer.width * 0.5 + 30;
    this.goldIcon.x = this.statsContainer.width * 0.85;
    this.goldStatText.x = this.statsContainer.width * 0.85 + 30;
  }

  resize(gameSize) {
    if (gameSize.width < 750) {
      this.windowWidth = this.scene.scale.width / 2;
      this.windowHeight = this.scene.scale.height - 80;
    } else {
      this.windowWidth = this.scene.scale.width / 5;
      this.windowHeight = this.scene.scale.height * 0.8;
    }

    this.redrawWindow();
  }

  hideWindow() {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.selectedItemNumber = undefined;
    }
    this.rect.disableInteractive();
    this.statsContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    console.log("adadsds");
    this.mainPlayer = true;
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.statsContainer.setAlpha(1);
    this.graphics.setAlpha(1);

    // hide inventory items that are not needed
    for (let i = Object.keys(playerObject.equipedItems).length; i < 5; i += 1) {
      this.hideEquipmentItem(i);
    }

    // update player stats
    this.updatePlayerStats(playerObject);
    this.updateEquipment(playerObject);
  }

  createEquipmentButtons() {
    this.removeItemButton = this.scene.add
      .image(
        this.statsContainer.width / 4 + 200,
        this.statsContainer.height / 2 + 200,
        "inventoryRemove",
        0
      )
      .setScale(0.1)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.statsContainer.add(this.removeItemButton);

    this.removeItemButton.on("pointerdown", () => {
      this.removeItem(this.selectedItemNumber);
    });
  }

  createEquipmentSlots() {
    for (let x = 0; x < 5; x += 1) {
      const yPos = this.statsContainer.height / 2 + 300;
      const xPos = 50 * x;

      //create inventory item icon
      this.equipedItems[x] = {};
      this.equipedItems[x].item = this.scene.add
        .image(xPos + 90, yPos, "iconset", 0)
        .setScale(2)
        .setInteractive({ cursor: "pointer" });

      this.statsContainer.add(this.equipedItems[x].item);

      //items button
      this.equipedItems[x].item.on("pointerdown", () => {
        this.selectItem(this.equipedItems[x], x);
      });
      this.equipedItems[x].item.on("pointerover", () => {
        this.showItemDescription(this.equipedItems[x]);
        this.scene.descriptionWindow.showWindow();
      });

      this.equipedItems[x].item.on("pointerout", () => {
        this.scene.descriptionWindow.hideWindow();
      });
    }
  }

  hideEquipmentItem(itemNumber) {
    this.equipedItems[itemNumber].item.setAlpha(0);
  }

  showEquipmentItem(itemNumber) {
    this.equipedItems[itemNumber].item.setAlpha(1);
  }

  removeItem(itemNumber) {
    if (itemNumber >= 0) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.playerObject.unequipItem(itemNumber);
      this.updateEquipment(this.playerObject);
      this.showWindow(this.playerObject);
      this.selectedItemNumber = undefined;
    }
  }

  updatePlayerStats(playerObject) {
    this.swordStatText.setText(playerObject.attackValue);
    this.shieldStatText.setText(playerObject.defenseValue);
    this.goldStatText.setText(playerObject.gold);
    this.updateEquipment(playerObject);
  }

  updateEquipment(playerObject) {
    // populate equipment items
    const keys = Object.keys(playerObject.equipedItems);
    for (let i = 0; i < keys.length; i += 1) {
      this.updateEquipmentItem(playerObject.equipedItems[keys[i]], i);
    }
  }

  updateEquipmentItem(item, itemNumber) {
    this.equipedItems[itemNumber].id = item.id;
    this.equipedItems[itemNumber].item.setFrame(item.frame);
    this.equipedItems[itemNumber].itemName = item.name;
    this.equipedItems[itemNumber].attack = item.attackBonus;
    this.equipedItems[itemNumber].defense = item.defenseBonus;
    this.equipedItems[itemNumber].health = item.healthBonus;

    this.showEquipmentItem(itemNumber);
  }

  selectItem(item, x) {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
    }
    this.selectedItem = item;
    this.selectedItemNumber = x;
    this.selectedItem.item.setTint(0xff0000);
  }

  showItemDescription(item) {
    this.scene.descriptionWindow.setItemDescription(item);
  }
}
