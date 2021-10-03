import * as Phaser from 'phaser';
import Entity from './Entities/Entity';

export default class Monster extends Entity {
  constructor(scene, x, y, key, frame, id, health, maxHealth) {
    super(scene, x, y, key, frame, id);
    this.health = health;
    this.maxHealth = maxHealth;

    this.scene.anims.create({
      key: "normal",
      frames: this.scene.anims.generateFrameNumbers(key, {
        frames: [0,1,2,3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "sides",
      frames: this.scene.anims.generateFrameNumbers(key, {
        frames: [4,5,6,7],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "up",
      frames: this.scene.anims.generateFrameNumbers(key, {
        frames: [4,5,6,7],
      }),
      frameRate: 8,
      repeat: -1,
    });


    this.play("normal");
    this.createHealthBar();
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x, this.y - 8, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(this.x, this.y - 8, 64 * (this.health / this.maxHealth), 5);
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  move(targetPosition){
    this.scene.physics.moveToObject(this, targetPosition, 40);
  }

  update() {
    this.updateHealthBar();
    this.animation();
  }

  followPlayer() {

  }

  Attack() {
    
  }

  animation(){
    
  }
}
