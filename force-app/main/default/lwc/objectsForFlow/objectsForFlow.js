import { LightningElement, api, track } from "lwc";

export default class ObjectsForFlow extends LightningElement {
  @track _contacts = [];

  set contacts(contacts = []) {
    this._contacts = [...contacts];
  }

  @api
  get contacts() {
    return this._contacts;
  }

  get items() {
    let contactEmailArray = this._contacts.map((currItem) => {
      return {
        type: "icon",
        label: "currItem.Email",
        name: "currItem.Email",
        iconName: "standard:contact",
        alternativeText: "Contact Email"
      };
    });
    return contactEmailArray;
  }
}
