import { LightningElement, wire } from "lwc";
import getcontactListC from "@salesforce/apex/contactListController.getcontactListC";
import { publish, MessageContext } from "lightning/messageService";
import sendContact from "@salesforce/messageChannel/sendContact__c";

export default class ContactLists extends LightningElement {
  selectedContact;
  @wire(getcontactListC)
  contacts;

  @wire(MessageContext)
  messageContext;

  selectionHandler(event) {
    let selectedContactId = event.detail;
    this.selectedContact = this.contacts.data.find(
      (currItem) => currItem.Id === selectedContactId
    );
    const payload = { contactData: this.selectedContact };
    publish(this.messageContext, sendContact, payload);
  }
}
