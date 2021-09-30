import GameMap from "../classes/GameMap";
import GameScene from "./GameScene";

export default class DungeonScene extends GameScene {
  constructor() {
    super("Dungeon");
  }

  init(data) {
    super.init(data);
    console.log(data);
    this.level = data.level;
  }

  preload() {
    this.load.tilemapTiledJSON("map", `assets/level/${this.level}_level.json`);
  }

  createMap() {
    // create map
    this.gameMap = new GameMap(
      this,
      "map",
      "background",
      "background",
      "blocked"
    );
  }
  changeScene() {
    this.scene.start("Dungeon",{ level: "dungeon" });
  }
}
