import { postData, refreshTokenInterval } from "../utils/utils";
import CredentialsBaseScene from "./CredentialsBaseScene";

export default class LoginScene extends CredentialsBaseScene {
  constructor() {
    super("Login");
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

    this.loginForm.setPerspective(800);

    this.loginForm.getChildByName("loginButton").addEventListener("click", this.login.bind(this), function(event) {
      this.login();
    });

    this.loginForm.getChildByName("forgotPassword").addEventListener("click", this.startScene.bind(this, "ForgotPassword"), function(event) {
      this.startScene("ForgotPassword");
    });

    this.loginForm.getChildByName("singUp").addEventListener("click", this.startScene.bind(this,"SignUp"), function(event) {
      this.startScene("SignUp");
    });



    this.background.setTilePosition(this.cameras.main.scrollX);
  }

  update() {
    this.background.tilePositionX += 0.3;
  }

  login() {
    
    const loginValue = this.loginForm.getChildByName("username").value;
    const passwordValue = this.loginForm.getChildByName("password").value;
    
    postData(`${SERVER_URL}/login`, {
      username: loginValue,
      password: passwordValue,
    })
      .then((response) => {
        if (response.status === 200) {
          refreshTokenInterval();
          this.startScene("Forest", "large");
          
        } else {
          console.log(response.error);
          window.alert("Invalid Username or Password!");
        }
      })
      .catch((error) => {
        console.log(error);
        window.alert("Invalid Username or Password!");
      });
  }

  startScene(targetScene,level) {
    this.scale.removeListener("resize", this.resize);

    window.history.pushState({}, document.title, "/");
    this.scene.start(targetScene, {level:level});
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
