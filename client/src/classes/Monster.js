import * as Phaser from "phaser";
import { randomNumber } from "../../../server/src/game_manager/utils";
import { DEPTH, healthBarTypes } from "../utils/utils";
import Entity from "./Entities/Entity";
import Bar from "./UI/Bar";


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

  move(targetPosition, speed) {
    const dis = Phaser.Math.Distance.Between(
      targetPosition.x,
      targetPosition.y,
      this.x,
      this.y
    );

    if (dis < 120) {
      this.scene.physics.moveToObject(this, targetPosition, speed);
    } else {
    
      const distance = 64;
      const randomPosition = randomNumber(1,8)
      switch (randomPosition) {
        case 1:
          this.body.setVelocityX(distance);
          break;
        case 2:
          this.body.setVelocityX(-distance);
          break;
        case 3:
          this.body.setVelocityY(distance);
          break;
        case 4:
          this.body.setVelocityY(-distance);          
          break;
        case 5:
          this.body.setVelocityX(distance);
          this.body.setVelocityY(distance);
          break;
        case 6:
          this.body.setVelocityX(distance);
          this.body.setVelocityY(-distance);
          break;
        case 7:
          this.body.setVelocityX(-distance);
          this.body.setVelocityY(distance);
          break;
        case 8:
          this.body.setVelocityX(-distance);
          this.body.setVelocityY(-distance);
          break;
        default:
          break;
      }
    }
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

  monsterOut() {
    this.reset(300, 300);
  }
}
