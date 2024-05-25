import { LightningElement, wire } from "lwc";
import getAccountData from "@salesforce/apex/AccounHelper.getAccountData";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";

export default class ImperativeApexDemo extends LightningElement {
  data = [];
  columns = [
    { label: "Account Name", fieldName: "Name" },
    { label: "Account Industry", fieldName: "Industry" },
    { label: "Account Rating", fieldName: "Rating" }
  ];
  options = [];
  selectedIndustry;

  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  accountInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$accountInfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  industryPicklist;

  handleChange(event) {
    this.selectedIndustry = event.target.value;
  }

  clickHandler() {
    getAccountData({
      inputIndustry: this.selectedIndustry
    })
      .then((result) => {
        console.log("🚀 ~ ImperativeApexDemo ~ clickHandler ~ result:", result);
        this.data = result;
      })
      .catch((error) => {
        console.log("🚀 ~ ImperativeApexDemo ~ clickHandler ~ error:", error);
      });
  }
}
