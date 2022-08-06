import * as Phaser from "phaser";
import { DEPTH } from "../../utils/utils";

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.id = id;
    this.tag = "entity";

    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our monster
    this.setImmovable(false);
    // scale our monster
    this.setScale(3);
    // collide with world bounds
    this.setCollideWorldBounds(true);
    // add the monster to our existing scene
    this.scene.add.existing(this);
    // update the origin
    this.setOrigin(0);
    this.setDepth(DEPTH.ENTITIES);
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

  getTag() {
    return this.tag;
  }

  setTag(value) {
    this.tag = value;
  }
}
