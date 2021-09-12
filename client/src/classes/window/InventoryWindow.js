import ModalWindow from "./ModalWindow";

export default class InventoryWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);
    
    this.playerObject = {};
    this.mainPlayer = false;
    this.InventoryItems = {};

    this.graphics.setDepth(3);
    this.createWindow();
    this.hideWindow();
  }
}
