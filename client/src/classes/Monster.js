import * as Phaser from "phaser";
import { healthBarTypes } from "../utils/utils";
import Entity from "./Entities/Entity";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default class Monster extends Entity {
  constructor(scene, x, y, key, frame, id, health, maxHealth) {
    super(scene, x, y, key, frame, id);
    this.health = health;
    this.maxHealth = maxHealth;
    console.log(id);
    this.key = key;
    this.scene.anims.create({
      key: `normal_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    // this.scene.anims.create({
    //   key: "sides",
    //   frames: this.scene.anims.generateFrameNumbers(key, {
    //     frames: [4, 5, 6, 7],
    //   }),
    //   frameRate: 8,
    //   repeat: -1,
    // });

    // this.scene.anims.create({
    //   key: "up",
    //   frames: this.scene.anims.generateFrameNumbers(key, {
    //     frames: [4, 5, 6, 7],
    //   }),
    //   frameRate: 8,
    //   repeat: -1,
    // });

    this.play(`normal_${this.key}`);
    this.createHealthBar();
  }

  createHealthBar() {
    this.healthBarHolder = this.scene.add
      .image(this.x - 14, this.y - 20, "bar_sheet", healthBarTypes.HOLDER)
      .setScale(3.5)
      .setOrigin(0, 0.5)
      .setDepth(2);
      this.healthBarHolder.displayWidth = (this.health / this.maxHealth) * 100;

    this.healthBar = this.scene.add
      .image(this.x - 14, this.y - 20, "bar_sheet", healthBarTypes.LIFE_BAR)
      .setScale(3.5)
      .setOrigin(0, 0.5)
      .setDepth(2);

    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.setPosition(this.x - 14, this.y - 20);
    this.healthBarHolder.setPosition(this.x - 14, this.y - 20);
    this.healthBar.displayWidth = (this.health / this.maxHealth) * 100;
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  move(targetPosition) {
    this.scene.physics.moveToObject(this, targetPosition, 40);
  }

  update() {
    this.updateHealthBar();
    this.animation();
  }

  followPlayer() {}

  Attack() {}

  animation() {}

  makeInactive() {
    super.makeInactive();
    this.updateHealthBar();
    this.healthBar.setVisible(false);
    this.healthBarHolder.setVisible(false);
  }

  makeActive() {
    super.makeActive();
    this.healthBar.setVisible(true);
    this.healthBarHolder.setVisible(true);
  }
}
