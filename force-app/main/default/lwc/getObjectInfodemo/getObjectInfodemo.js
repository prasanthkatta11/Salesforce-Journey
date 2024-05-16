import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { LightningElement, wire } from "lwc";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";

export default class GetObjectInfodemo extends LightningElement {
  accountInfo;
  accountError;
  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  outputFunction({ data, error }) {
    if (data) {
      console.log("🚀 ~ GetObjectInfodemo ~ outputFunction ~ data:", data);
      this.accountInfo = data;
      this.accountError = null;
    } else if (error) {
      console.log("🚀 ~ GetObjectInfodemo ~ outputFunction ~ error:", error);
      this.accountError = error;
      this.accountInfo = null;
    }
  }
}