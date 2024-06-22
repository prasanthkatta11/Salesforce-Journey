import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CreateContactModal extends LightningElement {
  @api recordId;
  isModalOpen = false;

  get flowInputVariables() {
    return [
      {
        name: "varAccoundId",
        type: "String",
        value: this.recordId
      }
    ];
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleStatusChange(event) {
    if (event.detail.status === "FINISHED") {
      const outputVariables = event.detail.outputVariables;
      let contactId;
      outputVariables.forEach((outputVar) => {
        if (outputVar.name === "varContactId") {
          contactId = outputVar.value;
        }
      });

      if (contactId) {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: `Contact Record Created Successfully with ID: ${contactId}`,
            variant: "success"
          })
        );
      } else {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Something went wrong"
          })
        );
      }
      this.isModalOpen = false;
    }
  }
}
