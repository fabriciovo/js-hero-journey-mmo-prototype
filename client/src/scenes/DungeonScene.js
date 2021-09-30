import GameMap from "../classes/GameMap";
import GameScene from "./GameScene";

export default class DungeonScene extends GameScene {
    constructor() {
      super('Dungeon');
    }
    preload(){
      this.load.tilemapTiledJSON("map", "assets/level/dungeon_level.json");
    }
  }