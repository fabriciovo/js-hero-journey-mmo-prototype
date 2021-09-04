import *  as Pahser from 'phaser'
export default class GameMap {
    /**
     * 
     * @param {Pass the game scene} scene 
     * @param {Pass the key of your tilemap} key 
     * @param {The tileset name} tileSetName 
     * @param {Background layer by default = 0} bgLayerName 
     * @param {Blocked layer by default = 1} blockedLayer 
     */
    constructor(scene,key,tileSetName,bgLayer  = 0,blockedLayer = 1){
        this.key = key;
        this.tileSetName = tileSetName;
        this.scene = scene;
        this.bgLayer = bgLayer;
        this.blockedLayer = blockedLayer;
        this.createMap();
    }

    createMap(){
        this.tilemap = this.scene.make.tilemap({key:this.key});
        console.log(this.tilemap)
        this.tiles = this.tilemap.addTilesetImage('colored','colored_packed',16,16);

        this.background =  this.tilemap.createLayer(this.bgLayer, this.tiles, 0, 0);
        
        this.blocked =  this.tilemap.createLayer(this.blockedLayer, this.tiles, 0, 0);
        this.blocked.setCollisionByExclusion([-1]);

        this.background.setScale(2);
        this.blocked.setScale(2);

        this.scene.physics.world.bounds.width = this.tilemap.widthInPixels * 2;
        this.scene.physics.world.bounds.height = this.tilemap.heightInPixels * 2;

        this.scene.cameras.main.setBounds(0,0,this.tilemap.widthInPixels * 2, this.tilemap.heightInPixels * 2)
    }

}