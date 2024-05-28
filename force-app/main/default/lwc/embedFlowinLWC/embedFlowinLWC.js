import { LightningElement, api } from "lwc";

export default class EmbedFlowinLWC extends LightningElement {
  @api recordId;

  get inputVariables() {
    return [
      { name: "accountId", type: "String", value: this.recordId },
      { name: "operationType", type: "String", value: "Create Record" }
    ];
  }

  statusChangeHandler(event) {
    if (event.detail.status === "FINISHED") {
      let outputValues = event.detail.outputVariables;

      for (let i = 0; i < outputValues.length; i++) {
        let outputItem = outputValues[i];
        if (outputItem.name == "outputAccountId") {
          console.log(
            "🚀 ~ EmbedFlowinLWC ~ statusChangeHandler ~ outputItem.name:",
            outputItem.value
          );
        }
        if (outputItem.name == "outputOperationType") {
          console.log(
            "🚀 ~ EmbedFlowinLWC ~ statusChangeHandler ~ outputItem.name:",
            outputItem.value
          );
        }
      }
    }
  }
}