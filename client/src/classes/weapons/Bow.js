import * as Phaser from 'phaser';
import Weapon from './Weapon';

export default class Bow extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.id = id;

    // enable physics
    this.scene.physics.world.enable(this);
    // add the player to our existing scene
    this.scene.add.existing(this);
    // scale the chest game object
    this.setScale(2);
    this.setAlpha(0);

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

  attack(){

  }

  overleap(){

  }
  
}
