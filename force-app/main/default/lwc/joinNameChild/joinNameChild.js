import { LightningElement, api } from "lwc";

export default class JoinNameChild extends LightningElement {
  @api firstName;
  @api lastName;

  combineNames() {
    const fullName = `${this.firstName.toUpperCase()} ${this.lastName.toUpperCase()}`;
    console.log(fullName);
    const combineEvent = new CustomEvent("combine", {
      detail: { fullName }
    });
    console.log("detail", fullName);
    this.dispatchEvent(combineEvent);
  }
}
