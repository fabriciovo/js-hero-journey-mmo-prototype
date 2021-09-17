import { postData, refreshTokenInterval } from "../utils/utils";
import CredentialsBaseScene from "./CredentialsBaseScene";

export default class LoginScene extends CredentialsBaseScene {
  constructor() {
    super("Login");
  }

  create() {
    this.createUi(
      "Login",
      this.login.bind(this),
      "Forgot Password",
      this.startScene.bind(this, "ForgotPassword"),
      "back",
      this.startScene.bind(this, "Title")
    );
  }


  login() {
    const loginValue = this.loginInput.value;
    const passwordValue = this.passwordInput.value;

    postData(`${SERVER_URL}/login`, {
      email: loginValue,
      password: passwordValue,
    })
      .then((response) => {
        if (response.status === 200) {
          refreshTokenInterval();
          this.startScene("Game");
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
}
