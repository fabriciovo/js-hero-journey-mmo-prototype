import GameMap from "../classes/GameMap";
import GameScene from "./GameScene";

export default class ForestScene extends GameScene {
  constructor() {
    super("Forest");
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
    this.scene.restart({ level: "dungeon" });
  }
}
