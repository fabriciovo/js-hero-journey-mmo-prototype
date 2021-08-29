class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,key,frame,id,health,maxHealth){
        super(scene,x,y,key,frame);
        this.scene = scene;
        this.id = id;

        this.health = health;
        this.maxHealth = health;

        this.scene.physics.world.enable(this);
        this.setImmovable(false);

        this.setScale(2);

        this.setCollideWorldBounds(true);

        this.scene.add.existing(this);
        this.setOrigin(0);
        this.createHealthBar();
        

    }

    update(){
        this.updateHealthBar();
    }

    makeActive(){
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
        this.updateHealthBar();
    }

    makeInactive(){
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
        this.healthBar.clear();
    }

    updateHealth(health){ 
        this.health = health;
        this.body.velocity.x -=600;
        this.body.setBounce(1)
        this.updateHealthBar();
    }
    createHealthBar(){
        this.healthBar = this.scene.add.graphics();
        this.healthBar.fillStyle(0xffffff,1);
        this.healthBar.fillRect(this.x,this.y-16,64,5);
        this.healthBar.fillGradientStyle(0xff0000,0xffffff,4);
        this.healthBar.fillRect(this.x,this.y-16,64 * this.health / this.maxHealth,5);
    }

    updateHealthBar(){
        this.healthBar.clear();
        this.healthBar = this.scene.add.graphics();
        this.healthBar.fillStyle(0xffffff,1);
        this.healthBar.fillRect(this.x,this.y-16,64,5);
        this.healthBar.fillGradientStyle(0xff0000,0xffffff,4);
        this.healthBar.fillRect(this.x,this.y-16,64 * this.health / this.maxHealth,5);

    }


}