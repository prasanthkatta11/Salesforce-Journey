import { LightningElement } from "lwc";

export default class ChildCustomeEventDemo extends LightningElement {
  handleClick(event) {
    // Dispatches a custom event called childCustomEvent
    this.dispatchEvent(new CustomEvent("displaymsg"));
  }
}