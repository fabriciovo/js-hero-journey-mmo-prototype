import * as Phaser from "phaser";
import UiButton from "../classes/UiButton";
import {
  createDiv,
  createLabel,
  createInputField,
  createBrElement,
} from "../utils/utils";
export default class CredentialsBaseScene extends Phaser.Scene {
  createUi(btnText, btnTarget, btn2Text, btn2Target, btn3Text, btn3Target) {
    // create title text
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 8,
      "MMORPG",
      { fontSize: "64px", fill: "#fff" }
    );
    this.titleText.setOrigin(0.5);

    this.button1 = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.6,
      "button1",
      "button2",
      btnText,
      btnTarget
    );

    this.button2 = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.75,
      "button1",
      "button2",
      btn2Text,
      btn2Target
    );

    if (btn3Text && btn3Target) {
      this.button3 = new UiButton(
        this,
        this.scale.width / 2,
        this.scale.height * 0.9,
        "button1",
        "button2",
        btn3Text,
        btn3Target
      );
    }
    this.createInput();

    this.scale.on("resize", this.resize, this);
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  createInput() {
    this.div = createDiv("input-div");
    this.loginLabel = createLabel("login", "Email:", "form-label");
    this.loginInput = createInputField(
      "text",
      "login",
      "login",
      "login-input",
      "Email Address"
    );
    this.passwordLabel = createLabel("password", "Password:", "form-label");
    this.passwordInput = createInputField(
      "password",
      "password",
      "password",
      "login-input"
    );
    this.div.append(this.loginLabel);
    this.div.append(createBrElement());
    this.div.append(this.loginInput);
    this.div.append(createBrElement());
    this.div.append(createBrElement());
    this.div.append(this.passwordLabel);
    this.div.append(createBrElement());
    this.div.append(this.passwordInput);
    document.body.appendChild(this.div);

    document.body.appendChild(this.div);
  }
  
  startScene(targetScene) {
    this.scale.removeListener("resize", this.resize);

    window.history.pushState({}, document.title, "/");
    this.div.parentNode.removeChild(this.div);
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
    this.titleText.setPosition(width / 2, height / 2);
    this.button1.setPosition(width / 2, height * 0.65);
    this.button2.setPosition(width / 2, height * 0.75);
    if (this.button3) this.button3.setPosition(width / 2, height * 0.9);
  }
}
