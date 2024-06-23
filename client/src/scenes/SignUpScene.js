import CredentialsBaseScene from "./CredentialsBaseScene";
import {
  postData,
  createLabel,
  createInputField,
  createBrElement,
} from "../utils/utils";

export default class SignUpScene extends CredentialsBaseScene {
  constructor() {
    super("SignUp");
  }

  preload() {
    this.load.html("singupForm", "assets/html/signupform.html");
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
      .setScrollFactor(0)
      .setScale(2);

    this.singupForm = this.add
      .dom(this.game.scale.width / 2, this.game.scale.height / 2)
      .createFromCache("singupForm");

    this.singupForm.setPerspective(800);

    this.singupForm
      .getChildByName("singupButton")
      .addEventListener("click", this.singUp.bind(this), function (event) {
        this.singUp();
      });

    this.singupForm
      .getChildByName("login")
      .addEventListener(
        "click",
        this.startScene.bind(this, "Login"),
        function (event) {
          this.startScene("Login");
        }
      );

    this.background.setTilePosition(this.cameras.main.scrollX);

    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  update() {
    this.background.tilePositionX += 0.3;

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      singUp();
    }
  }

  singUp() {
    const loginValue = this.singupForm.getChildByName("email").value;
    const passwordValue = this.singupForm.getChildByName("password").value;
    const usernameValue = this.singupForm.getChildByName("username").value;

    if (loginValue && passwordValue && usernameValue) {
      postData(`${SERVER_URL}/signup`, {
        email: loginValue,
        password: passwordValue,
        username: usernameValue,
      })
        .then((response) => {
          if (response.status === 200) {
            alert("Account Created!");
            this.startScene("Login");
          } else {
            console.log(response.error);
            window.alert(response.error);
          }
        })
        .catch((error) => {
          console.log(error);
          window.alert(error);
        });
    } else {
      alert("All fields must be filled out");
    }
  }

  startScene(targetScene) {
    this.scale.removeListener("resize", this.resize);

    window.history.pushState({}, document.title, "/");
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    if (gameSize.width > 640) {
      this.singupForm.width = gameSize.width / 2;
      this.singupForm.height = gameSize.height / 2;
    } else {
      this.singupForm.width = gameSize.width / 2;
      this.singupForm.height = gameSize.height * 0.6;
    }
  }
}
