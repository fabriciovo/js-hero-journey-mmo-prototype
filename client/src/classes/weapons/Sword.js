import * as Phaser from "phaser";
import Weapon from "./Weapon";

export default class Sword extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, id, player) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.id = id;
    this.player = player;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(2);
    this.makeActive ();
    this.hitbox = false;
    this.flipX = false;
  }


  update(){
    if (this.player.actionAActive) {
        if (this.flipX) {
          this.angle -= 10;
        } else {
          this.angle += 10;
        }
      } else {
        if (this.player.currentDirection === Direction.DOWN) {
          this.setAngle(-270);
        } else if (this.player.currentDirection === Direction.UP) {
          this.setAngle(-90);
        } else {
          this.setAngle(0);
        }
  
        this.flipX = false;
        if (this.currentDirection === Direction.LEFT) {
          this.flipX = true;
        }
      }
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

  attack(self) {
    this.makeActive();
    this.player.actionAActive = true;
    
    if (this.player.mainPlayer) this.attackAudio.play();
    this.scene.time.delayedCall(
      150,
      () => {
        this.player.actionAActive = false;
        this.hitbox = false;
        this.makeInactive();
      },
      [],
      self
    );
  }

  overleap() {}
}
