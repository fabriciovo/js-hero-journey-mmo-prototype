import Phaser from "phaser";
import Entity from "../Entity";
export default class Npc extends Entity {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame, id);
    this.key = key;
    this.player = null;
    this.scene = scene;
    this.scene.anims.create({
      key: `idle_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.play(`idle_${this.key}`);
    this.createNpcName();
  }

  update() {
    if (this.player) {
      if (!this.scene.physics.overlap(this, this.player, false, false, this)) {
        this.player = null;
        this.scene.uiScene.toggleShop(this.player, false);
      }
    }
  }

  action(player) {
    this.player = player;
    this.scene.uiScene.toggleShop(this.player, true);
  }

  createNpcName() {
    this.name = this.scene.make.text({
      x: this.x - 12,
      y: this.y - 12,
      text: "Shop",
      style: {
        font: "14px monospace",
        fill: "#ffffff",
      },
    });
  }
}
