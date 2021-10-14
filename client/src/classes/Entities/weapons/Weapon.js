
import Entity from "../Entity";

export default class Weapon extends Entity {
  constructor(scene, x, y, key, frame, id, direction) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to

    this.id = id;
    this.direction = direction;

    this.setScale(2);
    this.hitbox = false;
    this.setSize(16, 16);
    this.setOffset(4, 8);
  }

  makeInactive() {
    super.makeInactive();
    this.hitbox = false;
  }

  Attack() {
    //throw new Error("Metodo não implementado")
  }
}
