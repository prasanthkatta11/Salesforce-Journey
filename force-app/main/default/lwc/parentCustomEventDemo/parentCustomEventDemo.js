import { LightningElement, track } from "lwc";

export default class ParentCustomEventDemo extends LightningElement {
  @track displayMessage = false;

  display() {
    this.displayMessage = !this.displayMessage; // Toggle the displayMessage variable
  }
}