import { LightningElement, wire } from "lwc";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

export default class ContactFilterComponent extends NavigationMixin(
  LightningElement
) {
  selectedAccountId = "";
  selectedIndustry = "";
  isButtonDisabled = true;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  accountinfo;

  @wire(getPicklistValues, {
    recordTypeId: "$accountinfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  industryPicklist;

  selectedRecordHandler(event) {
    this.selectedAccountId = event.detail;
    console.log(
      "🚀 ~ ContactFilterComponent ~ selectedRecordHandler ~ this.selectedAccountId:",
      this.selectedAccountId
    );
    if (this.selectedAccountId) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
    this.notifyFilterChange();
  }

  handleChange(event) {
    this.selectedIndustry = event.target.value;
    console.log(
      "🚀 ~ handlechange ~ this.selectedIndustry:",
      this.selectedIndustry
    );
    this.notifyFilterChange();
  }

  addNewContact() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Contact",
        actionName: "new"
      },
      state: {
        defaultFieldValues: encodeDefaultFieldValues({
          AccountId: this.selectedAccountId
        })
      }
    });
  }

  notifyFilterChange() {
    let myCustomEvent = new CustomEvent("filterchange", {
      detail: {
        accountId: this.selectedAccountId,
        industry: this.selectedIndustry
      }
    });
    this.dispatchEvent(myCustomEvent);
  }
}