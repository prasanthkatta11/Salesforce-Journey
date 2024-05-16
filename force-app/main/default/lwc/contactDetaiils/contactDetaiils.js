import { LightningElement, api } from "lwc";

export default class ContactDetaiils extends LightningElement {
  @api contact;

  clickHandler(event) {
    //Prevent the anchor element for Navigation
    event.preventDefault();
    const selectionEvent = new CustomEvent("selection", {
      detail: this.contact.Id
    });
    this.dispatchEvent(selectionEvent);
  }
}