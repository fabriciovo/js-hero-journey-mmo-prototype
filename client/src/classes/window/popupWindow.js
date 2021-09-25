import ModalWindow from "./ModalWindow";

export default class PopupWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.scene = scene;
    this.graphics.setDepth(5);
    this.createWindow();
    this.hideWindow();

  }
  calculateWindowDimension() {
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

      // update the position of our inventory container
      this.popupContainer.setPosition(x + 1, y + 1);
      this.popupContainer.setSize(rectWidth - 1, rectHeight - 1);

      this.createPopupText();
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
      this.popupContainer = this.scene.add.container(x + 1, y + 1);
      this.popupContainer.setDepth(5);
      this.popupContainer.setAlpha(this.textAlpha);
      this.createPopupText();

    }
  }
  resize(gameSize) {
    this.redrawWindow();
  }

  hideWindow() {
    this.rect.disableInteractive();
    this.popupContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow() {
    this.rect.setInteractive();
    this.popupContainer.setAlpha(1);
    this.graphics.setAlpha(1);
  }

  updatePopupContainer() {
    this.popupText.setText(this.textValue);
  }

  createPopupText() {
    this.popupTitle = this.scene.add.text(
      this.popupContainer.width / 2,
      140,
      "PopUp",
      { fontSize: "22px", fill: "#ffffff", align: "center" }
    ).setOrigin(0.5);

   
    this.popupText = this.scene.add.text(0, 0, "", {
      fontSize: "14px",
      fill: "#00ff00",
      align: 'center',
    }).setOrigin(0.5);

    this.popupContainer.add(this.popupTitle);
    this.popupContainer.add(this.popupText);


    this.popupTitle.setPosition(this.popupContainer.width / 2 + 174, 20);
    this.popupText.setPosition(this.popupContainer.width / 2 + 180, 60);

  }

  equipmentFull(){
    this.popupText.setText("Your equipment slots is full")
  }

  levelUp(playerObject){
    let oldLevel = playerObject.level;
    this.showWindow();
    this.popupTitle.setText("Level Up")
    this.popupText.setText(`You advance from ${oldLevel--} to ${playerObject.level}`)

  }
}
