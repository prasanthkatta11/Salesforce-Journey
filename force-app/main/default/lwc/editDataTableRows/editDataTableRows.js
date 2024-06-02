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
const defaultActions = [{ label: "All", checked: true, name: "all" }];
const columns = [
  {
    label: "First Name",
    fieldName: "FirstName",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Last Name",
    fieldName: "LastName",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Title",
    fieldName: "Title",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Email",
    fieldName: "Email",
    type: "email",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Phone",
    fieldName: "Phone",
    type: "phone",
    editable: true,
    hideDefaultActions: true
  },
  {
    label: "Lead Source",
    fieldName: "LeadSource",
    type: "customPickList",
    editable: true,
    hideDefaultActions: true,
    typeAttributes: {
      options: { fieldName: "pickListOptions" },
      value: { fieldName: "LeadSource" },
      context: { fieldName: "Id" }
    },
    actions: defaultActions
  },
  {
    label: "Case Count",
    fieldName: "numberOfCases",
    type: "number",
    editable: false,
    hideDefaultActions: true
  },
  {
    label: "Is Bad Contact",
    fieldName: "isBadContact",
    type: "boolean",
    editable: false,
    hideDefaultActions: true
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
  leadSourceActions = [];
  loadCompletedActions = false;
  contactAllData = [];
  disableMe = true;

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
        let pickListOptions = this.leadSourceOptions;
        return {
          ...currItem,
          pickListOptions: pickListOptions
        };
      });
      console.log(
        "🚀 ~ EditDataTableRows ~ this.contactData=result.data.map ~ this.contactData:",
        this.contactData
      );
      this.contactAllData = [...this.contactData];
    } else if (result.error) {
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
      this.leadSourceActions = [];
      data.values.forEach((currItem) => {
        this.leadSourceActions.push({
          label: currItem.label,
          checked: false,
          name: currItem.value
        });
      });
      this.columns.forEach((currItem) => {
        if (currItem.fieldName === "LeadSource") {
          currItem.actions = [...currItem.actions, ...this.leadSourceActions];
        }
      });
      this.loadCompletedActions = true;
    } else if (error) {
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

  headerActionHandler(event) {
    let actionName = event.detail.action.name;
    console.log(
      "🚀 ~ EditDataTableRows ~ headerActionHandler ~ actionName:",
      actionName
    );
    const colDef = event.detail.columnDefinition;
    console.log(
      "🚀 ~ EditDataTableRows ~ headerActionHandler ~ colDef:",
      JSON.stringify(colDef)
    );

    const cols = [...this.columns];
    if (actionName === "all") {
      this.contactData = [...this.contactAllData];
    } else {
      this.contactData = this.contactAllData.filter(
        (currItem) => actionName === currItem.LeadSource
      );
    }
    cols
      .find((currItem) => currItem.fieldName === "LeadSource")
      .actions.forEach((currItem) => {
        if (currItem.name === actionName) {
          currItem.checked = true;
        } else {
          currItem.checked = false;
        }
      });
    this.columns = [...cols];
  }

  get displayData() {
    if (this.contactData && this.loadCompletedActions === true) {
      return true;
    } else {
      return false;
    }
  }

  selectRowsHandler(event) {
    const selectedRows = event.detail.selectedRows;
    if (selectedRows.length > 0) {
      this.disableMe = false;
    } else {
      this.disableMe = true;
    }
  }

  async deleteRecordsHandler() {
    let selectedRows = this.template
      .querySelector("c-custom-data-type")
      .getSelectedRows();

    let allGoodRecords = true;

    let selectedRecordsHaveCases = selectedRows.filter(
      (currItem) => currItem.numberOfCases > 0
    );

    if (selectedRecordsHaveCases.length > 0) {
      allGoodRecords = false;
    }

    if (allGoodRecords) {
      let deleteRecordsPerm = selectedRows
        .filter((currItem) => currItem.numberOfCases === 0)
        .map((currItem) => deleteRecord(currItem.Id));

      try {
        await Promise.all(deleteRecordsPerm);
        await refreshApex(this.contactRefresh);
        const toastEvent = new ShowToastEvent({
          title: "Success",
          message: "Records Deleted Successfully",
          variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.template.querySelector("c-custom-data-type").SelectedRows = [];
      } catch (e) {
        const toastEvent = new ShowToastEvent({
          title: "Error",
          message: "Records deletion failed " + e.body.message,
          variant: "error"
        });
        this.dispatchEvent(toastEvent);
      }
    } else {
      const toastEvent = new ShowToastEvent({
        title: "Error",
        message: "Records with cases cannot be deleted",
        variant: "error"
      });
      this.dispatchEvent(toastEvent);
    }
  }
}
