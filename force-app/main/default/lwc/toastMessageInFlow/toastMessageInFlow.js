import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ToastMessageInFlow extends LightningElement {
  @track recordId;

  statusChangeHandler(event) {
    if (event.detail.status === "FINISHED") {
      const outputVariables = event.detail.outputVariables;
      outputVariables.forEach((outputVar) => {
        if (outputVar.name === "recordId") {
          this.recordId = outputVar.value;
          this.showToast();
        }
      });
    }
  }

  showToast() {
    const event = new ShowToastEvent({
      title: "Success",
      message: "Account created successfully! Record ID: " + this.recordId,
      variant: "success"
    });
    this.dispatchEvent(event);
  }
}
