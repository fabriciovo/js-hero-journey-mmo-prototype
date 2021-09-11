import * as Phaser from "phaser";
import UiButton from "../classes/UiButton";
import { getParam } from "../utils/utils";

export default class CharacterSelectionScene extends Phaser.Scene {
  constructor() {
    super("CharacterSelection");
  }

  create() {
    this.createCharacters();

    this.scale.on("resize", this.resize, this);
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  createCharacters() {
    this.group = this.add.group();
    for (let j = 0; j < 3; j += 1) {
      let x = this.scale.width / 3.5;
      const y = (this.scale.height / 6) * (j + 2);
      for (let i = 0 + 8 * j; i < 8 + 8 * j; i += 1) {
        const character = this.add
          .image(x, y, "characters", i)
          .setInteractive();
        this.group.add(character);
        character.setAlpha(0.4);
        character.setScale(3);

        character.on('pointerover', this.pointerOver);
        character.on('pointerout', this.pointerOut);
        character.on('pointerdown', this.pointerDown.bind(this, character));


        x += 96;
      }
    }
  }

  pointerOver() {
    this.setAlpha(1);

  }
  pointerOut() {
    this.setAlpha(0.4);

  }
  pointerDown() {
    this.scale.removeListener("resize", this.resize);
    this.scene.start("Game");  }


  startScene(targetScene) {
    this.scale.removeListener("resize", this.resize);
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
  }
}
