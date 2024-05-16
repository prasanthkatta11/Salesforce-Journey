import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import sendMessage from "@salesforce/messageChannel/sendMessage__c";

export default class SubscribeLms extends LightningElement {
  subscription = null;
  message = "";

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        sendMessage,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  // Handler for message received by component
  handleMessage(message) {
    this.message = message.lmsData;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
