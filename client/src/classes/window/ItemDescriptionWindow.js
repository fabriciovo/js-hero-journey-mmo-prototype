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

      this.attackText = this.scene.add.text(
        0,
        0,
        "5",
        { fontSize: "14px", fill: "#00ff00" }
      );
      this.descriptionContainer.add(this.attackText);
      this.attackText.setPosition(this.descriptionContainer.width / 2, 20);
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
    this.graphics.setAlpha(0);
  }

  showWindow() {
    this.rect.setInteractive();
    this.graphics.setAlpha(1);
  }

  updateDescriptionContainer() {
    this.attackText.setText(this.textValue);
  }

  setItemDescription(item){
    console.log(item.attack);
    console.log(item.defense);
    console.log(item.health);
    console.log(item.type);
  }
}
