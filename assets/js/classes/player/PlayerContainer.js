const Direction = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    UP: 'UP',
    DOWN: 'DOWN'
}

class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame, health, maxHealth, id) {
        super(scene, x, y);
        this.scene = scene;
        this.velocity = 160
        this.currentDirection = Direction.RIGHT;
        this.playrAttacking = false;
        this.flipX = true;
        this.swordHit = false;


        this.health = health;
        this.maxHealth = maxHealth;
        this.id = id;

        this.setSize(32, 32);


        this.scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true);

        this.scene.add.existing(this);

        this.scene.cameras.main.startFollow(this);




        this.player = new Player(this.scene, 0, 0, key, frame);
        this.add(this.player);




        this.weapon = this.scene.add.image(40, 0, 'items', 4);
        this.scene.add.existing(this.weapon);

        this.scene.physics.world.enable(this.weapon);
        this.add(this.weapon);
        this.weapon.alpha = 0;

        this.createHealthBar();
    }

    preload() {

    }

    create() {

    }


    update(cursors) {
        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            // update the velocity on the player's physics body
            this.body.setVelocityX(-this.velocity);
            this.currentDirection = Direction.LEFT;
            this.weapon.setPosition(-40, 0);


        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.velocity);
            this.currentDirection = Direction.RIGHT;
            this.weapon.setPosition(40, 0);
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.velocity);
            this.currentDirection = Direction.UP;
            this.weapon.setPosition(0, -40);

        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.velocity);
            this.currentDirection = Direction.DOWN;
            this.weapon.setPosition(0, 40);
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking) {
            this.weapon.alpha = 1;
            this.playerAttacking = true;
            this.scene.time.delayedCall(150, () => {
                this.playerAttacking = false;
                this.swordHit = false;
            }, [], this)
        }

        if (this.playerAttacking) {
            this.weapon.angle -= 33;
        } else {
            if (this.currentDirection === Direction.DOWN) {
                this.weapon.setAngle(-270);
            }
            else if (this.currentDirection === Direction.UP) {
                this.weapon.setAngle(-90);
            }
            else {
                this.weapon.setAngle(0);
            }
            this.weapon.flipX = false;
            if (this.currentDirection === Direction.LEFT) {
                this.weapon.flipX = true;
            }
        }
        this.updateHealthBar();




        if (this.currentDirection === Direction.DOWN) {
            this.player.playAnimation('walk_down');
        }
        else if (this.currentDirection === Direction.UP) {
            this.player.playAnimation('walk_up');
        }else if(this.currentDirection === Direction.RIGHT) {
            this.player.playAnimation('walk_right');
        }else if(this.currentDirection === Direction.LEFT) {
            this.player.playAnimation('walk_right');
        }

        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.player.playAnimation('idle');
        }

    }

    respawn(playerObject) {
        this.health = playerObject.health;
        this.setPosition(playerObject.x, playerObject.y);
        this.updateHealthBar();
    }

    updateHealth(health) {
        this.health = health;
        this.updateHealthBar();
    }
    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x - 16, this.y - 20, 64, 5);
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.x - 32, this.y - 16, 64 * this.health / this.maxHealth, 5);
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar = this.scene.add.graphics();
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x, this.y - 16, 64, 5);
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.x, this.y - 16, 64 * this.health / this.maxHealth, 5);
    }
}