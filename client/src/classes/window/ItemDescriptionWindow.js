import ModalWindow from "./ModalWindow";

export default class ItemDescriptionWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.scene = scene;
    this.graphics.setDepth(4);
    this.createWindow();
    this.hideWindow();
  }
  calculateWindowDimension() {
    const x = 0;
    const y = 0;
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
      this.descriptionContainer.setPosition(x + 1, y + 1);
      this.descriptionContainer.setSize(rectWidth - 1, rectHeight - 1);

      this.createItemDescriptionText();
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
      this.descriptionContainer = this.scene.add.container(x + 1, y + 1);
      this.descriptionContainer.setDepth(4);
      this.descriptionContainer.setAlpha(this.textAlpha);
    }
  }
  resize(gameSize) {
    this.redrawWindow();
  }

  hideWindow() {
    this.rect.disableInteractive();
    this.descriptionContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow() {
    this.rect.setInteractive();
    this.descriptionContainer.setAlpha(1);
    this.graphics.setAlpha(1);
  }

  updateDescriptionContainer() {
    this.attackText.setText(this.textValue);
  }

  createItemDescriptionText() {
    this.itemsText = this.scene.add.text(
      this.descriptionContainer.width / 2,
      140,
      "Item Description",
      { fontSize: "22px", fill: "#ffffff", align: "center" }
    );
    this.itemsText.setOrigin(0.5);

    this.attackText = this.scene.add.text(0, 0, "", {
      fontSize: "14px",
      fill: "#00ff00",
      align: 'center',
    }).setOrigin(0.5);

    this.defenseText = this.scene.add.text(0, 0, "", {
      fontSize: "14px",
      fill: "#00ff00",
      align: 'center',

    }).setOrigin(0.5);

    this.healthText = this.scene.add.text(0, 0, "", {
      fontSize: "14px",
      fill: "#00ff00",
      align: 'center',

    }).setOrigin(0.5);
    this.healthIcon = this.scene.add
      .image(0, 0, "inventoryHealth")
      .setOrigin(.5);

    this.swordIcon = this.scene.add.image(0, 0, "inventorySword").setOrigin(.5);

    this.shieldIcon = this.scene.add
      .image(0, 0, "inventoryShield")
      .setOrigin(.5);

    this.descriptionContainer.add(this.itemsText);
    this.descriptionContainer.add(this.attackText);
    this.descriptionContainer.add(this.healthText);
    this.descriptionContainer.add(this.defenseText);

    this.descriptionContainer.add(this.healthIcon);
    this.descriptionContainer.add(this.swordIcon);
    this.descriptionContainer.add(this.shieldIcon);

    this.itemsText.setPosition(this.descriptionContainer.width / 2, 20);
    this.attackText.setPosition(this.descriptionContainer.width / 2 - 90, 60);
    this.healthText.setPosition(this.descriptionContainer.width / 2 + 90, 60);
    this.defenseText.setPosition(this.descriptionContainer.width / 2, 60);

    this.healthIcon.setPosition(this.descriptionContainer.width / 2 - 90, 90);
    this.swordIcon.setPosition(this.descriptionContainer.width / 2 + 90, 90);
    this.shieldIcon.setPosition(this.descriptionContainer.width / 2, 90);
  }

  setItemDescription(item) {
    if (item.attack > 0) {
      this.attackText.setFill("#00ff00");
    } else {
      this.attackText.setFill("#ff0000");
    }
    if (item.defense > 0) {
      this.defenseText.setFill("#00ff00");
    } else {
      this.defenseText.setFill("#ff0000");
    }
    if (item.health > 0) {
      this.healthText.setFill("#00ff00");
    } else {
      this.healthText.setFill("#ff0000");
    }
    this.attackText.setText(item.type);
    this.attackText.setText(item.attack);
    this.defenseText.setText(item.defense);
    this.healthText.setText(item.health);
  }
}
