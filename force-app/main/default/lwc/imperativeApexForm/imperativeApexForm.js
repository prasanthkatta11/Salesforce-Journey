import { LightningElement, wire, api } from "lwc";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_TICKER from "@salesforce/schema/Account.TickerSymbol";
import {
  getFieldValue,
  getRecord,
  notifyRecordUpdateAvailable
} from "lightning/uiRecordApi";
import updateTickerRecord from "@salesforce/apex/AccounHelper.updateTickerRecord";

export default class ImperativeApexForm extends LightningElement {
  @api recordId;
  accname = "";
  accticker = "";

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [ACCOUNT_NAME, ACCOUNT_TICKER]
  })
  outputFunction({ data, error }) {
    if (data) {
      console.log("🚀 ~ ImperativeApexForm ~ outputFunction ~ data:", data);
      this.accname = getFieldValue(data, ACCOUNT_NAME);
      this.accticker = getFieldValue(data, ACCOUNT_TICKER);
    } else if (error) {
      console.log("🚀 ~ ImperativeApexForm ~ outputFunction ~ error:", error);
    }
  }

  changeHandler(event) {
    this.accticker = event.target.value;
  }

  updateTicker() {
    updateTickerRecord({
      recordId: this.recordId,
      newTicker: this.accticker
    })
      .then((result) => {
        console.log("🚀 ~ ImperativeApexForm ~ updateTicker ~ result:", result);
        notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
      })
      .catch((error) => {
        console.log("🚀 ~ ImperativeApexForm ~ updateTicker ~ error:", error);
      });
  }
}
