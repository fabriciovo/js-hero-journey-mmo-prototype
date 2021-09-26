import * as Phaser from "phaser";
import Player from "./Player";
import Direction from "../../utils/direction";
import Bullet from "../weapons/RangedWeapon";
import RangedWeapon from "../weapons/RangedWeapon";

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
    maxExp,
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
    this.maxExp = maxExp;
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
    console.log(this.player);

    //Actions
    this.actionAActive = false;
    this.actionBActive = false;
    this.actionCActive = false;

    // create the weapons game object
    this.actionA = this.scene.add.image(40, 0, "iconset", 2);
    this.actionB = new RangedWeapon(this.scene,this.x,this.y,"iconset", 2,this.id)
    this.actionB.makeInactive();
    this.scene.rangedObjects.add(this.actionB);

    //this.actionB = new Bullet(this.scene,this.x,this.y);
    //this.actionB = new Bullet(this.scene, this.x, this.y);
    // create the potion game object
    this.potionA = this.scene.add.image(40, 0, "iconset", 9);

    this.scene.add.existing(this.actionA);
    this.actionA.setScale(1.5);


    this.scene.physics.world.enable(this.actionA);
    this.add(this.actionA);
    this.actionA.alpha = 0;


    // create the player healthbar
    this.createPlayerBars();

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

  createPlayerBars() {
    this.expBar = this.scene.add.graphics();
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

  updateExp(exp) {
    this.exp += exp;
    console.log(this.exp);
  }

  updateStats(level, attack, defense, maxHealth, exp, maxExp) {
    console.log(level, attack, defense, maxHealth, maxExp);
    this.level = level;
    this.attackValue = attack;
    this.defenseValue = defense;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.exp = exp;
    this.maxExp = maxExp;
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
    debugger;

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
        Phaser.Input.Keyboard.JustDown(this.actionBButton) &&
        !this.actionBActive && !this.actionAActive
      ) {
        this.actionBFunction();
      }

      if (
        Phaser.Input.Keyboard.JustDown(this.potionAButton) &&
        !this.potionAActive && !this.actionAActive && !this.actionBActive
      ) {
        this.potionAFunction();
      }
    }

    if (this.currentDirection === Direction.UP) {
      this.actionA.setPosition(0, -40);
    } else if (this.currentDirection === Direction.DOWN) {
      this.actionA.setPosition(0, 40);
    } else if (this.currentDirection === Direction.RIGHT) {
      this.actionA.setPosition(40, 0);
    } else if (this.currentDirection === Direction.LEFT) {
      this.actionA.setPosition(-40, 0);
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


    this.playAnimation();

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

    this.actionB.makeActive();
    this.actionBActive = true;
    this.actionB.setPosition(this.x,this.y)
    if (this.mainPlayer) this.attackAudio.play();
    if (this.currentDirection === Direction.UP) {
      this.actionB.body.setVelocityY(-560)
    } else if (this.currentDirection === Direction.DOWN) {
      this.actionB.body.setVelocityY(560)
    } else if (this.currentDirection === Direction.RIGHT) {
      this.actionB.body.setVelocityX(560)
    } else if (this.currentDirection === Direction.LEFT) {
      this.actionB.body.setVelocityX(-560)
    }

    this.scene.time.delayedCall(
      2000,
      () => {
        this.actionB.makeInactive();
        this.actionBActive = false;
        this.hitbox = false;
        this.actionB.body.setVelocityX(0);
        this.actionB.body.setVelocityY(0)
      },
      [],
      this
    );

    
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

  canEquipItem() {
    if (Object.keys(this.equipedItems).length < 5) {
      return true;
    }
    return false;
  }

  canUnequipItem() {
    if (Object.keys(this.items).length < 5) {
      return true;
    }
    return false;
  }

  dropItem(itemNumber) {
    const keys = Object.keys(this.items);
    delete this.items[keys[itemNumber]];
    this.scene.sendDropItemMessage(keys[itemNumber]);
  }

  equipItem(itemNumber) {
    if (this.canEquipItem()) {
      const itemKeys = Object.keys(this.items);
      delete this.items[itemKeys[itemNumber]];
      this.scene.sendEquipItemMessage(itemKeys[itemNumber]);
    }else{
      this.scene.uiScene.popup.showWindow();
      this.scene.uiScene.popup.equipmentFull();
    }
  }

  unequipItem(itemNumber) {
    if (this.canUnequipItem()) {
      const keys = Object.keys(this.equipedItems);
      delete this.equipedItems[keys[itemNumber]];
      this.scene.sendUnequipItemMessage(keys[itemNumber]);
    }
  }

  playAnimation(){
    if (this.currentDirection === Direction.UP) {
      this.player.playAnimation("up");
    } else if (this.currentDirection === Direction.DOWN) {
      this.player.playAnimation("down");
    } else if (this.currentDirection === Direction.RIGHT) {
      this.player.playAnimation("right");
    } else if (this.currentDirection === Direction.LEFT) {
      this.player.playAnimation("right");
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.player.playAnimation("idle");
    }
  }
  
}
