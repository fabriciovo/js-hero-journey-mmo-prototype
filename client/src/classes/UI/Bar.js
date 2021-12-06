import * as Phaser from "phaser";

export default class Bar extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, holder, depth, size = 100) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this container will be added to
    this.key = key;
    this.frame = frame;
    this.holder = holder;
    this.size = size;
    
    this.scene.add.existing(this);
    //this.CreateBar(x, y, depth);
  }

  CreateBar(x, y, depth) {
    // if (this.holder) {
    //   this.holderBar = this.scene.add
    //     .image(x, y, this.key, this.holder)
    //     .setScale(3.5)
    //     .setOrigin(0, 0.5)
    //     .setDepth(depth);
    // }
    // this.bar = this.scene.add
    //   .image(x, y, this.key, this.frame)
    //   .setScale(3.5)
    //   .setOrigin(0, 0.5)
    //   .setDepth(depth);
    // this.bar.displayWidth = this.size;
  }

  UpdateBar(x, y, value, maxValue) {
    // this.bar.setPosition(x, y);
    // this.holderBar.setPosition(x, y);
    // this.bar.displayWidth = (value / maxValue) * this.size;
    // this.holderBar.displayWidth = this.size;

  }

  DestroyBar() {
    // this.bar.setVisible(false);
    // this.holderBar.setVisible(false);
    // this.bar.destroy();
    // this.holderBar.destroy();
  }
}
