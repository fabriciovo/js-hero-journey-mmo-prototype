import Entity from "../Entity";
export default class Npc extends Entity {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame, id);
  }

  action(scene,player){
    if(player){
      scene.shopWindow.showWindow(player);
    }else{
      scene.shopWindow.hideWindow();
    }
  }
}
