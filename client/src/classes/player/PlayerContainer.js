import * as Phaser from "phaser";
import Player from "./Player";
import Direction from "../../utils/direction";
import Bullets from "../weapons/RangedWeapon";

export default class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(
    scene,
    x,
    y,
    key,
    frame,
    health,
    maxHealth,
    id,
    attackAudio,
    mainPlayer,
    playerName,
    gold,
    defenseValue,
    attackValue,
    items,
    equipedItems,
    exp,
    expMax,
    level
  ) {
    super(scene, x, y);
    this.scene = scene; // the scene this container will be added to
    this.velocity = 160; // the velocity when moving our player
    this.currentDirection = Direction.RIGHT;
    this.flipX = true;
    this.hitbox = false;
    this.health = health;
    this.maxHealth = maxHealth;
    this.id = id;
    this.attackAudio = attackAudio;
    this.mainPlayer = mainPlayer;
    this.playerName = playerName;

    this.gold = gold;
    this.defenseValue = defenseValue;
    this.attackValue = attackValue;
    this.items = items || {};
    this.equipedItems = equipedItems || {};
    this.exp = exp;
    this.expMax = expMax;
    this.level = level;

    this.potions = 5;


    //Mobile
    this.mobileUp = false;
    this.mobileDown = false;
    this.mobileLeft = false;
    this.mobileRight = false;
    this.mobileActionA = false;

    // set a size on the container
    this.setSize(64, 64);
    // enable physics
    this.scene.physics.world.enable(this);
    // collide with world bounds
    this.body.setCollideWorldBounds(true);
    // add the player container to our existing scene
    this.scene.add.existing(this);
    // have the camera follow the player
    if (this.mainPlayer) {
      this.scene.cameras.main.startFollow(this);
    }
    // create the player
    this.player = new Player(this.scene, 0, 0, key, frame);
    this.add(this.player);
    console.log(this.player)

    //Actions
    this.actionAActive = false;
    this.actionBActive = false;
    this.actionCActive = false;


    // create the weapons game object
    this.actionA = this.scene.add.image(40, 0, "iconset", 2);
    //this.actionB =  this.scene.add.image(40, 0, "iconset", 2);//new RangedWeapon(this.scene);
    this.actionB = new Bullets(this.scene);
    // create the potion game object
    this.potionA = this.scene.add.image(40, 0, "iconset", 9);

    this.scene.add.existing(this.actionA);
    this.actionA.setScale(1.5);
    this.scene.physics.world.enable(this.actionA);
    this.add(this.actionA);
    this.actionA.alpha = 0;

    this.scene.add.existing(this.actionB)

    // create the player healthbar
    this.createHealthBar();

    this.createPlayerName();

    //set actions
    this.actionAButton = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );

    this.actionBButton = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );

    this.potionAButton = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.C
    );
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  createPlayerName() {
    this.playerNameText = this.scene.make.text({
      x: this.x - 32,
      y: this.y - 60,
      text: this.playerName,
      style: {
        font: "14px monospace",
        fill: "#ffffff",
      },
    });
  }

  updatePlayerName() {
    this.playerNameText.setPosition(this.x - 32, this.y - 60);
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(
      this.x - 32,
      this.y - 40,
      64 * (this.health / this.maxHealth),
      5
    );
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(
      this.x - 32,
      this.y - 40,
      64 * (this.health / this.maxHealth),
      5
    );
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  respawn(playerObject) {
    this.health = playerObject.health;
    this.setPosition(playerObject.x, playerObject.y);
    this.updateHealthBar();
    this.updatePlayerName();
  }

  update(cursors) {
    this.body.setVelocity(0);

    if (this.mainPlayer) {
      if (cursors.left.isDown || this.mobileLeft) {
        this.body.setVelocityX(-this.velocity);
        this.currentDirection = Direction.LEFT;
        this.player.flipX = false;
        this.flipX = false;
      } else if (cursors.right.isDown || this.mobileRight) {
        this.body.setVelocityX(this.velocity);
        this.currentDirection = Direction.RIGHT;
        this.player.flipX = true;

        this.flipX = true;
      }

      if (cursors.up.isDown || this.mobileUp) {
        this.body.setVelocityY(-this.velocity);
        this.currentDirection = Direction.UP;
      } else if (cursors.down.isDown || this.mobileDown) {
        this.body.setVelocityY(this.velocity);
        this.currentDirection = Direction.DOWN;
      }

      if (
        (Phaser.Input.Keyboard.JustDown(this.actionAButton) ||
          this.mobileActionA) &&
        !this.actionAActive
      ) {
        this.actionAFunction();
      }

      if (
        (Phaser.Input.Keyboard.JustDown(this.actionBButton)) &&
        !this.actionBActive
      ) {
        this.actionBFunction();
      }

      if (
        (Phaser.Input.Keyboard.JustDown(this.potionAButton)) &&
        !this.potionAActive
      ) {
        this.potionAFunction();
      }
    }

    if (this.currentDirection === Direction.UP) {
      this.actionA.setPosition(0, -40);
      this.player.playAnimation("up");
    } else if (this.currentDirection === Direction.DOWN) {
      this.actionA.setPosition(0, 40);
      this.player.playAnimation("down");
    } else if (this.currentDirection === Direction.RIGHT) {
      this.actionA.setPosition(40, 0);
      this.player.playAnimation("right");
    } else if (this.currentDirection === Direction.LEFT) {
      this.actionA.setPosition(-40, 0);
      this.player.playAnimation("right");
    }

    if (this.actionAActive) {
      if (this.actionA.flipX) {
        this.actionA.angle -= 10;
      } else {
        this.actionA.angle += 10;
      }
    } else {
      if (this.currentDirection === Direction.DOWN) {
        this.actionA.setAngle(-270);
      } else if (this.currentDirection === Direction.UP) {
        this.actionA.setAngle(-90);
      } else {
        this.actionA.setAngle(0);
      }

      this.actionA.flipX = false;
      if (this.currentDirection === Direction.LEFT) {
        this.actionA.flipX = true;
      }
    }

    this.updateHealthBar();
    this.updatePlayerName();

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.player.playAnimation("idle");
    }
  }

  updateFlipX() {
    this.player.flipX = this.flipX;
  }

  actionAFunction() {
    this.actionA.alpha = 1;
    this.actionAActive = true;
    this.mobileActionA = false;
    if (this.mainPlayer) this.attackAudio.play();
    this.scene.time.delayedCall(
      150,
      () => {
        this.actionA.alpha = 0;
        this.actionAActive = false;
        this.hitbox = false;
      },
      [],
      this
    );
  }

  actionBFunction() {
    //this.actionBActive = true;
    //this.actionB.attack(this.x, this.y);
    //if (this.mainPlayer) this.attackAudio.play();
    this.actionB.fireBullet(this.x, this.y);
  } 

  potionAFunction() {
    this.potionAActive = true;
    if (this.mainPlayer) this.attackAudio.play();
    this.scene.time.delayedCall(
      500,
      () => {
        this.actionAActive = false;
      },
      [],
      this
    );
  }
  cleanUp() {
    this.setActive(false);
    this.setVisible(false);
    this.healthBar.setVisible(false);
    this.playerNameText.setText("");
    this.healthBar.destroy();
    this.playerName.destroy();
    this.player.destroy();
    this.destroy();
  }

  dropItem(itemNumber) {
    const keys = Object.keys(this.items);
    delete this.items[keys[itemNumber]];
    this.scene.sendDropItemMessage(keys[itemNumber]);
  }
}
