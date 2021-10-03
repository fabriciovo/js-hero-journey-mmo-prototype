import * as Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame) {
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

    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("characters", {
        frames: [1],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "down",
      frames: this.scene.anims.generateFrameNumbers("characters", {
        frames: [0, 1, 2],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("characters", {
        frames: [3, 4, 5],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "up",
      frames: this.scene.anims.generateFrameNumbers("characters", {
        frames: [9, 10, 11],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.play("idle");
  }

  playAnimation(key, children = true) {
    this.play(key, children);
  }
}
