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
    // load JSON
    this.loadJson();
  }

  loadImages() {
    this.load.image("button1", "src/assets/images/ui/blue_button01.png");
    this.load.image("button2", "src/assets/images/ui/blue_button02.png");

    // load the map tileset image
    this.load.image("atlas_32x", "src/assets/level/atlas_32x.png");

    this.load.image(
      "inventoryShield",
      "src/assets/images/condensation_shield_new.png"
    );
    this.load.image("inventoryGold", "src/assets/images/gold_pile_16.png");
    this.load.image("inventoryButton", "src/assets/images/windows/bag.png");
    this.load.image("inventorySword", "src/assets/images/infusion.png");
    this.load.image("inventoryHeart", "src/assets/images/regeneration_new.png");
    this.load.image("slot", "src/assets/images/windows/InventoryWindow/slot.png");
    this.load.image(
      "inventoryRemove",
      "src/assets/images/windows/InventoryWindow/remove.png"
    );
    this.load.image(
      "inventoryEquip",
      "src/assets/images/windows/InventoryWindow/equip.png"
    );

    this.load.image("playerstats", "src/assets/images/windows/playerstats.png");
  }

  loadSpriteSheets() {
    this.load.spritesheet("items", "src/assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "characters_1",
      "src/assets/images/characters/characters_1.png",
      {
        frameWidth: 16,
        frameHeight: 20,
      }
    );

    this.load.spritesheet(
      "characters_2",
      "src/assets/images/characters/characters_2.png",
      {
        frameWidth: 16,
        frameHeight: 20,
      }
    );

    this.load.spritesheet(
      "characters_3",
      "src/assets/images/characters/characters_3.png",
      {
        frameWidth: 16,
        frameHeight: 20,
      }
    );

    this.load.spritesheet(
      "characters_4",
      "src/assets/images/characters/characters_4.png",
      {
        frameWidth: 16,
        frameHeight: 20,
      }
    );

    this.load.spritesheet(
      "characters_5",
      "src/assets/images/characters/characters_5.png",
      {
        frameWidth: 16,
        frameHeight: 20,
      }
    );

    this.load.spritesheet("iconset", "src/assets/images/iconset.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "equipment_sheet",
      "src/assets/images/windows/PlayerWindow/equipment_sheet.png",
      { frameWidth: 20, frameHeight: 20 }
    );

    this.load.spritesheet("bar_sheet", "src/assets/images/ui/bar_sheet.png", {
      frameWidth: 24,
      frameHeight: 8,
    });

    this.load.spritesheet("enemy_mushy", "src/assets/images/enemies/mushy.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      "enemy_mushy_pink",
      "src/assets/images/enemies/mushy_pink.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "enemy_mushy_orange",
      "src/assets/images/enemies/mushy_orange.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "enemy_mushy_red",
      "src/assets/images/enemies/mushy_red.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet("enemy_slime", "src/assets/images/enemies/slime.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("buttons", "src/assets/images/ui/buttons.png", {
      frameWidth: 48,
      frameHeight: 16,
    });

  }

  loadAudio() {
    this.load.audio("goldSound", ["src/assets/audio/Pickup.wav"]);
    this.load.audio("enemyDeath", ["src/assets/audio/EnemyDeath.wav"]);
    this.load.audio("playerAttack", ["src/assets/audio/PlayerAttack.wav"]);
    this.load.audio("playerDamage", ["src/assets/audio/PlayerDamage.wav"]);
    this.load.audio("playerDeath", ["src/assets/audio/PlayerDeath.wav"]);
  }

  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON("map", "src/assets/level/new_level.json");
  }

  loadJson() {
    this.load.json("weaponsData", "src/assets/json/Books/weaponsBook.json");
    this.load.json("materialsData", "src/assets/json/Books/materialsBook.json");
    this.load.json("potionsData", "src/assets/json/Books/potionsBook.json");

  }

  create() {
    //this.input.setDefaultCursor('url(src/assets/images/mouse/default.cur), pointer');
    //this.scene.start("Login");
    this.scene.start('Game');
  }
}
