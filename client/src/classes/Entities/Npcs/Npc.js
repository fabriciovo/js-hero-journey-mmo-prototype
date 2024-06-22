import Entity from "../Entity";
export default class Npc extends Entity {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame, id);
    this.key = key;
    this.overlaping = true;
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

  update() {}

  action(uiScene, player) {
    console.log(player);
    const dis = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    );
    if (dis >= 30 && dis <= 90) {
      uiScene.toggleShop(player, true);
    } else {
      uiScene.toggleShop(player, false);
    }
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
