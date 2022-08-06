import * as Phaser from "phaser";
import PlayerContainer from "../../player/PlayerContainer";

export default class Potion extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.id = id;

    // enable physics
    this.scene.physics.world.enable(this);
    // add the player to our existing scene
    this.scene.add.existing(this);
    // scale the chest game object
    this.setFrame(frame);
    this.setScale(2);

    this.healPoints = 20;
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

  heal(player) {
    
    player.health += this.healPoints
    if(player.health > player.maxHealth){
        player.health = player.maxHealth;
    }
    player.updateHealth(player.health)

  }
}
