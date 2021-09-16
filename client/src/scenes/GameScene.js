import * as Phaser from "phaser";
import PlayerContainer from "../classes/player/PlayerContainer";
import Chest from "../classes/Chest";
import Monster from "../classes/Monster";
import GameMap from "../classes/GameMap";
import { getCookie } from "../utils/utils";
import DialogWindow from "../classes/window/DialogWindow";
import Item from "../classes/items/Item";
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.scene.launch("Ui");

    this.socket = this.sys.game.globals.socket;

    this.listenForSocketEvents();

    this.selectedCharacter = data.selectedCharacter || 0;
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
          otherPlayer.playerAttacking = player.playerAttacking;
          otherPlayer.currentDirection = player.currentDirection;
          if (player.playerAttacking) {
            otherPlayer.attack();
          }
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
        if (monster.id === monsterId) {
          monster.makeInactive();
          this.monsterDeathAudio.play();
        }
      });
    });

    this.socket.on("monsterMovement", (monsters) => {
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          if (monster.id === monsterId) {
            this.physics.moveToObject(monster, monsters[monsterId], 40);
          }
        });
      });
    });

    this.socket.on("updateScore", (goldAmount) => {
      this.events.emit("updateScore", goldAmount);
      this.player.gold = goldAmount;
    });
  
    this.socket.on("updatePlayersScore", (playerId,goldAmount) => {
      this.otherPlayers.getChildren().forEach(otherPlayer =>{
        if(playerId === otherPlayer.id){
          otherPlayer.gold = goldAmount;
        }
      })
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
      console.log("updateItems")
      console.log(playerObject)
      this.player.items = playerObject.items;
      this.player.attackValue = playerObject.attack;
      this.player.defenseValue = playerObject.defense;
      this.player.maxHealth = playerObject.maxHealth;
      this.player.updateHealthBar();
    });

    this.socket.on('updatePlayersItems', (playerId, playerObject) => {
      console.log(playerId)

      console.log(playerObject)
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
      if (playerId === otherPlayer.id) {
      otherPlayer.items = playerObject.items;
      otherPlayer.maxHealth = playerObject.maxHealth;
      otherPlayer.attackValue = playerObject.attack;
      otherPlayer.defenseValue = playerObject.defense;
      otherPlayer.updateHealthBar();
      console.log(playerObject)
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

    setInterval(()=>{
      this.socket.emit("savePlayerData")
      console.log("timer")
    },1000)
  }

  keyDownEventListener() {
    this.inputMessageField = document.getElementById("chatInput");
    window.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
       this.sendMessage();
       
      } else if (event.key === 32) {
        if (document.activeElement === this.inputMessageField) {
          this.inputMessageField.value = `${this.inputMessageField.value} `;
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
      const { x, y, flipX, playerAttacking, currentDirection } = this.player;
      if (
        this.player.oldPosition &&
        (x != this.player.oldPosition.x ||
          y !== this.player.oldPosition.y ||
          flipX != this.player.oldPosition.flipX ||
          playerAttacking !== this.player.oldPosition.playerAttacking)
      ) {
        this.socket.emit("playerMovement", {
          x,
          y,
          flipX,
          playerAttacking,
          currentDirection,
        });
      }
      // save old position data
      this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
        flipX: this.player.flipX,
        playerAttacking: this.player.playerAttacking,
      };
      

    }
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
    console.log(playerObject)
    const newPlayerObject = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      "characters",
      playerObject.frame,
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
    );

    if (!mainPlayer) {
      this.otherPlayers.add(newPlayerObject);
    } else {
      this.player = newPlayerObject;
    }

    newPlayerObject.setInteractive();
    newPlayerObject.on('pointerdown', ()=>{
      this.events.emit('showInventory', newPlayerObject, mainPlayer)
    })
  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create a monster group
    this.monsters = this.physics.add.group();
    this.monsters.runChildUpdate = true;

    this.otherPlayers = this.physics.add.group();
    this.otherPlayers.runChildUpdate = true;

    // create a chest group
    this.items = this.physics.add.group();
  }
  spawnItem(itemObject) {
    let item = this.items.getFirstDead();
    if (!item) {
      item = new Item(
        this,
        itemObject.x * 2,
        itemObject.y * 2,
        "tools",
        itemObject.frame,
        itemObject.id
      );
      // add item to items group
      this.items.add(item);
    } else {
      item.id = itemObject.id;
      item.frame = itemObject.frame;
      item.setFrame(item.frame);
      item.setPosition(itemObject.x * 2, itemObject.y * 2);
      item.makeActive();
    }
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();
    if (!chest) {
      chest = new Chest(
        this,
        chestObject.x * 2,
        chestObject.y * 2,
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
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
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
        "monsters",
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth
      );
      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture("monsters", monsterObject.frame);
      monster.setPosition(monsterObject.x, monsterObject.y);
      monster.makeActive();
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between the player and the tiled blocked layer
    this.physics.add.collider(this.player, this.gameMap.blockedLayer);
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
    // check for overlaps between the player's weapon and monster game objects
    this.physics.add.overlap(
      this.player.weapon,
      this.monsters,
      this.enemyOverlap,
      null,
      this
    );
    // check for collision betwen the player and other players
    /*this.physics.add.collider(
      this.otherPlayers,
      this.player,
      this.pvpCollider,
      false,
      this
    );*/
    // check for overlaps between the player's weapon and other player game objects
    this.physics.add.overlap(
      this.player.weapon,
      this.otherPlayers,
      this.weaponOverlapEnemy,
      false,
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
  }

  pvpCollider(player, otherPlayer) {
    this.player.body.setVelocity(0);
    otherPlayer.body.setVelocity(0);
  }

  weaponOverlapEnemy(player, enemyPlayer) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.socket.emit("attackedPlayer", enemyPlayer.id);
    }
  }
  enemyOverlap(weapon, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.socket.emit("monsterAttacked", enemy.id);
    }
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

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
    this.dialogWindow.resize(gameSize);
  }
}
