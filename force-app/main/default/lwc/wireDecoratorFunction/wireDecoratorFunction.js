/* eslint-disable no-unused-vars */
import { LightningElement, wire } from "lwc";
import getAccountData from "@salesforce/apex/AccounHelper.getAccountData";

const columns = [
  { label: "Account Name", fieldName: "Name" },
  { label: "Account Industry", fieldName: "Industry" },
  { label: "Account Rating", fieldName: "Rating" }
];

export default class WireDecoratorFunction extends LightningElement {
  accounts;
  errors;
  columns = columns;
  @wire(getAccountData) accountFunction({ data, error }) {
    if (data) {
      // eslint-disable-next-line no-unused-vars
      let updatedObj = {};
      let updatedAccounts = data.map((currItem) => {
        if (!currItem.hasOwnProperty("Rating")) {
          updatedObj = { ...currItem, Rating: "Warm" };
        } else {
          updatedObj = { ...currItem };
        }
        return updatedObj;
      });
      this.accounts = [...updatedAccounts];
      this.errors = null;
    } else if (error) {
      this.errors = error;
      this.accounts = null;
    }
  }
}