import * as Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // load images
    this.loadImages();
    // load spritesheets
    this.loadSpriteSheets();
    // load audio
    this.loadAudio();
    // load tilemap
    this.loadTileMap();
  }

  loadImages() {
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");
    // load the map tileset image
    this.load.image("background", "assets/level/background-extruded.png");

    this.load.image(
      "inventoryShield",
      "assets/images/condensation_shield_new.png"
    );
    this.load.image("inventoryGold", "assets/images/gold_pile_16.png");
    this.load.image("inventoryButton", "assets/images/windows/bag.png");
    this.load.image("inventorySword", "assets/images/infusion.png");
    this.load.image("inventoryHeart", "assets/images/regeneration_new.png");
    this.load.image("slot", "assets/images/windows/InventoryWindow/slot.png");
    this.load.image(
      "inventoryRemove",
      "assets/images/windows/InventoryWindow/remove.png"
    );
    this.load.image(
      "inventoryEquip",
      "assets/images/windows/InventoryWindow/equip.png"
    );

    this.load.image("playerstats", "assets/images/windows/playerstats.png");
  }

  loadSpriteSheets() {
    this.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("characters", "assets/images/characters.png", {
      frameWidth: 23,
      frameHeight: 32,
    });
    this.load.spritesheet("monsters", "assets/images/monsters.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("tools", "assets/images/tools.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("iconset", "assets/images/iconset.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet(
      "equipment_sheet",
      "assets/images/windows/PlayerWindow/equipment_sheet.png",
      { frameWidth: 20, frameHeight: 20 }
    );
  }

  loadAudio() {
    this.load.audio("goldSound", ["assets/audio/Pickup.wav"]);
    this.load.audio("enemyDeath", ["assets/audio/EnemyDeath.wav"]);
    this.load.audio("playerAttack", ["assets/audio/PlayerAttack.wav"]);
    this.load.audio("playerDamage", ["assets/audio/PlayerDamage.wav"]);
    this.load.audio("playerDeath", ["assets/audio/PlayerDeath.wav"]);
  }

  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON("map", "assets/level/large_level.json");
  }

  create() {
    //this.input.setDefaultCursor('url(assets/images/mouse/default.cur), pointer');
    this.scene.start("Login");
    //this.scene.start('Game');
  }
}
