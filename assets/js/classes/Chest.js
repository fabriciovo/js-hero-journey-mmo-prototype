class Chest extends Phaser.Physics.Arcade.Image {
    constructor(scene,x,y,key,frame){
        super(scene,x,y,key,frame);
        this.scene = scene;
        this.coins = 1

        this.scene.physics.world.enable(this);
  

        this.scene.add.existing(this);
    }

    preload(){

    }

    create(){

    }



}