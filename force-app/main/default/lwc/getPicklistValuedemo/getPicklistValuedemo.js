import {
  getObjectInfo,
  getPicklistValues,
  getPicklistValuesByRecordType
} from "lightning/uiObjectInfoApi";
import { LightningElement, wire } from "lwc";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";

export default class GetPicklistValuedemo extends LightningElement {
  value;
  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  accountprop;

  @wire(getPicklistValues, {
    recordTypeId: "$accountprop.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
  })
  industryPicklist;

  @wire(getPicklistValuesByRecordType, {
    objectApiName: ACCOUNT_OBJECT,
    recordTypeId: "$accountprop.data.defaultRecordTypeId"
  })
  accountInfoFunction;
  //   accountInfoFunction({ data, error }) {
  //     if (data) {
  //       console.log(
  //         "🚀 ~ GetPicklistValuedemo ~ accountInfoFunction ~ data:",
  //         data
  //       );
  //     } else if (error) {
  //       console.log(
  //         "🚀 ~ GetPicklistValuedemo ~ accountInfoFunction ~ error:",
  //         error
  //       );
  //     }
  //   }

  handleChange(event) {
    this.value = event.target.value;
  }
}