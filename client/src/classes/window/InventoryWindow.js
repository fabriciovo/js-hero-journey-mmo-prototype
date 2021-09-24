import ModalWindow from "./ModalWindow";
import UiButton from "../UiButton";
export default class InventoryWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.playerObject = {};
    this.inventoryItems = {};
    this.inventorySlots = {};
    this.graphics.setDepth(3);
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

      // update the position of our inventory container
      this.inventoryContainer.setPosition(x + 1, y + 1);
      this.inventoryContainer.setSize(rectWidth - 1, rectHeight - 1);

      // center the title text
      this.itemsText.setPosition(this.inventoryContainer.width / 2, 20);

      // update inventory container positions
      this.updateInventoryContainerPositions();
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
      this.inventoryContainer = this.scene.add.container(x + 1, y + 1);
      this.inventoryContainer.setDepth(3);
      this.inventoryContainer.setAlpha(this.textAlpha);

      // create inventory slots
      this.createInventorySlots();

      //create Inventory Buttons
      this.createInventoryButtons();
    }
  }

  updateInventoryContainerPositions() {
    this.inventoryContainer.setSize(this.inventoryContainer.width - 40, 80);
    for (let x = 0; x < 5; x += 1) {
      //this.inventorySlots[x].item.x = this.inventoryContainer.width * 0.1;
      //this.inventoryItems[x].item.x = this.inventoryContainer.width * 0.1;
      // this.inventoryItems[x].discardButton.x = this.inventoryContainer.width;
      // this.inventoryItems[x].itemName.x = this.inventoryContainer.width * 0.18;
      // this.inventoryItems[x].attackIcon.x = this.inventoryContainer.width * 0.5;
      // this.inventoryItems[x].defenseIcon.x =
      //   this.inventoryContainer.width * 0.65;
      // this.inventoryItems[x].healthIcon.x = this.inventoryContainer.width * 0.8;
      // this.inventoryItems[x].attackIconText.x =
      //   this.inventoryContainer.width * 0.5 + 15;
      // this.inventoryItems[x].defenseIconText.x =
      //   this.inventoryContainer.width * 0.65 + 15;
      // this.inventoryItems[x].healthIconText.x =
      //   this.inventoryContainer.width * 0.8 + 15;
    }
  }

  createInventorySlots() {
    this.statsContainer = this.scene.add.container(0, 80);
    this.inventoryContainer.add(this.statsContainer);

    // create items title
    this.itemsText = this.scene.add.text(
      this.inventoryContainer.width / 2,
      140,
      "Inventory",
      { fontSize: "22px", fill: "#ffffff", align: "center" }
    );
    this.itemsText.setOrigin(0.5);

    this.inventoryContainer.add(this.itemsText);

    // create containter
    this.itemsContainer = this.scene.add.container(0, 20);
    this.statsContainer.add(this.itemsContainer);
    this.createInventoryItems();
  }

  removeItem(itemNumber) {
    if (itemNumber >= 0) {
      this.playerObject.dropItem(this.selectedItemNumber);
      this.updateInventory(this.playerObject);
      this.hideWindow();
      this.showWindow(this.playerObject);
      this.unselectedItem();
    }
  }

  createInventoryItems() {
    // for (let x = 0; x < 10; x += 1) {
    //   const yPos = 0;
    //   const xPos = 90 * x;
    //   this.inventoryItems[x] = {};
    //   this.inventoryItems[x].item = this.scene.add
    //     .image(90+xPos, yPos, "slot", 0)
    //     .setScale(2)
    //     .setInteractive();
    //     this.itemsContainer.add(this.inventoryItems[x].item);

    //   }

    // for (let x = 0; x < 5; x += 1) {
    //   const yPos = 0 + 55 * x;
    //   this.inventoryItems[x] = {};
    //   this.inventoryItems[x].item = this.scene.add
    //     .image(0, yPos, "slot", 0)
    //     .setScale(1.5)
    //     .setInteractive();
    //     this.itemsContainer.add(this.inventoryItems[x].item);

    //   }

    /*
      // create inventory item icon
      this.inventoryItems[x] = {};

      this.inventoryItems[x].item = this.scene.add
        .image(0, yPos, "tools", 2)
        .setScale(1.5)
        .setInteractive();

      this.itemsContainer.add(this.inventoryItems[x].item);

      this.inventoryItems[x].item.on("pointerover", () => {
        this.showItemDescription(this.inventoryItems[x]);
        this.scene.descriptionWindow.showWindow();
      });

      this.inventoryItems[x].item.on("pointerout", () => {
        console.log("adasdas");
        console.log(this.inventoryItems[x].item);

        this.scene.descriptionWindow.hideWindow();
      });

      // create discard item button
      this.inventoryItems[x].discardButton = this.scene.add
        .image(0, yPos, "inventoryRemove")
        .setScale(0.75)
        .setInteractive();
      this.itemsContainer.add(this.inventoryItems[x].discardButton);
      this.inventoryItems[x].discardButton.on("pointerdown", () => {
        this.removeItem(x);
      });

      // create item name text
      this.inventoryItems[x].itemName = this.scene.add.text(
        0,
        yPos - 10,
        "Item 1 Name",
        { fontSize: "14px", fill: "#ffffff" }
      );
      this.itemsContainer.add(this.inventoryItems[x].itemName);

      // create item stats icons
      this.inventoryItems[x].attackIcon = this.scene.add
        .image(0, yPos, "inventorySword")
        .setScale(0.75);
      this.inventoryItems[x].defenseIcon = this.scene.add
        .image(0, yPos, "inventoryShield")
        .setScale(0.75);
      this.inventoryItems[x].healthIcon = this.scene.add
        .image(0, yPos, "inventoryHeart")
        .setScale(0.75);
      this.itemsContainer.add(this.inventoryItems[x].attackIcon);
      this.itemsContainer.add(this.inventoryItems[x].defenseIcon);
      this.itemsContainer.add(this.inventoryItems[x].healthIcon);

      // create items stats text
      this.inventoryItems[x].attackIconText = this.scene.add.text(
        0,
        yPos - 10,
        "5",
        { fontSize: "14px", fill: "#00ff00" }
      );
      this.inventoryItems[x].defenseIconText = this.scene.add.text(
        0,
        yPos - 10,
        "10",
        { fontSize: "14px", fill: "#00ff00" }
      );
      this.inventoryItems[x].healthIconText = this.scene.add.text(
        0,
        yPos - 10,
        "-5",
        {         S fontSize: "14px", fill: "#ff0000" }
      );
      this.itemsContainer.add(this.inventoryItems[x].attackIconText);
      this.itemsContainer.add(this.inventoryItems[x].defenseIconText);
      this.itemsContainer.add(this.inventoryItems[x].healthIconText);
    }
    */

    for (let x = 0; x < 5; x += 1) {
      const yPos = 0;
      const xPos = 90 * x;
      this.inventorySlots[x] = {};
      this.inventorySlots[x].item = this.scene.add
        .image(90 + xPos, yPos, "slot", 0)
        .setScale(3)
        .setInteractive();
      this.itemsContainer.add(this.inventorySlots[x].item);
    }

    for (let x = 0; x < 5; x += 1) {
      const yPos = 90 * x;
      const xPos = 90 * x;

      //create inventory item icon
      this.inventoryItems[x] = {};
      this.inventoryItems[x].item = this.scene.add
        .image(xPos + 90, 0, "tools", 0)
        .setScale(2)
        .setInteractive({ cursor: "pointer" });

      this.itemsContainer.add(this.inventoryItems[x].item);

      this.inventoryItems[x].item.on("pointerdown", () => {
        this.selectItem(this.inventoryItems[x], x);
      });

      this.inventoryItems[x].item.on("pointerover", () => {
        this.showItemDescription(this.inventoryItems[x]);
        this.scene.descriptionWindow.showWindow();
      });

      this.inventoryItems[x].item.on("pointerout", () => {
        this.scene.descriptionWindow.hideWindow();
      });

      //items button
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
    this.inventoryContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.inventoryContainer.setAlpha(1);
    this.graphics.setAlpha(1);

    // hide inventory items that are not needed
    for (let i = Object.keys(playerObject.items).length; i < 5; i += 1) {
      this.hideInventoryItem(i);
    }

    // populate inventory items
    this.updateInventory(playerObject);
  }

  hideInventoryItem(itemNumber) {
    this.inventoryItems[itemNumber].item.setAlpha(0);
    // this.inventoryItems[itemNumber].discardButton.setAlpha(0);
    // this.inventoryItems[itemNumber].itemName.setAlpha(0);
    // this.inventoryItems[itemNumber].attackIcon.setAlpha(0);
    // this.inventoryItems[itemNumber].attackIconText.setAlpha(0);
    // this.inventoryItems[itemNumber].defenseIcon.setAlpha(0);
    // this.inventoryItems[itemNumber].defenseIconText.setAlpha(0);
    // this.inventoryItems[itemNumber].healthIcon.setAlpha(0);
    // this.inventoryItems[itemNumber].healthIconText.setAlpha(0);
  }

  showInventoryItem(itemNumber) {
    this.inventoryItems[itemNumber].item.setAlpha(1);
    // this.inventoryItems[itemNumber].itemName.setAlpha(1);
    // this.inventoryItems[itemNumber].attackIcon.setAlpha(1);
    // this.inventoryItems[itemNumber].attackIconText.setAlpha(1);
    // this.inventoryItems[itemNumber].defenseIcon.setAlpha(1);
    // this.inventoryItems[itemNumber].defenseIconText.setAlpha(1);
    // this.inventoryItems[itemNumber].healthIcon.setAlpha(1);
    // this.inventoryItems[itemNumber].healthIconText.setAlpha(1);
    // if (this.mainPlayer) {
    //   this.inventoryItems[itemNumber].discardButton.setAlpha(1);
    // } else {
    //   this.inventoryItems[itemNumber].discardButton.setAlpha(0);
    // }
  }

  updateInventoryItem(item, itemNumber) {
    this.inventoryItems[itemNumber].id = item.id;
    this.inventoryItems[itemNumber].item.setFrame(item.frame);
    this.inventoryItems[itemNumber].itemName = item.name;
    this.inventoryItems[itemNumber].attack = item.attackBonus;
    this.inventoryItems[itemNumber].defense = item.defenseBonus;
    this.inventoryItems[itemNumber].health = item.healthBonus;

    this.showInventoryItem(itemNumber);
  }

  selectItem(item, x) {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
    }
    this.selectedItem = item;
    this.selectedItemNumber = x;
    this.selectedItem.item.setTint(0xff0000);
    this.showItemButtons();
  }

  unselectedItem() {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.selectedItemNumber = undefined;
      this.hideItemButtons();
    }
  }

  hideItemButtons() {
    if (!this.selectedItem) {
      this.equipButton.disableInteractive();
      this.equipButton.setAlpha(0);
    }
  }

  showItemButtons() {
    this.equipButton.setInteractive({ cursor: "pointer" });
    this.equipButton.setAlpha(1);
  }

  equipItem() {
    if (this.selectedItem && this.playerObject) {
      this.playerObject.equipItem(this.selectedItemNumber);
      this.unselectedItem();
      this.updateInventory(this.playerObject);
      this.hideWindow();
      this.showWindow(this.playerObject);
    }
  }

  showItemDescription(item) {
    this.scene.descriptionWindow.setItemDescription(item);
  }

  createInventoryButtons() {
    this.equipButton = this.scene.add
      .image(
        this.scene.scale.width / 4 - 200,
        this.scene.scale.height / 2 + 200,
        "inventoryEquip",
        0
      )
      .setScale(0.1)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.discardButton = this.scene.add
      .image(
        this.scene.scale.width / 4 + 200,
        this.scene.scale.height / 2 + 200,
        "inventoryRemove",
        0
      )
      .setScale(0.1)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.inventoryContainer.add(this.equipButton);
    this.inventoryContainer.add(this.discardButton);

    this.discardButton.on("pointerdown", () => {
      console.log(this.selectedItemNumber);
      this.removeItem(this.selectedItemNumber);
    });

    this.equipButton.on("pointerdown", () => {
      this.equipItem();
    });

    this.hideItemButtons();
  }

  updateInventory(playerObject) {
    // populate inventory items
    const keys = Object.keys(playerObject.items);
    for (let i = 0; i < keys.length; i += 1) {
      this.updateInventoryItem(playerObject.items[keys[i]], i);
    }
  }
}
