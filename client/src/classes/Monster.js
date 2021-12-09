import * as Phaser from "phaser";
import { DEPTH, healthBarTypes, iconsetWeaponTypes } from "../utils/utils";
import Entity from "./Entities/Entity";
import Bar from "./UI/Bar";

export default class Monster extends Entity {
  constructor(
    scene,
    x,
    y,
    key,
    frame,
    id,
    health,
    maxHealth,
    stateTime,
    randomPosition
  ) {
    super(scene, x, y, key, frame, id);
    this.health = health;
    this.maxHealth = maxHealth;
    this.scene = scene;
    this.key = key;
    this.stateTime = stateTime;
    this.randomPosition = randomPosition;
    this.dead = false;
    this.hitbox = false;
    this.monsterAttackActive = false;

    // this.text = this.scene.add.text(
    //   this.x,
    //   this.y - 50,
    //   "",
    //   {
    //     fontSize: "46px",
    //     fill: "#fff",
    //   }
    // );

    this.scene.anims.create({
      key: `normal_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `sides_${this.key}${this.id}`,
      frames: this.scene.anims.generateFrameNumbers(key, {
        frames: [4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `up_${this.key}${this.id}`,
      frames: this.scene.anims.generateFrameNumbers(key, {
        frames: [4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.play(`normal_${this.key}`);
    //this.createHealthBar();
    // this.timer = this.scene.time.delayedCall(
    //   this.stateTime,
    //   this.idle,
    //   [],
    //   this
    // );

    this.monsterAttack = this.scene.add.sprite(
      40,
      0,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD);

      this.scene.add.existing(this.monsterAttack);
      this.monsterAttack.setScale(2);
      this.scene.physics.world.enable(this.monsterAttack);
      this.monsterAttack.alpha = 0;

    //this.move();
  }

  createHealthBar() {
    debugger
    //Health bar
    // this.healthBar = new Bar(
    //   this.scene,
    //   this.x,
    //   this.y,
    //   "bar_sheet",
    //   healthBarTypes.LIFE_BAR,
    //   healthBarTypes.HOLDER,
    //   DEPTH.BARS
    // );
    // this.updateHealthBar();
  }

  updateHealthBar() {
    // this.healthBar.UpdateBar(
    //   this.x - 22,
    //   this.y - 22,
    //   this.health,
    //   this.maxHealth
    // );
  }

  updateHealth(health) {
    // this.health = health;
    // this.updateHealthBar();
  }

  update() {
    if (!this.dead) {
      this.updateHealthBar();
      this.animation();

      // this.text.setText("this.state.toString()");
      // this.text.x = this.x;
      // this.text.y = this.y - 40;

      // if (this.timer.getProgress().toString().substr(0, 4) === 0.0) {
      //   this.move();
      // }
    }
  }

  move(targetPosition) {
    debugger
    this.scene.physics.moveToObject(this, targetPosition, 90);
    // const distance = 164;
    // switch (this.randomPosition) {
    //   case 1:
    //     this.body.setVelocityX(distance);
    //     break;
    //   case 2:
    //     this.body.setVelocityX(-distance);
    //     break;
    //   case 3:
    //     this.body.setVelocityY(distance);
    //     break;
    //   case 4:
    //     this.body.setVelocityY(-distance);
    //     break;
    //   case 5:
    //     this.body.setVelocityX(distance);
    //     this.body.setVelocityY(distance);
    //     break;
    //   case 6:
    //     this.body.setVelocityX(distance);
    //     this.body.setVelocityY(-distance);
    //     break;
    //   case 7:
    //     this.body.setVelocityX(-distance);
    //     this.body.setVelocityY(distance);
    //     break;
    //   case 8:
    //     this.body.setVelocityX(-distance);
    //     this.body.setVelocityY(-distance);
    //     break;
    // }
    // this.stateTime = Phaser.Math.Between(1000, 3000);
    // // this.timer = this.scene.time.delayedCall(
    // //   this.stateTime,
    // //   this.idle,
    // //   [],
    // //   this
    // // );
  }

  followPlayer(playerPosition) {
    if (!playerPosition || this.dead) return;
    const dis = Phaser.Math.Distance.Between(
      playerPosition.x,
      playerPosition.y,
      this.x,
      this.y
    );

    if (dis < 200) {
      this.scene.sendPlayerNearMonster(this.id, playerPosition);
    }

    if (dis < 90) {
      this.attack();
    }
  }

  attack() {
    if(this.dead) return
    this.monsterAttackActive = true;
    this.scene.time.delayedCall(
      1000,
      () => {
        this.monsterAttackActive = false;
        this.hitbox = false;
      },
      [],
      this
    );
  }

  animation() {}

  damage() {}

  idle() {
    // this.body.setVelocityX(0);
    // this.body.setVelocityY(0);
    // this.stateTime = Phaser.Math.Between(1000, 3000);
    // this.randomPosition = randomNumber(1, 8);
    // this.timer = this.scene.time.delayedCall(
    //   this.stateTime,
    //   this.move,
    //   [],
    //   this
    // );
  }

  makeInactive() {
    super.makeInactive();
    //this.updateHealthBar();
    //this.healthBar.DestroyBar();
    this.dead = true;
  }

  makeActive() {
    super.makeActive();
    //this.createHealthBar();
    this.dead = false;
  }
}
