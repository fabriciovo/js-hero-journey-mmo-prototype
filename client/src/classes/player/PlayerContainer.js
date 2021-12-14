import * as Phaser from "phaser";
import Player from "./Player";
import Direction from "../../utils/direction";
import Bow from "../Entities/weapons/Bow";
import Potion from "../Armory/Potion/Potion";
import {
  DEPTH,
  DestroyHealthBar,
  healthBarTypes,
  iconsetPotionsTypes,
  iconsetWeaponTypes,
} from "../../utils/utils";
import Bar from "../UI/Bar";

const weaponsTemp = [
  {
    frame: 0,
    name: "Small Wooden Sword",
    Description: "",
    PlayerHave: false,
  },
  {
    frame: 2,
    name: "Bow",
    Description: "",
    PlayerHave: false,
  },
];

const potionsTemp = [
  {
    frame: 0,
    name: "Small Potion",
    Description: "",
    PlayerHave: false,
  },
  {
    frame: 2,
    name: "Potion",
    Description: "",
    PlayerHave: false,
  },
];

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
    level,
    potions,
    weapons
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
    this.weapons = weaponsTemp;

    this.exp = exp;
    this.maxExp = maxExp;
    this.level = level;
    this.key = key;
    this.potions = potions;

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
      this.scene.cameras.main.roundPixels = false;
    }
    // create the player
    this.player = new Player(this.scene, 0, 0, this.key, frame);

    this.add(this.player);
    this.setDepth(DEPTH.ENTITIES);
    //Actions
    this.actionAActive = false;
    this.actionCActive = false;

    //creeate player input
    this.createInput();

    // create the weapons game object
    this.createWeapons();
    // create the player healthbar
    this.createPlayerBars();

    this.createPlayerName();
  }

  createPlayerBars() {
    //Health bar
    this.healthBar = new Bar(
      this.scene,
      this.x,
      this.y,
      "bar_sheet",
      healthBarTypes.LIFE_BAR,
      healthBarTypes.HOLDER,
      DEPTH.BARS
    );
    this.expBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  createPlayerName() {
    this.playerNameText = this.scene.make.text({
      x: this.x - 32,
      y: this.y - 68,
      text: this.playerName,
      style: {
        font: "14px monospace",
        fill: "#ffffff",
      },
    });
  }

  createInput() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    //set actions
    this.actionAButton = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );

    this.potionAButton = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.C
    );
  }

  updatePlayerName() {
    this.playerNameText.setPosition(this.x - 32, this.y - 68);
  }

  updateExp(exp) {
    this.exp += exp;
  }

  updateStats(level, attack, defense, maxHealth, exp, maxExp) {
    this.level = level;
    this.attackValue = attack;
    this.defenseValue = defense;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.exp = exp;
    this.maxExp = maxExp;
  }

  updateHealthBar() {
    this.healthBar.UpdateBar(
      this.x - 48,
      this.y - 40,
      this.health,
      this.maxHealth
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

  update() {
    this.body.setVelocity(0);
    if (this.mainPlayer) {
      if (this.cursors.left.isDown || this.mobileLeft) {
        this.body.setVelocityX(-this.velocity);
        this.currentDirection = Direction.LEFT;
        this.player.flipX = false;
        this.flipX = false;
      } else if (this.cursors.right.isDown || this.mobileRight) {
        this.body.setVelocityX(this.velocity);
        this.currentDirection = Direction.RIGHT;
        this.player.flipX = true;
        this.flipX = true;
      }
      if (this.cursors.up.isDown || this.mobileUp) {
        this.body.setVelocityY(-this.velocity);
        this.currentDirection = Direction.UP;
      } else if (this.cursors.down.isDown || this.mobileDown) {
        this.body.setVelocityY(this.velocity);
        this.currentDirection = Direction.DOWN;
      }

      if (
        (Phaser.Input.Keyboard.JustDown(this.actionAButton) ||
          this.mobileActionA) &&
        !this.actionAActive &&
        !this.potionAActive
      ) {
        this.actionAFunction();
      }

      if (
        Phaser.Input.Keyboard.JustDown(this.potionAButton) &&
        !this.potionAActive &&
        !this.actionAActive      ) {
        this.potionAFunction();
      }
    }

    if (this.currentDirection === Direction.UP) {
      this.actionA.setPosition(0, -40);
      this.player.playAnimation(`up_${this.key}`);
    } else if (this.currentDirection === Direction.DOWN) {
      this.actionA.setPosition(0, 40);

      this.player.playAnimation(`down_${this.key}`);
    } else if (this.currentDirection === Direction.RIGHT) {
      this.actionA.setPosition(40, 0);

      this.player.playAnimation(`right_${this.key}`);
    } else if (this.currentDirection === Direction.LEFT) {
      this.actionA.setPosition(-40, 0);

      this.player.playAnimation(`right_${this.key}`);
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
      //this.player.playAnimation("idle");
    }
    //this.playAnimation();
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

  potionAFunction() {
    if (this.potions > 0 && this.health < this.maxHealth) {
      this.potionAActive = true;

      if (this.mainPlayer) this.attackAudio.play();
      this.potions--;
      this.scene.uiScene.potionACountText.setText(this.potions.toString());
      this.scene.socket.emit("healthPotion", this.id, 20);

      this.scene.time.delayedCall(
        500,
        () => {
          this.potionAActive = false;
        },
        [],
        this
      );
    }
  }
  cleanUp() {
    this.setActive(false);
    this.setVisible(false);
    this.healthBar.DestroyBar();

    this.playerNameText.setText("");

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
    } else {
      this.scene.uiScene.popup.showWindow();
      this.scene.uiScene.popup.equipmentFull();
    }
  }

  buyItem(item) {
    if (this.gold >= item.price) {
      this.potions++;
      this.gold -= item.price;
      this.scene.sendBuyItemMessage(item);
    }else{
    }
  }

  unequipItem(itemNumber) {
    if (this.canUnequipItem()) {
      const keys = Object.keys(this.equipedItems);
      delete this.equipedItems[keys[itemNumber]];
      this.scene.sendUnequipItemMessage(keys[itemNumber]);
    }
  }

  createWeapons() {
    this.actionA = this.scene.add.sprite(
      40,
      0,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD
    );

    // create the potion game object
    this.potionA = new Potion(
      this.scene,
      this.x,
      this.y,
      "iconset",
      iconsetPotionsTypes.HEALTH_POTION,
      this.id
    );
    this.potionA.makeInactive();

    this.scene.add.existing(this.actionA);
    this.actionA.setScale(2);

    this.scene.physics.world.enable(this.actionA);
    this.add(this.actionA);
    this.actionA.alpha = 0;
  }
}
