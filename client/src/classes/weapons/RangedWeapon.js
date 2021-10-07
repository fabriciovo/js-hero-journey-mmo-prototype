import * as Phaser from "phaser";
import Direction from "../../utils/direction";

export default class RangedWeapon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame, damage, id, direction) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.damage = damage;
    this.id = id;
    this.direction = direction;
    // enable physics
    this.scene.physics.world.enable(this);
    // add the player to our existing scene
    this.scene.add.existing(this);
    // scale the chest game object
    this.setScale(2);
  }


  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }

  Attack() {
    if (this.direction === Direction.UP) {
      this.setAngle(-45);
      this.body.setVelocityY(-560);
    } else if (this.direction === Direction.DOWN) {
      this.body.setVelocityY(560);
      this.setAngle(111);
    } else if (this.direction === Direction.RIGHT) {
      this.body.setVelocityX(560);
      this.setAngle(45);
    } else if (this.direction === Direction.LEFT) {
      this.body.setVelocityX(-560);
      this.setAngle(270);
    }
  }
}
