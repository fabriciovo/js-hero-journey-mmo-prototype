import * as Phaser from "phaser";

export default class RangedWeapon extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    this.scene = scene;
    this.createMultiple({
      frameQuantity: 5,
      key: "ranged",
      active: false,
      visible: false,
      classType: RangedWeapon,
    });
  }

  attack(x, y) {
    let ranged = this.getFirstDead(false);

    if (ranged) {
      ranged.fire(x, y);
    }
  }
}
