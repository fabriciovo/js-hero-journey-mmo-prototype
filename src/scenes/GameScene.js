import * as Phaser from "phaser";

import PlayerContainer from "../classes/player/PlayerContainer";
import Chest from "../classes/Chest";
import Monster from "../classes/Monster";
import GameMap from "../classes/GameMap";
import { getRandomItem } from "../utils/utils";
import DialogWindow from "../classes/window/DialogWindow";
import Item from "../classes/items/Item";
import Npc from "../classes/Entities/Npcs/Npc";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    if (!this.game.mobile) {
      this.scene.launch("Ui");
      this.uiScene = this.scene.get("Ui");
    }
    this.selectedCharacter = data.selectedCharacter || "characters_3";

    this.cameras.main.roundPixels = true;

  }


  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();

    this.dialogWindow = new DialogWindow(this, {
      x: this.scale.width,
    });

   
    this.scale.on("resize", this.resize, this);
    this.resize({ height: this.scale.height, width: this.scale.width });

    this.keyDownEventListener();

    this.input.on("pointerdown", () => {
      document.getElementById("chatInput").blur();
    });

  }

  keyDownEventListener() {
    this.inputMessageField = document.getElementById("chatInput");
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

  createPlayer(playerObject, mainPlayer) {
    const newPlayerObject = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      this.selectedCharacter,
      0,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id,
      this.playerAttackAudio,
      mainPlayer,
      playerObject.playerName,
      playerObject.gold,
      playerObject.defense,
      playerObject.attack,
      playerObject.items,
      playerObject.equipedItems,
      playerObject.exp,
      playerObject.maxExp,
      playerObject.level,
      playerObject.potions,
      {}
    );
    if (mainPlayer) {
      this.uiScene.createPlayersStatsUi(newPlayerObject);
      this.player = newPlayerObject;
    } else {
      this.otherPlayers.add(newPlayerObject);
    }
    this.playerList.add(newPlayerObject);
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

    this.playerList = this.physics.add.group();
    this.playerList.runChildUpdate = true;

    this.otherPlayers = this.physics.add.group();
    this.otherPlayers.runChildUpdate = true;

    // create a chest group
    this.items = this.physics.add.group();

    // create a ranged Attacks group
    this.rangedObjects = this.physics.add.group();
    this.rangedObjects.runChildUpdate = true;
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
    let monster = this.monsters.getFirstDead();
    debugger
    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x,
        monsterObject.y,
        monsterObject.key,
        0,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
        monsterObject.stateTime,
        monsterObject.randomPosition
      );
      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.stateTime = monsterObject.stateTime;
      monster.randomPosition = monsterObject.randomPosition;

      monster.setTexture(monsterObject.key, 0);
      monster.setPosition(monsterObject.x, monsterObject.y);
      //monster.body.setVelocity(monsterObject.velocity);
      monster.makeActive();
    }
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
    this.dialogWindow.resize(gameSize);
  }
}
