import * as Phaser from 'phaser';

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.id = id;
    
    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our monster
    this.setImmovable(false);
    // scale our monster
    this.setScale(2);
    // collide with world bounds
    this.setCollideWorldBounds(true);
    // add the monster to our existing scene
    this.scene.add.existing(this);
    // update the origin
    this.setOrigin(0);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
    this.updateHealthBar();
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
    this.healthBar.clear();
  }

}
