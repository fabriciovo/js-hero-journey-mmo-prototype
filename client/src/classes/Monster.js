import * as Phaser from "phaser";
import { DEPTH, healthBarTypes } from "../utils/utils";
import Entity from "./Entities/Entity";
import Bar from "./UI/Bar";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default class Monster extends Entity {
  constructor(scene, x, y, key, frame, id, health, maxHealth) {
    super(scene, x, y, key, frame, id);
    this.health = health;
    this.maxHealth = maxHealth;
    this.scene = scene;
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
    //Health bar
    this.healthBar = new Bar(
      this.scene,
      this.x,
      this.y,
      "bar_sheet",
      healthBarTypes.LIFE_BAR,
      healthBarTypes.HOLDER,
      DEPTH.BARS
    );
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.UpdateBar(
      this.x - 22,
      this.y - 22,
      this.health,
      this.maxHealth
    );
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
    this.healthBar.DestroyBar();
  }

  makeActive() {
    super.makeActive();
    this.createHealthBar();
  }
}
