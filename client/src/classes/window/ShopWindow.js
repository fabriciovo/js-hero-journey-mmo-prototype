import { DEPTH, iconsetPotionsTypes } from "../../utils/utils";
import ModalWindow from "./ModalWindow";
import potionData from "../../../assets/Items/potions.json";
import UiButton from "../UI/UiButton";

export default class ShopWindow extends ModalWindow {
  constructor(scene, opts) {
    super(scene, opts);

    this.scene = scene;
    this.items = potionData.potions;
    this.playerObject = {};

    this.selectedItem = undefined;
    this.selectedItemNumber = undefined;
    this.graphics.setDepth(DEPTH.UI);
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
      this.shopContainer.setPosition(x + 1, y + 1);
      this.shopContainer.setSize(rectWidth - 1, rectHeight - 1);

      this.createshopText();
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
      this.shopContainer = this.scene.add.container(x + 1, y + 1);
      this.shopContainer.setDepth(DEPTH.UI);
      this.shopContainer.setAlpha(this.textAlpha);
      this.createShopText();
      this.createItems();
      this.createButtons();
    }
  }
  resize(gameSize) {
    this.redrawWindow();
  }

  hideWindow() {
    this.rect.disableInteractive();
    this.shopContainer.setAlpha(0);
    this.graphics.setAlpha(0);
  }

  showWindow(playerObject) {
    this.playerObject = playerObject;
    this.rect.setInteractive();
    this.shopContainer.setAlpha(1);
    this.graphics.setAlpha(1);
  }

  createShopText() {
    this.shopTitle = this.scene.add
      .text(this.shopContainer.width / 2, 140, "Shop", {
        fontSize: "22px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.shopText = this.scene.add
      .text(0, 0, "", {
        fontSize: "14px",
        fill: "#00ff00",
        align: "center",
      })
      .setOrigin(0.5);

    this.shopContainer.add(this.shopTitle);
    this.shopContainer.add(this.shopText);

    this.shopTitle.setPosition(this.shopContainer.width / 2 + 174, 20);
    this.shopText.setPosition(this.shopContainer.width / 2 + 180, 60);
  }

  showItemDescription(item) {
    this.scene.descriptionWindow.setShopItemDescription(item);
  }

  createItems() {
    for (let x = 0; x < 1; x += 1) {
      const yPos = this.shopContainer.height / 2 + 90;
      const xPos = 90 * x;
      this.items[x].item = this.scene.add
        .image(90 + xPos, yPos, "iconset", this.items[x].frame)
        .setInteractive({ cursor: "pointer" })
        .setScale(2);

      this.items[x].item.on("pointerdown", () => {
        this.selectItem(this.items[x], x);
      });

      this.items[x].item.on("pointerover", () => {
        this.showItemDescription(this.items[x]);
        this.scene.descriptionWindow.showWindow();
      });

      this.items[x].item.on("pointerout", () => {
        this.scene.descriptionWindow.hideWindow();
      });

      this.shopContainer.add(this.items[x].item);
    }
  }

  createButtons() {
    this.buyButton = new UiButton(
      this.scene,
      this.shopContainer.width / 2 + 90,
      this.shopContainer.height / 2 + 180,
      "buttons",
      6,
      7,
      "Buy",
      1.8,
      this.buyItem.bind(this, this.selectItem)
    );

    this.shopContainer.add(this.buyButton);

    this.hideButtons();
  }

  selectItem(item, x) {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
    }
    this.selectedItem = item;
    this.selectedItemNumber = x;
    this.selectedItem.item.setTint(0xff0000);
    this.showButtons();
  }

  unselectedItem() {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.selectedItemNumber = undefined;
      this.hideButtons();
    }
  }

  showButtons() {
    this.buyButton.setAlpha(1);
  }

  hideButtons() {
    if (!this.selectedItem) {
      this.buyButton.setAlpha(0);
    }
  }

  buyItem() {
    if (this.selectedItem && this.playerObject) {
      this.playerObject.buyItem(this.selectedItem);
    }
  }

  unselectedItem() {
    if (this.selectedItem) {
      this.selectedItem.item.setTint(0xffffff);
      this.selectedItem = undefined;
      this.selectedItemNumber = undefined;
      this.hideButtons();
    }
  }
}
