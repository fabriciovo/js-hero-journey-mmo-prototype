class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,key,frame){
        super(scene,x,y,key,frame);
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.setImmovable(true);

        this.setScale(4);

        this.scene.add.existing(this);


        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 0, 1, 2, 1 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_right',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 9, 10 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_up',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 11, 12 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_down',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 13, 14 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack_down',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 15, 16 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack_up',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 17, 18 ] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack_right',
            frames: this.scene.anims.generateFrameNumbers('characters', { frames: [ 9, 10 ] }),
            frameRate: 6,
            repeat: -1
        });


        this.play('walk');
        
    }

    preload(){

    }

    create(){

    }

    playAnimation(key, children = true){
        this.play(key,children);
    }

}