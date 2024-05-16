/* eslint-disable no-unused-vars */
/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, api } from "lwc";
import searchRecords from "@salesforce/apex/customLookupController.searchRecords";
const DELAY = 300;

export default class CustomLookup extends LightningElement {
  @api apiName = "Account";
  searchValue;
  @api objectLabel = "Account";
  @api iconName = "standard:account";
  delayTimeout;
  selectedRecord = {
    selectedId: "",
    selectedName: ""
  };
  displayOptions = false;

  get isRecordSelected() {
    return this.selectedRecord.selectedId === "" ? false : true;
  }

  @wire(searchRecords, {
    objectApiName: "$apiName",
    searchKey: "$searchValue"
  })
  outputs;

  changeHandler(event) {
    window.clearTimeout(this.delayTimeout);
    let enteredValue = event.target.value;
    this.delayTimeout = setTimeout(() => {
      this.searchValue = enteredValue;
      this.displayOptions = true;
    }, DELAY);
  }

  clickHandler(event) {
    let selectedId = event.currentTarget.dataset.item;
    console.log("Selected Id", selectedId);
    let outputRecord = this.outputs.data.find(
      (currItem) => currItem.Id === selectedId
    );
    this.selectedRecord = {
      selectedId: outputRecord.Id,
      selectedName: outputRecord.Name
    };
    this.sendSelection();
    console.log("selectedName", this.selectedRecord.selectedName);
    this.displayOptions = false;
  }

  removalSelectionHandler(event) {
    this.selectedRecord = {
      selectedId: "",
      selectedName: ""
    };
    this.sendSelection();
    this.displayOptions = false;
    console.log("selectedName", this.selectedRecord.selectedName);
  }

  sendSelection() {
    const myselectionEvent = new CustomEvent("selectedrec", {
      detail: this.selectedRecord.selectedId
    });
    this.dispatchEvent(myselectionEvent);
  }
}