import * as Phaser from "phaser";
import InventoryWindow from "../classes/window/InventoryWindow";

export default class UiSceneMobile extends Phaser.Scene {
  constructor() {
    super("UiMobile");
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get("Game");
    this.showInventory = false;
  }

  create() {
    this.setupUiElements();
    this.setupEvents();

    // handle game resize
    this.scale.on("resize", this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  setupUiElements() {
    // create the score text game object
    this.scoreText = this.add.text(35, 8, "Coins: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    // create coin icon
    this.coinIcon = this.add.image(15, 15, "items", 3);

    // create inventory modal
    this.inventoryWindow = new InventoryWindow(this, {
      windowWidth: this.scale.width / 2,
      windowHeight: this.scale.height / 2,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
    });

    //Chat
    this.chatController =true;

    //create equiped weapons icons

    this.moveDown = this.add
      .image(90, this.scale.height - 50, "up")
      .setInteractive();

    this.moveUp = this.add
      .image(90, this.scale.height - 100, "down")
      .setInteractive();

    this.moveLeft = this.add
      .image(40, this.scale.height - 75, "left")
      .setInteractive();

    this.moveRight = this.add
      .image(140, this.scale.height - 75, "right")
      .setInteractive();

    this.mobileActionA = this.add
      .image(this.scale.width * .9, this.scale.height - 50, "iconset", 3)
      .setInteractive();

    this.chatButton = this.add
      .image(this.scale.width * .7, this.scale.height - 50, "chatbutton")
      .setInteractive();

    this.moveUp.setScale(2);
    this.moveDown.setScale(2);

    this.moveLeft.setScale(2);
    this.moveRight.setScale(2);

    this.mobileActionA.setScale(2);

    this.moveUp.on("pointerover", () => {
      this.gameScene.player.mobileUp = true;
    });

    this.moveUp.on("pointerout", () => {
      this.gameScene.player.mobileUp = false;
    });

    this.moveDown.on("pointerover", () => {
      this.gameScene.player.mobileDown = true;
    });

    this.moveDown.on("pointerout", () => {
      this.gameScene.player.mobileDown = false;
    });

    this.moveLeft.on("pointerover", () => {
      this.gameScene.player.mobileLeft = true;
    });

    this.moveLeft.on("pointerout", () => {
      this.gameScene.player.mobileLeft = false;
    });

    this.moveRight.on("pointerover", () => {
      this.gameScene.player.mobileRight = true;
    });
    this.moveRight.on("pointerout", () => {
      this.gameScene.player.mobileRight = false;
    });

    this.mobileActionA.on("pointerdown", () => {
      if (!this.gameScene.player.mobileActionA) {
        this.gameScene.player.mobileActionA = true;
      }
    });

    this.chatButton.on("pointerdown", () => {
      this.chatController = !this.chatController;
      if(this.chatController){
        this.gameScene.dialogWindow.showWindow()
      }
      if(!this.chatController){
        this.gameScene.dialogWindow.hideWindow()
      }
    });

    // create inventory button
    this.inventoryButton = this.add
      .image(this.scale.width *.3, this.scale.height - 30, "inventoryButton")
      .setInteractive();
    this.inventoryButton.setScale(.1);
    this.inventoryButton.on("pointerdown", () => {
      this.toggleInventory(this.gameScene.player, true);
    });

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (
        !gameObjects.includes(this.inventoryWindow.rect) &&
        !gameObjects.includes(this.inventoryButton) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[0].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[1].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[2].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[3].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[4].item) &&
        !gameObjects.includes(
          this.inventoryWindow.inventoryItems[0].discardButton
        ) &&
        !gameObjects.includes(
          this.inventoryWindow.inventoryItems[1].discardButton
        ) &&
        !gameObjects.includes(
          this.inventoryWindow.inventoryItems[2].discardButton
        ) &&
        !gameObjects.includes(
          this.inventoryWindow.inventoryItems[3].discardButton
        ) &&
        !gameObjects.includes(
          this.inventoryWindow.inventoryItems[4].discardButton
        )
      ) {
        this.gameScene.dialogWindow.rect.setInteractive();
        this.inventoryWindow.hideWindow();
        this.showInventory = false;
      }
    });
  }

  setupEvents() {
    // listen for the updateScore event from the game scene
    this.gameScene.events.on("updateScore", (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });

    this.gameScene.events.on("showInventory", (playerObject, mainPlayer) => {
      this.toggleInventory(playerObject, mainPlayer);
    });
  }

  resize(gameSize) {
    if (this.inventoryWindow) this.inventoryWindow.resize(gameSize);

    if (gameSize.width < 370) {
      this.inventoryButton.y = gameSize.height - 250;
    } else {
      this.inventoryButton.y = gameSize.height - 50;
    }
  }

  toggleInventory(playerObject, mainPlayer) {
    this.showInventory = !this.showInventory;
    if (this.showInventory) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.inventoryWindow.showWindow(playerObject);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.inventoryWindow.hideWindow();
    }
  }
}
