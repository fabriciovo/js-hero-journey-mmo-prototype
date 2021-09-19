import ModalWindow from "./ModalWindow";
export default class PlayerWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.playerObject = {};
    this.mainPlayer = false;
    this.equipedItems = {};
    this.graphics.setDepth(3);
    this.createWindow();
    this.hideWindow();
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
      this.statsContainer.setDepth(3);
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

      // create inventory stats
      this.createInventoryStats();
      this.createEquipmentSlots();
    }
  }

  createInventoryStats() {
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
      //this.windowWidth = this.scene.scale.width - 80;
      this.windowHeight = this.scene.scale.height - 80;
    } else {
      //this.windowWidth = this.scene.scale.width / 2;
      this.windowHeight = this.scene.scale.height * 0.8;
    }

    this.redrawWindow();
  }

  hideWindow() {
    this.rect.disableInteractive();
    this.statsContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    console.log(playerObject);
    this.mainPlayer = true;
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.statsContainer.setAlpha(1);
    this.graphics.setAlpha(1);

    // update player stats
    this.updatePlayerStats(playerObject);
  }

  createEquipmentSlots() {
    for (let x = 0; x < 5; x += 1) {
      const yPos = 0;
      const xPos = 40 * x;

    }
  }

  hideInventoryItem(itemNumber) {}

  showInventoryItem(itemNumber) {}

  updatePlayerStats(playerObject) {
    console.log(playerObject);
    this.swordStatText.setText(playerObject.attackValue);
    this.shieldStatText.setText(playerObject.defenseValue);
    this.goldStatText.setText(playerObject.gold);
  }

}
