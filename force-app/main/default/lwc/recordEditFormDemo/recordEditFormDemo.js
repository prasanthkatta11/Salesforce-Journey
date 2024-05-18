/* eslint-disable no-unused-vars */
import { LightningElement, api } from "lwc";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";
import ACCOUNT_SLAEXPIRATIONDATE_FIELD from "@salesforce/schema/Account.SLAExpirationDate__c";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class RecordEditFormDemo extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api objectApiName;

  fields = {
    name: ACCOUNT_NAME_FIELD,
    industry: ACCOUNT_INDUSTRY_FIELD,
    sladate: ACCOUNT_SLAEXPIRATIONDATE_FIELD
  };

  successHandler(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.detail.id,
        objectApiName: this.objectApiName,
        actionName: "view"
      }
    });
  }

  errorHandler(event) {
    const cusevent = new ShowToastEvent({
      title: "Error",
      message: event.detail.message,
      variant: "error"
    });
    this.dispatchEvent(cusevent);
  }

  submitHandler(event) {
    //Check if industry is blank, populate energy
    event.preventDefault();
    const fields = event.detail.fields;
    if (!fields.Industry) {
      fields.Industry = "Energy";
    }
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  clickHandler(event) {
    let inputFields = this.template.querySelectorAll("lightning-input-field");
    inputFields.forEach((currItem) => currItem.reset());
  }
}
