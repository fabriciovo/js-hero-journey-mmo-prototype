import ModalWindow from "./ModalWindow";

export default class ItemDescriptionWindow extends ModalWindow {
  constructor(scene, opts, text) {
    super(scene, opts);

    this.scene = scene;
    this.text = text;
    this.graphics.setDepth(4);
    this.createWindow();
    this.hideWindow();
  }
  calculateWindowDimension() {

    this.x = this.scene.gameScene.input.mousePointer.x;
    this.y = this.scene.gameScene.input.mousePointer.y;

    if (this.scene.scale.width < 750) {
      this.x + 40;
      this.y + 40;
    }
    const x = this.x;
    const y = this.y;
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
    } else {
      this.rect = this.scene.add.rectangle(
        x + 1,
        y + 1,
        rectWidth - 1,
        rectHeight - 1
      );
      if (this.debug) this.rect.setFillStyle(0x6666ff);
      this.rect.setOrigin(0, 0);
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
}
