import { LightningElement, wire } from "lwc";
import getContactListByFilter from "@salesforce/apex/contactBrowserController.getContactListByFilter";

export default class ContactBrowser extends LightningElement {
  selectedAccoundId = "";
  selectedIndustry = "";

  @wire(getContactListByFilter, {
    accountId: "$selectedAccoundId",
    industry: "$selectedIndustry"
  })
  contactsFunction({ data, error }) {
    if (data) {
      console.log("🚀 ~ ContactBrowser ~ contactsFunction ~ data:", data);
    } else if (error) {
      console.log("🚀 ~ ContactBrowser ~ contactsFunction ~ error:", error);
    }
  }

  handleFilterChange(event) {
    this.selectedAccoundId = event.detail.accountId;
    this.selectedIndustry = event.detail.industry;
  }
}