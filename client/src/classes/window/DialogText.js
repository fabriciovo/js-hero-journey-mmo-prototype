import { createInputField } from "../../utils/utils";
import ModalWindow from "./ModalWindow";

export default class DialogText extends ModalWindow {
  constructor(scene, opts, text) {
    super(scene, opts);

    this.scene = scene;
    this.text = text;
    this.graphics.setDepth(2);
    this.createWindow();
  }

  createWindow() {
    const windowDimensions = this.calculateWindowDimension();
    this.createOuterWindow(windowDimensions);
    this.createInnerWindow(windowDimensions);
    this.createInnerWindowRectangle(windowDimensions);
  }

  calculateWindowDimension() {
    const x =
      this.x - this.windowWidth - 2 + this.scene.cameras.main.worldView.x;
    const y = this.y + 2 + this.scene.cameras.main.worldView.y;
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
      this.rect.setPosition(200 + 1, 200 + 1);
      this.rect.setDisplaySize(rectWidth - 1, rectHeight - 1);

    } else {
      this.rect = this.scene.add.rectangle(
        200 + 1,
        200 + 1,
        rectWidth - 1,
        rectHeight - 1
      );
      if (this.debug) this.rect.setFillStyle(0x6666ff);
      this.rect.setOrigin(0, 0);
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
}
