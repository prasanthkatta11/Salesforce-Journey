import { LightningElement } from "lwc";

export default class ParentCustomEventDemo extends LightningElement {
  displayMessage = false;
  display(event) {
    this.displayMessage = true;
  }
}