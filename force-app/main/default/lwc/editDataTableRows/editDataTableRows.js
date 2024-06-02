import { LightningElement, wire, api } from "lwc";
import getcontactListBasedOnAccount from "@salesforce/apex/ContactListController.getcontactListBasedOnAccount";
import { deleteRecord, updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import LEADSOURCE_FIELD from "@salesforce/schema/Contact.LeadSource";

const ACTIONS = [
  { label: "View", name: "view" },
  { label: "Edit", name: "edit" },
  { label: "Delete", name: "delete" }
];
const columns = [
  { label: "First Name", fieldName: "FirstName", editable: true },
  { label: "Last Name", fieldName: "LastName", editable: true },
  { label: "Title", fieldName: "Title", editable: true },
  { label: "Email", fieldName: "Email", type: "email", editable: true },
  { label: "Phone", fieldName: "Phone", type: "phone", editable: true },
  {
    label: "Lead Source",
    fieldName: "LeadSource",
    type: "customPickList",
    editable: true,
    typeAttributes: {
      options: { fieldName: "pickListOptions" },
      value: { fieldName: "LeadSource" },
      context: { fieldName: "Id" }
    }
  },
  { type: "action", typeAttributes: { rowActions: ACTIONS } }
];

export default class EditDataTableRows extends LightningElement {
  @api recordId;
  contactData = [];
  columns = columns;
  draftValues = [];
  contactRefresh;
  leadSourceOptions = [];
  viewMode = false;
  editMode = false;
  showModal = false;
  selectedRecordId;

  @wire(getcontactListBasedOnAccount, {
    accountId: "$recordId",
    pickList: "$leadSourceOptions"
  })
  getContactOutput(result) {
    this.contactRefresh = result;
    if (result.data) {
      console.log(
        "🚀 ~ EditDataTableRows ~ getContactOutput ~ data:",
        result.data
      );
      // this.contactData = result.data;
      this.contactData = result.data.map((currItem) => {
        // let pickListOptions = this.leadSourceOptions;
        return {
          ...currItem,
          pickListOptions: this.leadSourceOptions
        };
      });
      console.log(
        "🚀 ~ EditDataTableRows ~ this.contactData=result.data.map ~ this.contactData:",
        this.contactData
      );
    }
    if (result.error) {
      console.log(
        "🚀 ~ EditDataTableRows ~ getContactOutput ~ error:",
        result.error
      );
    }
  }

  @wire(getObjectInfo, {
    objectApiName: CONTACT_OBJECT
  })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: LEADSOURCE_FIELD
  })
  wirePicklist({ data, error }) {
    if (data) {
      this.leadSourceOptions = data.values;
      console.log("🚀 ~ EditDataTableRows ~ wirePicklist ~ data:", data);
    }
    if (error) {
      console.log("🚀 ~ EditDataTableRows ~ wirePicklist ~ error:", error);
    }
  }

  async saveHandler(event) {
    let records = event.detail.draftValues;
    console.log(
      "🚀 ~ EditDataTableRows ~ saveHandler ~ records:",
      JSON.stringify(records)
    );
    let updateRecordsArray = records.map((currItem) => {
      let fieldInput = { ...currItem };
      return {
        fields: fieldInput
      };
    });
    console.log(
      "🚀 ~ EditDataTableRows ~ updateRecordsArray ~ updateRecordsArray:",
      updateRecordsArray
    );
    this.draftValues = [];
    console.log(
      "🚀 ~ EditDataTableRows ~ saveHandler ~ this.draftValues:",
      this.draftValues
    );
    let updatedRecordsArrayPromise = updateRecordsArray.map((currItem) =>
      updateRecord(currItem)
    );
    console.log(
      "🚀 ~ EditDataTableRows ~ saveHandler ~ updatedRecordsArrayPromise:",
      updatedRecordsArrayPromise
    );

    await Promise.all(updatedRecordsArrayPromise);
    await refreshApex(this.contactRefresh);

    const toastEvent = new ShowToastEvent({
      title: "Success",
      message: "Records Updated Successfully",
      variant: "success"
    });
    this.dispatchEvent(toastEvent);
  }

  rowActionHandler(event) {
    let action = event.detail.action;
    let row = event.detail.row;
    this.viewMode = false;
    this.editMode = false;
    this.showModal = false;
    this.selectedRecordId = row.Id;

    if (action.name === "view") {
      this.viewMode = true;
      this.showModal = true;
    } else if (action.name === "edit") {
      this.editMode = true;
      this.showModal = true;
    } else if (action.name === "delete") {
      this.deleteHandler();
    }
  }

  async deleteHandler() {
    await deleteRecord(this.selectedRecordId);
    const event = new ShowToastEvent({
      title: "success",
      message: "Record deleted Successfully",
      variant: "success"
    });
    this.dispatchEvent(event);
    await refreshApex(this.contactRefresh);
  }

  async closeModal() {
    this.showModal = false;
    if (this.editMode) {
      await refreshApex(this.contactRefresh);
    }
  }
}
