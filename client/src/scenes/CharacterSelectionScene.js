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
        character.characterId = i;
        character.setAlpha(0.4);
        character.setScale(3);

        character.on("pointerover", this.pointerOver);
        character.on("pointerout", this.pointerOut);
        character.on("pointerdown", this.pointerDown.bind(this, character));

        this.group.add(character);

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
  pointerDown(character) {
    this.scale.removeListener("resize", this.resize);
    this.scene.start("Game", { selectedCharacter: character.characterId });
  }

  startScene(targetScene) {
    this.scale.removeListener("resize", this.resize);
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
    let yDiff = 0;
    let xDiff = 0;
    let charactersPerRow = 8;
    let heightDiff = 6;
    if (width < 1200) {
      charactersPerRow = 6;
      heightDiff = 8;
    }
    if (width < 780) {
      charactersPerRow = 4;
      heightDiff = 8;
    }
    this.group.getChildren().forEach((child, index) => {
      if (index !== 0) {
        yDiff = parseInt(index / charactersPerRow, 10);
        xDiff = index % charactersPerRow;
      }
      const x = width / 3.5 + 96 * xDiff;
      const y = (height / heightDiff) * (yDiff + 2);
      child.setPosition(x, y);

      // update the character scale
      if (height < 600) {
        child.setScale(1.5);
      } else {
        child.setScale(2.5);
      }
    });
  }
}
