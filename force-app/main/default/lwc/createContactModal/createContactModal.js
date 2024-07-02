import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

export default class CreateContactModal extends NavigationMixin(
  LightningElement
) {
  @api isModalOpen;

  closeModal() {
    this.dispatchEvent(new CustomEvent("closemodal"));
  }

  async handleStatusChange(event) {
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

        // Navigate to the newly created record
        await this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: contactId,
            objectApiName: "Contact",
            actionName: "view"
          }
        });
      } else {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Something went wrong"
          })
        );
      }
      this.dispatchEvent(new CustomEvent("closemodal"));
    }
  }
}