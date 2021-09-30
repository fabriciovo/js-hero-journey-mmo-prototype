import GameMap from "../classes/GameMap";
import PlayerContainer from "../classes/player/PlayerContainer";
import { getCookie } from "../utils/utils";
import GameScene from "./GameScene";

export default class ForestScene extends Phaser.Scene {
  constructor() {
    super("Forest");
  }

  init(data) {
    this.socket = this.sys.game.globals.socket;

    this.listenForSocketEvents();

    this.selectedCharacter = data.selectedCharacter || 0;
  }

  preload(){
    this.load.tilemapTiledJSON("map", "assets/level/dungeon_level.json");
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
          otherPlayer.actionBActive = player.actionBActive;
          otherPlayer.potionAActive = player.potionAActive;
          otherPlayer.currentDirection = player.currentDirection;
          if (player.actionAActive) {
            otherPlayer.actionAFunction();
          }
          if (player.actionBActive) {
            otherPlayer.actionBFunction();
          }
          if (player.potionAActive) {
            otherPlayer.potionAFunction();
          }
          otherPlayer.playAnimation();
        }
      });
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


  }

  create() {
    this.createMap("map","background");
    this.createGroups();
    this.createAudio();

    this.createInput();

    // emit event to server that a new player joined
    this.socket.emit("newPlayer", getCookie("jwt"), this.selectedCharacter);


    setInterval(() => {
      this.socket.emit("savePlayerData");
    }, 1000);
    this.door = this.add.image(600, 200, "iconset", 3);
    this.doors.add(this.door);
    console.log(this.player)
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
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


  update() {
    
    
    if (this.player) this.player.update(this.cursors);

    if (this.player) {
      // emit player movement to the server
      const {
        x,
        y,
        flipX,
        actionAActive,
        currentDirection,
        actionBActive,
        potionAActive,
        level,
      } = this.player;
      if (
        this.player.oldPosition &&
        (x != this.player.oldPosition.x ||
          y !== this.player.oldPosition.y ||
          flipX != this.player.oldPosition.flipX ||
          actionAActive !== this.player.oldPosition.actionAActive ||
          actionBActive !== this.player.oldPosition.actionBActive ||
          potionAActive !== this.player.oldPosition.potionAActive ||
          level !== this.player.oldPosition.level)
      ) {
        this.socket.emit("playerMovement", {
          x,
          y,
          flipX,
          actionAActive,
          actionBActive,
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
        currentDirection: currentDirection,
        actionAActive: this.player.actionAActive,
        actionBActive: this.player.actionBActive,
        potionAActive: this.player.potionAActive,
        level: this.player.level,
      };
    }
  }

  createPlayer(playerObject, mainPlayer) {
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
      playerObject.equipedItems,
      playerObject.exp,
      playerObject.maxExp,
      playerObject.level
    );

    if (!mainPlayer) {
      this.otherPlayers.add(newPlayerObject);
    } else {
      this.player = newPlayerObject;
    }

    newPlayerObject.setInteractive();
    newPlayerObject.on("pointerdown", () => {
      this.events.emit("showInventory", newPlayerObject, mainPlayer);
    });
  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    this.doors = this.physics.add.group();

    this.otherPlayers = this.physics.add.group();
    this.otherPlayers.runChildUpdate = true;

    this.rangedObjects = this.physics.add.group();
    this.rangedObjects.runChildUpdate = true;
  }

  addCollisions() {
    this.physics.add.overlap(
      this.player,
      this.doors,
      this.changeScene,
      null,
      this
    );
  }

  changeScene(player, door) {
    this.scene.restart();
    this.createMap("dungeon_map","background_rpg")
  }

  createMap(key,tilemap) {
    // create map

    //TODO - pra criar novas scenes isso tem q ir para um script independente
    this.gameMap = new GameMap(
      this,
      key,
      tilemap,
      "background",
      "blocked"
    );
  }
}
