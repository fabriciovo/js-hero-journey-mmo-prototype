import * as Phaser from "phaser";

import PlayerContainer from "../classes/player/PlayerContainer";
import Chest from "../classes/Chest";
import Monster from "../classes/Monster";
import GameMap from "../classes/GameMap";
import { getRandomItem } from "../utils/utils";
import Item from "../classes/items/Item";
import Npc from "../classes/Entities/Npcs/Npc";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.scene.launch("Ui");
    this.uiScene = this.scene.get("Ui");

    this.selectedCharacter = data.selectedCharacter || "characters_3";

    this.cameras.main.roundPixels = true;



  }


  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();
    this.createPlayer()


   
    this.scale.on("resize", this.resize, this);
    this.resize({ height: this.scale.height, width: this.scale.width });

    this.keyDownEventListener();
    
    setInterval(()=>{
      this.spawnMonster({x:350,y:350,key:"key", id:Phaser.Math.Between(-500,500),health:10,maxHealth:10,stateTime:"",randomPosition:0})
    },[10000 ])


  }

  keyDownEventListener() {
    window.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        this.sendMessage();
      } else if (event.keyCode === 32) {
        if (document.activeElement === this.inputMessageField) {
          this.inputMessageField.value = `${this.inputMessageField.value} `;
        }
      } else if (event.keyCode === 67) {
        if (document.activeElement === this.inputMessageField) {
          this.inputMessageField.value = `${this.inputMessageField.value}c`;
        }
      } else if (event.keyCode === 88) {
        if (document.activeElement === this.inputMessageField) {
          this.inputMessageField.value = `${this.inputMessageField.value}x`;
        }
      } else if (event.keyCode === 90) {
        if (document.activeElement === this.inputMessageField) {
          this.inputMessageField.value = `${this.inputMessageField.value}z`;
        }
      }
    });
  }

  sendMessage() {
    if (this.inputMessageField) {
      const message = this.inputMessageField.value;
      if (message) {
        this.inputMessageField.value = "";
      }
    }
  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add("goldSound", {
      loop: false,
      volume: 0.3,
    });
    this.playerAttackAudio = this.sound.add("playerAttack", {
      loop: false,
      volume: 0.01,
    });
    this.playerDamageAudio = this.sound.add("playerDamage", {
      loop: false,
      volume: 0.2,
    });
    this.playerDeathAudio = this.sound.add("playerDeath", {
      loop: false,
      volume: 0.2,
    });
    this.monsterDeathAudio = this.sound.add("enemyDeath", {
      loop: false,
      volume: 0.2,
    });
  }

  createPlayer() {
    const newPlayerObject = new PlayerContainer(
      this,
      350,
      350,
      this.selectedCharacter,
      0,
      100,
     100,
      1,
      this.playerAttackAudio,
      true,
      "name",
      10,
      0,
      1,
      {},
      {},
      0,
      100,
      1,
      0,
      {}
    );
  
    this.player = newPlayerObject;
    this.uiScene.createPlayersStatsUi(this.player);

  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create a monster group
    this.monsters = this.physics.add.group();
    this.monsters.runChildUpdate = true;

    // create a npc group
    this.npcs = this.physics.add.group();
    this.npcs.runChildUpdate = true;

    // create a chest group
    this.items = this.physics.add.group();


  }
  spawnItem(itemObject) {
    let item = this.items.getFirstDead();
    if (!item) {
      item = new Item(
        this,
        itemObject.x,
        itemObject.y,
        "iconset",
        itemObject.frame,
        itemObject.id
      );
      // add item to items group
      this.items.add(item);
    } else {
      item.id = itemObject.id;
      item.frame = itemObject.frame;
      item.setFrame(item.frame);
      item.setPosition(itemObject.x, itemObject.y);
      item.makeActive();
    }
  }

  dropItem(monster) {
    // add item to items group
    if (!monster || !monster.x || !monster.y) return;
    this.sendMonsterDropItemMessage(monster.x, monster.y, getRandomItem());
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();
    if (!chest) {
      chest = new Chest(
        this,
        chestObject.x,
        chestObject.y,
        "items",
        0,
        chestObject.gold,
        chestObject.id
      );
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x, chestObject.y);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObject) {
    debugger
      const monster = new Monster(
        this,
        monsterObject.x,
        monsterObject.y,
        "enemy_mushy_pink",
        0,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
        monsterObject.stateTime,
        monsterObject.randomPosition
      );
      // add monster to monsters group
      this.monsters.add(monster);
      this.add.scene(monster)
        debugger
    
  }

  spawnNpc(npcObject) {
    let npc = this.npcs.getFirstDead();
    if (!npc) {
      npc = new Npc(
        this,
        npcObject.x,
        npcObject.y,
        "characters_1",
        npcObject.frame,
        npcObject.id
      );
      // add npc to npcs group
      this.npcs.add(npc);
    } else {
      npc.id = npcObject.id;
      npc.setTexture("iconset", npcObject.frame);
      npc.setPosition(npcObject.x, npcObject.y);
      npc.makeActive();
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.gameMap.blockedLayer);
    this.physics.add.collider(this.player, this.gameMap.watterLayer);

    this.physics.add.collider(this.rangedObjects, this.gameMap.blockedLayer);

    this.physics.add.collider(this.player, this.gameMap.enviromentLayer);

    // check for overlaps between player and npc game objects
    this.physics.add.overlap(
      this.player,
      this.npcs,
      this.npcAction,
      false,
      this
    );

    // check for overlaps between player and chest game objects
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this
    );
    // check for collisions between the monster group and the tiled blocked layer
    this.physics.add.collider(this.monsters, this.gameMap.blockedLayer);
    this.physics.add.collider(this.monsters, this.gameMap.watterLayer);

    // check for overlaps between the player's weapon and monster game objects
    this.physics.add.overlap(
      this.player.actionA,
      this.monsters,
      this.playerOverlapMonster,
      null,
      this
    );

    // check for overlaps between the player's weapon and other player game objects
    this.physics.add.overlap(
      this.player.actionA,
      this.otherPlayers,
      this.weaponOverlapEnemy,
      null,
      this
    );

    // check for overlaps between player and item game objects
    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    // check for overlaps between the player's weapon and monster game objects
    this.physics.add.overlap(
      this.monsters,
      this.playerList,
      this.monsterAttackOverlap,
      null,
      this
    );
  }

  monsterAttackOverlap(monster, player) {
    if (monster.monsterAttackActive && !monster.hitbox && !monster.dead) {
      monster.hitbox = true;
    }
  }

  weaponOverlapEnemy(weapon, enemyPlayer) {
    if (this.player.actionAActive && !this.player.hitbox) {
      this.player.hitbox = true;
    }
  }
  playerOverlapMonster(weapon, enemy) {
    if (this.player.actionAActive && !this.player.hitbox) {
      this.player.hitbox = true;
    }
  }

  npcAction(player, npc) {
    npc.action(this.uiScene, player);
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
  }

  collectItem(player, item) {
    // item pickup
  }

  sendDropItemMessage(itemId) {
    this.uiScene.inventoryWindow.updateInventory(this.player);
    this.uiScene.inventoryWindow.hideWindow();
    this.uiScene.inventoryWindow.showWindow(this.player);
  }

  sendMonsterDropItemMessage(x, y, item) {
  }

  sendEquipItemMessage(itemId) {
    this.uiScene.inventoryWindow.updateInventory(this.player);
    this.uiScene.inventoryWindow.hideWindow();
    this.uiScene.inventoryWindow.showWindow(this.player);

    this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    this.uiScene.playerStatsWindow.hideWindow();
    this.uiScene.playerStatsWindow.showWindow(this.player);
  }

  sendBuyItemMessage(item) {
    this.uiScene.popup.cantBuy(this.player);
    this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    this.uiScene.potionACountText.setText(this.player.potions);
  }

  sendUnequipItemMessage(itemId) {
    this.uiScene.inventoryWindow.updateInventory(this.player);
    this.uiScene.inventoryWindow.hideWindow();
    this.uiScene.inventoryWindow.showWindow(this.player);

    this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    this.uiScene.playerStatsWindow.hideWindow();
    this.uiScene.playerStatsWindow.showWindow(this.player);
  }

  createMap() {
    // create map

    //TODO - pra criar novas scenes isso tem q ir para um script independente
    this.gameMap = new GameMap(
      this,
      "map",
      "atlas_32x",
      "background",
      "blocked",
      "enviroment"
    );
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
    this.cameras.main.roundPixels = true;
  }
}
