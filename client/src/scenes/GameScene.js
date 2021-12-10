import * as Phaser from "phaser";

import PlayerContainer from "../classes/player/PlayerContainer";
import Chest from "../classes/Chest";
import Monster from "../classes/Monster";
import GameMap from "../classes/GameMap";
import { getCookie, getRandomItem } from "../utils/utils";
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
    } else {
      this.scene.launch("UiMobile");
      this.uiScene = this.scene.get("UiMobile");
    }

    this.socket = this.sys.game.globals.socket;

    this.listenForSocketEvents();

    this.selectedCharacter = data.selectedCharacter || "characters_3";

    this.cameras.main.roundPixels = true;
  }
  listenForSocketEvents() {
    // spawn player game objects

    this.socket.on("currentPlayers", (players) => {
      Object.keys(players).forEach((id) => {
        if (players[id].id === this.socket.id) {
          this.createPlayer(players[id], true);
          this.addCollisions();
        } else {
          this.createPlayer(players[id], false);
        }
      });
    });

    // spawn monster game objects
    this.socket.on("currentMonsters", (monsters) => {
      Object.keys(monsters).forEach((id) => {
        this.spawnMonster(monsters[id]);
      });
    });

    // spawn chest game objects
    this.socket.on("currentChests", (chests) => {
      Object.keys(chests).forEach((id) => {
        this.spawnChest(chests[id]);
      });
    });

    // spawn player game object
    this.socket.on("spawnPlayer", (player) => {
      this.createPlayer(player, false);
    });

    // a player has moved
    this.socket.on("playerMoved", (player) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (player.id === otherPlayer.id) {
          otherPlayer.flipX = player.flipX;
          otherPlayer.setPosition(player.x, player.y);
          otherPlayer.updateHealthBar();
          otherPlayer.updateFlipX();
          otherPlayer.actionAActive = player.actionAActive;
          otherPlayer.potionAActive = player.potionAActive;
          otherPlayer.currentDirection = player.currentDirection;
          if (player.actionAActive) {
            otherPlayer.actionAFunction();
          }

          if (player.potionAActive) {
            otherPlayer.potionAFunction();
            otherPlayer.updateHealthBar();
          }
          //otherPlayer.playAnimation();
        }
      });
    });
    this.socket.on("chestSpawned", (chest) => {
      this.spawnChest(chest);
    });

    this.socket.on("monsterSpawned", (monster) => {
      this.spawnMonster(monster);
    });

    this.socket.on("chestRemoved", (chestId) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    });

    this.socket.on("monsterRemoved", (monsterId) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId && !monster.dead) {
          console.log("teste")
          monster.makeInactive();
          this.monsterDeathAudio.play();
          this.dropItem(monster);

        }
      });
    });

    // this.socket.on("monsterMoved", (monsterData) => {
    //   this.monsters.getChildren().forEach((monster) => {
    //     if (monsterData.id === monster.id) {
    //       monster.setPosition(monsterData.x, monsterData.y);
    //       //monster.body.x = monsterData.x;
    //       //monster.body.y = monsterData.y;
    //       monster.randomPosition = monsterData.randomPosition;
    //       monster.stateTime = monsterData.stateTime;
    //     }
    //   });
    // });

    //Npc
    this.socket.on("npcSpawned", (npc) => {
      this.spawnNpc(npc);
    });

    this.socket.on("currentNpcs", (npcs) => {
      Object.keys(npcs).forEach((id) => {
        this.spawnNpc(npcs[id]);
      });
    });

    this.socket.on("npcRemoved", (npc) => {
      this.spawnNpc(npc);
    });

    this.socket.on("updateScore", (goldAmount) => {
      this.events.emit("updateScore", goldAmount);
      this.player.gold = goldAmount;
      this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    });

    this.socket.on("updateXp", (exp, playerId) => {
      if (this.player.id === playerId) {
        this.player.updateExp(exp);
        this.uiScene.updatePlayerExpBar(this.player);
        this.uiScene.updatePlayerStatsUi(this.player);

        if (this.player.exp > this.player.maxExp) {
          this.socket.emit("levelUp", this.player);
          this.uiScene.popup.levelUp(this.player);
        }
      }
    });

    this.socket.on(
      "updatePlayerStats",
      (playerId, level, attack, defense, maxHealth, exp, maxExp) => {
        if (this.player.id === playerId) {
          this.player.updateStats(
            level,
            attack,
            defense,
            maxHealth,
            exp,
            maxExp
          );

          //Update stats
          this.player.updateHealthBar();

          this.uiScene.updatePlayerExpBar(this.player);
          this.uiScene.updatePlayerHealthBar(this.player);
          this.uiScene.updatePlayerStatsUi(this.player);
          this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
        }
      }
    );

    this.socket.on("updatePlayersScore", (playerId, goldAmount) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerId === otherPlayer.id) {
          otherPlayer.gold = goldAmount;
        }
      });
    });

    this.socket.on("updateMonsterHealth", (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.socket.on("updatePlayerHealth", (playerId, health) => {
      if (this.player.id === playerId) {
        if (health < this.player.health) {
          this.playerDamageAudio.play();
        }
        this.player.updateHealth(health);
        this.uiScene.updatePlayerHealthBar(this.player);
        this.uiScene.updatePlayerStatsUi(this.player);
        this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerId) {
            player.updateHealth(health);
          }
        });
      }
    });
    this.socket.on("respawnPlayer", (playerObject) => {
      if (this.player.id === playerObject.id) {
        this.playerDeathAudio.play();
        this.player.respawn(playerObject);
        this.uiScene.updatePlayerStatsUi(playerObject);
        this.uiScene.updatePlayerHealthBar(playerObject);
        this.uiScene.updatePlayerExpBar(playerObject);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerObject.id) {
            player.respawn(playerObject);
          }
        });
      }
    });

    this.socket.on("disconnected", (playerId) => {
      this.otherPlayers.getChildren().forEach((player) => {
        if (playerId === player.id) {
          player.cleanUp();
        }
      });
    });

    this.socket.on("invalidToken", () => {
      window.alert("Token is no longer valid. Please login again.");
      window.location.reload();
    });

    this.socket.on("newMessage", (messageObject) => {
      this.dialogWindow.addNewMessage(messageObject);
    });

    this.socket.on("currentItems", (items) => {
      Object.keys(items).forEach((id) => {
        this.spawnItem(items[id]);
      });
    });

    this.socket.on("itemSpawned", (item) => {
      this.spawnItem(item);
    });

    this.socket.on("updateItems", (playerObject) => {
      this.player.items = playerObject.items;
      this.player.attackValue = playerObject.attack;
      this.player.defenseValue = playerObject.defense;
      this.player.maxHealth = playerObject.maxHealth;
      this.player.gold = playerObject.gold;
      this.player.equipedItems = playerObject.equipedItems;
      this.player.updateHealthBar();
      this.uiScene.inventoryWindow.updateInventory(this.player);
      this.uiScene.playerStatsWindow.updateEquipment(this.player);
      this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    });

    this.socket.on("updatePlayersItems", (playerId, playerObject) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerId === otherPlayer.id) {
          otherPlayer.items = playerObject.items;
          otherPlayer.maxHealth = playerObject.maxHealth;
          otherPlayer.attackValue = playerObject.attack;
          otherPlayer.defenseValue = playerObject.defense;
          otherPlayer.equipedItems = playerObject.equipedItems;
          otherPlayer.updateHealthBar();
        }
      });
    });

    this.socket.on("itemRemoved", (itemId) => {
      this.items.getChildren().forEach((item) => {
        if (item.id === itemId) {
          item.makeInactive();
        }
      });
    });

    this.socket.on("droppedItemPicked", (item) => {
      this.items.getChildren().forEach((i) => {
        if (i.id === item.id) {
          i.makeInactive();
        }
      });
    });

    this.socket.on("monsterMovement", (monsters) => {
      console.log("monsterMovement");
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          if (monster.id === monsterId) {
            debugger;
            monster.move(monsters[monsterId].targetPosition);

            this.playerList.getChildren().forEach((otherPlayer) => {
              monster.followPlayer(otherPlayer, 90);
            });
          }
        });
      });
    });
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();

    this.dialogWindow = new DialogWindow(this, {
      x: this.scale.width,
    });

    // emit event to server that a new player joined
    this.socket.emit("newPlayer", getCookie("jwt"), this.selectedCharacter);

    this.scale.on("resize", this.resize, this);
    this.resize({ height: this.scale.height, width: this.scale.width });

    this.keyDownEventListener();

    this.input.on("pointerdown", () => {
      document.getElementById("chatInput").blur();
    });

    setInterval(() => {
      this.socket.emit("savePlayerData");
    }, 1000);
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
        this.socket.emit("sendMessage", message, getCookie("jwt"), this.player);
      }
    }
  }

  update() {
    this.dialogWindow.update();

    if (this.player) this.player.update(this.cursors);

    if (this.player) {
      // emit player movement to the server
      const {
        x,
        y,
        flipX,
        actionAActive,
        potionAActive,
        currentDirection,
        level,
      } = this.player;
      if (
        this.player.oldPosition &&
        (x !== this.player.oldPosition.x ||
          y !== this.player.oldPosition.y ||
          flipX !== this.player.oldPosition.flipX ||
          actionAActive !== this.player.oldPosition.actionAActive ||
          potionAActive !== this.player.oldPosition.potionAActive ||
          level !== this.player.oldPosition.level ||
          currentDirection !== this.player.oldPosition.currentDirection)
      ) {
        this.socket.emit("playerMovement", {
          x,
          y,
          flipX,
          actionAActive,
          potionAActive,
          currentDirection,
          level,
        });
      }
      // save old position data
      this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
        flipX: this.player.flipX,
        currentDirection: this.player.currentDirection,
        actionAActive: this.player.actionAActive,
        potionAActive: this.player.potionAActive,
        level: this.player.level,
      };
    }

    // this.monsters.getChildren().forEach((monster) => {
    //   if (monster.health > 0) {
    //     const { x, y, id, stateTime, randomPosition } = monster;

    //     if (
    //       monster.oldPosition &&
    //       (x !== monster.oldPosition.x ||
    //         y !== monster.oldPosition.y ||
    //         stateTime !== monster.oldPosition.stateTime ||
    //         randomPosition !== monster.oldPosition.randomPosition)
    //     ) {
    //       this.socket.emit("monsterMovement", {
    //         x,
    //         y,
    //         id,
    //         stateTime,
    //         randomPosition,
    //       });
    //     }
    //     // save old position data
    //     monster.oldPosition = {
    //       x: monster.x,
    //       y: monster.y,
    //       stateTime: monster.stateTime,
    //       randomPosition: monster.randomPosition,
    //     };

    //     this.playerList.getChildren().forEach((otherPlayer) => {
    //       monster.followPlayer(otherPlayer, 90);
    //     });
    //   }
    // });
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
      monster.setTexture(monsterObject.key, 0);
      monster.setPosition(monsterObject.x, monsterObject.y);
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
      this.enemyOverlap,
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
      this.socket.emit("monsterAttack", monster.id, player.id);
    }
  }

  weaponOverlapEnemy(weapon, enemyPlayer) {
    if (this.player.actionAActive && !this.player.hitbox) {
      debugger;
      this.player.hitbox = true;
      this.socket.emit("attackedPlayer", enemyPlayer.id);
    }
  }
  enemyOverlap(weapon, enemy) {
    if (this.player.actionAActive && !this.player.hitbox) {
      this.player.hitbox = true;

      const dis = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );

      this.socket.emit("monsterAttacked", enemy.id, dis);
    }
  }

  npcAction(player, npc) {
    npc.action(this.uiScene, player);
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    this.socket.emit("pickUpChest", chest.id);
  }

  collectItem(player, item) {
    // item pickup
    this.socket.emit("pickUpItem", item.id);
  }

  sendDropItemMessage(itemId) {
    this.socket.emit("playerDroppedItem", itemId);
    this.uiScene.inventoryWindow.updateInventory(this.player);
    this.uiScene.inventoryWindow.hideWindow();
    this.uiScene.inventoryWindow.showWindow(this.player);
  }

  sendMonsterDropItemMessage(x, y, item) {
    console.log("sendMonsterDropItemMessage")
    this.socket.emit("dropItem", x, y, item);
  }

  sendPlayerNearMonster(monsterId, { x, y }) {
    this.socket.emit("monsterFollowPlayer", monsterId, x, y);
  }

  sendEquipItemMessage(itemId) {
    this.socket.emit("playerEquipedItem", itemId);
    this.uiScene.inventoryWindow.updateInventory(this.player);
    this.uiScene.inventoryWindow.hideWindow();
    this.uiScene.inventoryWindow.showWindow(this.player);

    this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    this.uiScene.playerStatsWindow.hideWindow();
    this.uiScene.playerStatsWindow.showWindow(this.player);
  }

  sendBuyItemMessage(item) {
    this.socket.emit("sendBuyItemMessage", item);
    this.uiScene.playerStatsWindow.updatePlayerStats(this.player);
    this.uiScene.potionACountText.setText(this.player.potions);
  }

  sendUnequipItemMessage(itemId) {
    this.socket.emit("playerUnequipedItem", itemId);

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
