import { DEPTH } from "../utils/utils";

export default class GameMap {
  constructor(
    scene,
    key,
    tileSetName,
    bgLayerName,
    blockedLayerName,
    enviromentLayerName
  ) {
    this.scene = scene; // the scene this map belongs to
    this.key = key; // Tiled JSON file key name
    this.tileSetName = tileSetName; // Tiled Tileset image key name
    this.bgLayerName = bgLayerName; // the name of the layer created in tiled for the map background
    // the name of the layer created in tiled for the blocked areas
    this.blockedLayerName = blockedLayerName;

    this.enviromentLayerName = enviromentLayerName;
    this.watterLayer = "Watter";
    this.createMap();
  }

  createMap() {
    // create the tile map
    this.tilemap = this.scene.make.tilemap({ key: this.key });
    // add the tileset image to our map
    this.tiles = this.tilemap.addTilesetImage(
      this.tileSetName,
      this.tileSetName,
      32,
      32,
      0,
      0
    );

    // create our background
    this.backgroundLayer = this.tilemap.createLayer(
      this.bgLayerName,
      this.tiles,
      0,
      0
    );
    this.backgroundLayer.setScale(2.01);

    // create blocked layer
    this.blockedLayer = this.tilemap.createLayer(
      this.blockedLayerName,
      this.tiles,
      0,
      0
    );
    this.blockedLayer.setCollisionByExclusion([-1]);
    this.blockedLayer.setScale(2.01);

    // create enviroment layer
    this.enviromentLayer = this.tilemap.createLayer(
      this.enviromentLayerName,
      this.tiles,
      0,
      0
    );
    this.enviromentLayer.setDepth(DEPTH.ENVIROMENT);
    this.enviromentLayer.setScale(2.01);

    // create watter layer
    this.watterLayer = this.tilemap.createLayer(
      this.watterLayer,
      this.tiles,
      0,
      0
    );
    this.watterLayer.setDepth(0);
    this.watterLayer.setScale(2.01);
    this.watterLayer.setCollisionByExclusion([-1]);


    // update the world bounds
    this.scene.physics.world.bounds.width = this.tilemap.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.tilemap.heightInPixels * 2;
    // limit the camera to the size of our map
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels * 2,
      this.tilemap.heightInPixels * 2
    );
  }
}
