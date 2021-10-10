import * as Phaser from "phaser";
import Direction from "../../../utils/direction";

export default class Weapon extends Entity {
  constructor(scene, x, y, key, frame, id, direction) {
    super(scene, x, y, key, frame, id, direction);
 
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
