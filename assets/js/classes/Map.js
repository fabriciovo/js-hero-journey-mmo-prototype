class Map {
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
        this.map = this.scene.make.tilemap({key:this.key});
        console.log(this.map)
        this.tiles = this.map.addTilesetImage('colored','colored_packed',16,16);

        this.background =  this.map.createLayer(this.bgLayer, this.tiles, 0, 0);
        
        this.blocked =  this.map.createLayer(this.blockedLayer, this.tiles, 0, 0);
        this.blocked.setCollisionByExclusion([-1]);

        this.background.setScale(2);
        this.blocked.setScale(2);

        this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

        this.scene.cameras.main.setBounds(0,0,this.map.widthInPixels * 2, this.map.heightInPixels * 2)
    }

}