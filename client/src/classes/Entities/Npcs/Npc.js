import Entity from "../Entity";
export default class Npc extends Entity {
  constructor(scene, x, y, key, frame, id) {
    super(scene, x, y, key, frame, id);

    
    this.createNpcName();
  }

  action(scene,player){
    if(player){
      scene.shopWindow.showWindow(player);
    }else{
      scene.shopWindow.hideWindow();
    }
  }

  createNpcName() {
    this.name = this.scene.make.text({
      x: this.x - 12,
      y: this.y - 12,
      text: "Shop",
      style: {
        font: "14px monospace",
        fill: "#ffffff",
      },
    });
  }
}
