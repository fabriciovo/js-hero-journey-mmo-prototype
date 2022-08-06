
export default class LoginScene {
  constructor() {
   
  }

  preload() {
    this.load.html("loginform", "assets/html/loginform.html");
    this.load.image("backgroundLogin", "assets/html/bkg.png");
  }

  create() {

    this.background = this.add
      .tileSprite(
        0,
        0,
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        "backgroundLogin"
      )
      .setOrigin(0)
      .setScrollFactor(0, 1)
      .setScale(2);

    this.loginForm = this.add
      .dom(this.game.scale.width / 2, this.game.scale.height / 2)
      .createFromCache("loginform");


    this.background.setTilePosition(this.cameras.main.scrollX);
  }

  update() {
    this.background.tilePositionX += 0.3;
  }

  startScene(targetScene) {
    this.scale.removeListener("resize", this.resize);

    window.history.pushState({}, document.title, "/");
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    if (gameSize.width > 640) {
      this.loginForm.width = gameSize.width / 2;
      this.loginForm.height = gameSize.height / 2;
    } else {
      this.loginForm.width = gameSize.width / 2;
      this.loginForm.height = gameSize.height * 0.6;
    }
  }
}
