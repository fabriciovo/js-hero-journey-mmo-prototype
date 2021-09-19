import ModalWindow from "./ModalWindow";
export default class PlayerWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.playerObject = {};
    this.mainPlayer = false;
    this.inventoryItems = {};
    this.graphics.setDepth(3);
    this.createWindow();
    this.hideWindow();
 
  
  }

  calculateWindowDimension() {
    let x = this.x + this.scene.scale.width / 4;
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
      this.titleText.setPosition(this.inventoryContainer.width / 2, 20);
      this.itemsText.setPosition(this.inventoryContainer.width / 2, 140);

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

      // create inventory title
      this.titleText = this.scene.add.text(
        this.inventoryContainer.width / 2,
        20,
        "Player Stats",
        { fontSize: "22px", fill: "#ffffff", align: "center" }
      );
      this.titleText.setOrigin(0.5);
      this.inventoryContainer.add(this.titleText);

      // create inventory stats
      this.createInventoryStats();

    }
  }

  createInventoryStats() {
    this.statsContainer = this.scene.add.container(0, 80);
    this.inventoryContainer.add(this.statsContainer);

    const textOptions = {
      fontSize: "22px",
      fill: "#ffffff",
    };

    // create attack stats information
    this.swordIcon = this.scene.add.image(0, 0, "inventorySword").setScale(1.5);
    this.statsContainer.add(this.swordIcon);
    this.swordStatText = this.scene.add.text(0, 0, "100", textOptions);
    this.statsContainer.add(this.swordStatText);

    // create defense stats information
    this.shieldIcon = this.scene.add
      .image(90, 0, "inventoryShield")
      .setScale(1.5);
    this.statsContainer.add(this.shieldIcon);
    this.shieldStatText = this.scene.add.text(90, 0, "100", textOptions);
    this.statsContainer.add(this.shieldStatText);

    // create gold stats information
    this.goldIcon = this.scene.add.image(180, 0, "inventoryGold").setScale(1.5);
    this.statsContainer.add(this.goldIcon);
    this.goldStatText = this.scene.add.text(180, 0, "100", textOptions);
    this.statsContainer.add(this.goldStatText);
  }

  updateInventoryContainerPositions() {
    this.inventoryContainer.setSize(this.inventoryContainer.width - 40, 80);
    this.swordIcon.x = this.inventoryContainer.width * 0.1;
    this.swordStatText.x = this.inventoryContainer.width * 0.1 + 30;
    this.shieldIcon.x = this.inventoryContainer.width * 0.5;
    this.shieldStatText.x = this.inventoryContainer.width * 0.5 + 30;
    this.goldIcon.x = this.inventoryContainer.width * 0.85;
    this.goldStatText.x = this.inventoryContainer.width * 0.85 + 30;

    // for (let x = 0; x < 5; x += 1) {
    //   this.inventoryItems[x].item.x = this.inventoryContainer.width * 0.1;
    //   this.inventoryItems[x].discardButton.x = this.inventoryContainer.width;
    //   this.inventoryItems[x].itemName.x = this.inventoryContainer.width * 0.18;
    //   this.inventoryItems[x].attackIcon.x = this.inventoryContainer.width * 0.5;
    //   this.inventoryItems[x].defenseIcon.x =
    //     this.inventoryContainer.width * 0.65;
    //   this.inventoryItems[x].healthIcon.x = this.inventoryContainer.width * 0.8;
    //   this.inventoryItems[x].attackIconText.x =
    //     this.inventoryContainer.width * 0.5 + 15;
    //   this.inventoryItems[x].defenseIconText.x =
    //     this.inventoryContainer.width * 0.65 + 15;
    //   this.inventoryItems[x].healthIconText.x =
    //     this.inventoryContainer.width * 0.8 + 15;
    // }
  }

  createInventorySlots() {

    
  }

  removeItem(itemNumber) {
   
  }

  createInventoryItems() {
    
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
    this.rect.disableInteractive();
    this.inventoryContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    this.mainPlayer = true;
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.inventoryContainer.setAlpha(1);
    this.graphics.setAlpha(1);

    // update player stats
    this.swordStatText.setText(playerObject.attackValue);
    this.shieldStatText.setText(playerObject.defenseValue);
    this.goldStatText.setText(playerObject.gold);

  }

  hideInventoryItem(itemNumber) {

  }

  showInventoryItem(itemNumber) {

  }

  updateInventoryItem(item, itemNumber) {

  }

  showItemDescription(item){
    console.log(item.attackIconText)
  }
}
