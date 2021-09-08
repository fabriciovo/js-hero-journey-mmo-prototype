import {
  postData,
  createLabel,
  createInputField,
  createBrElement,
  getParam,
} from "../utils/utils";
import CredentialsBaseScene from "./CredentialsBaseScene";

export default class ResetPasswordScene extends CredentialsBaseScene {
  constructor() {
    super("ResetPassword");
  }

  create() {
    this.createUi(
      "Update Password",
      this.updatePassword.bind(this),
      "back",
      this.startScene.bind(this, "Title")
    );


    this.createVerifyPasswordInput();
  }

  createVerifyPasswordInput() {
    this.verifyPassowrdLabel = createLabel(
      "verifiedPassword",
      "Verify Password",
      "form-label"
    );
    this.verifyPassowrdInput = createInputField(
      "password",
      "verifiedPassword",
      "verifiedPassword",
      "login-input"
    );

    this.div.append(createBrElement());
    this.div.append(createBrElement());
    this.div.append(this.verifyPassowrdLabel);
    this.div.append(createBrElement());
    this.div.append(this.verifyPassowrdInput);
  }

  updatePassword() {
    const token = getParam("token");
    const passwordValue = this.passwordInput.value;
    const verifyPassowrdValue = this.verifyPassowrdInput.value;
    const loginValue = this.loginInput.value;
    if (
      loginValue &&
      passwordValue &&
      verifyPassowrdValue &&
      verifyPassowrdValue === passwordValue
    ) {
      postData(`${SERVER_URL}/reset-password`, {
        password: passwordValue,
        verifiedPassword: verifyPassowrdValue,
        token: token,
        email:loginValue
      })
        .then((response) => {
          window.alert(response.message);

          if (response.status === 200) {
            this.startScene("Title");
          }
        })
        .catch((error) => {
          console.log(error);
          window.alert(error);
        });
    } else {
      alert("All fields must be filled out and the passwords must match");
    }
  }
}
