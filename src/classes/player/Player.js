import * as Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame,) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this container will be added to
    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our player
    this.setImmovable(true);
    // scale our player
    this.setScale(3);
    // add the player to our existing scene
    this.scene.add.existing(this);
    this.key = key;

    this.scene.anims.create({
      key: `idle_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 0,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `down_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `right_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `up_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [12, 13, 14, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.play(`idle_${this.key}`);
  }

  playAnimation(key, children = true) {
    this.play(key, children);
  }
}
