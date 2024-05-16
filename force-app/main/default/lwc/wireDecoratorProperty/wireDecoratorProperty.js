import { LightningElement, wire } from "lwc";
import getAccountData from "@salesforce/apex/AccounHelper.getAccountData";

const columns = [
  { label: "Account Name", fieldName: "Name" },
  { label: "Account Industry", fieldName: "Industry" },
  { label: "Account Rating", fieldName: "Rating" }
];

export default class WireDecoratorProperty extends LightningElement {
  columns = columns;
  @wire(getAccountData) accounts;
}