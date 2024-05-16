import { LightningElement } from "lwc";

export default class JoinNameParent extends LightningElement {
  firstName = "";
  lastName = "";
  fullName = "";
  showOutput = false;

  handleInputField(event) {
    let { name, value } = event.target;
    if (name === "firstname") {
      this.firstName = value;
      console.log(this.firstName);
    } else if (name === "lastname") {
      this.lastName = value;
      console.log(this.lastName);
    }
  }
  // eslint-disable-next-line no-unused-vars
  handleCombine(event) {
    this.fullName = event.detail.fullName;
    this.showOutput = true;
    this.firstName = "";
    this.lastName = "";
  }
}