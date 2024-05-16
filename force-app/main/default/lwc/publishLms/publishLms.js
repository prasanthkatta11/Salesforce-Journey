import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import sendMessage from "@salesforce/messageChannel/sendMessage__c";

export default class PublishLms extends LightningElement {
  @wire(MessageContext)
  messageContext;

  handlePublish() {
    const payload = { lmsData: "Welcome to Prasanth's Practice" };
    publish(this.messageContext, sendMessage, payload);
  }
}
