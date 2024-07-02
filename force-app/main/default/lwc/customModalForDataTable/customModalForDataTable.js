import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CustomModalForDataTable extends LightningElement {
  @api isDisplayMode = false;
  @api isEditMode = false;
  @api recordInputId;

  get header() {
    if (this.isDisplayMode) return "Display Contact Details";
    else if (this.isEditMode) return "Edit Contact Details";
    // eslint-disable-next-line no-else-return
    else return "";
  }

  closeModalHandler() {
    let customEvent = new CustomEvent("closemodal");
    this.dispatchEvent(customEvent);
  }

  successHandler() {
    this.showToast();
    this.closeModalHandler();
  }

  showToast() {
    const event = new ShowToastEvent({
      title: "success",
      message: "Records Updated Successfully",
      variant: "success"
    });
    this.dispatchEvent(event);
  }
}