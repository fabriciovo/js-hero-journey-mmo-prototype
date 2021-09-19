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

  create() {
    this.createUi(
      "Sign Up",
      this.singUp.bind(this),
      "Back",
      this.startScene.bind(this, "Login")
    );

    this.createUserNameInput();
  }

  createUserNameInput() {
    this.usernameLabel = createLabel("username", "Username", "form-label");
    this.usernameInput = createInputField(
      "text",
      "username",
      "username",
      "login-input",
      "Username"
    );

    this.div.append(createBrElement());
    this.div.append(createBrElement());
    this.div.append(this.usernameLabel);
    this.div.append(createBrElement());
    this.div.append(this.usernameInput);
  }

  singUp() {
    const loginValue = this.loginInput.value;
    const passwordValue = this.passwordInput.value;
    const usernameValue = this.usernameInput.value;

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
}
