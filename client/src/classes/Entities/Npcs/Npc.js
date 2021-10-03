import * as Phaser from "phaser";
import Entity from "../Entity";
export default class Npc extends Entity {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame, id);
  }

  action(scene,player){
    console.log("sadopkadsk")
    if(player){
      scene.shopWindow.showWindow(player);
    }else{
      scene.shopWindow.hideWindow();
    }
  }
}
