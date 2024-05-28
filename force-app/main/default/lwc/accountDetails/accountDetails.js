import { LightningElement, wire, api } from "lwc";
import getParentAccount from "@salesforce/apex/AccounHelper.getParentAccount";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import ACCOUNT_SLA_TYPE from "@salesforce/schema/Account.SLA__c";
import ACCOUNT_PARENT from "@salesforce/schema/Account.ParentId";
import ACCOUNT_ID from "@salesforce/schema/Account.Id";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_SLA_EXPIRY from "@salesforce/schema/Account.SLAExpirationDate__c";
import ACCOUNT_NOOFLOCATIONS from "@salesforce/schema/Account.NumberofLocations__c";
import ACCOUNT_DESCRIPTION from "@salesforce/schema/Account.Description";
import {
  createRecord,
  getFieldValue,
  getRecord,
  updateRecord,
  deleteRecord
} from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const fieldsToLoad = [
  ACCOUNT_PARENT,
  ACCOUNT_NAME,
  ACCOUNT_SLA_TYPE,
  ACCOUNT_NOOFLOCATIONS,
  ACCOUNT_DESCRIPTION,
  ACCOUNT_SLA_EXPIRY
];

export default class AccountDetails extends NavigationMixin(LightningElement) {
  parentoptions = [];
  selectedparentacc = "";
  selnoOfLocations = "1";
  selAccName = "";
  selExpDate = null;
  selDescrip = "";
  selSlaType = "";
  @api recordId;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: fieldsToLoad
  })
  wiredgetRecord_function({ data, error }) {
    if (data) {
      this.selectedparentacc = getFieldValue(data, ACCOUNT_PARENT);
      this.selAccName = getFieldValue(data, ACCOUNT_NAME);
      this.selExpDate = getFieldValue(data, ACCOUNT_SLA_EXPIRY);
      this.selSlaType = getFieldValue(data, ACCOUNT_SLA_TYPE);
      this.selnoOfLocations = getFieldValue(data, ACCOUNT_NOOFLOCATIONS);
      this.selDescrip = getFieldValue(data, ACCOUNT_DESCRIPTION);
    } else if (error) {
      console.log("error", JSON.stringify(error));
    }
  }

  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  wiredgetObjectInfo;

  @wire(getParentAccount)
  wired_getParentAccount({ data, error }) {
    this.parentoptions = [];
    if (data) {
      this.parentoptions = data.map((currItem) => ({
        label: currItem.Name,
        value: currItem.Id
      }));
      console.log("🚀 ~ AccountDetails ~ wired_getParentAccount ~ data:", data);
    } else if (error) {
      console.log(
        "🚀 ~ AccountDetails ~ wired_getParentAccount ~ error:",
        error
      );
    }
  }

  @wire(getObjectInfo, {
    objectApiName: ACCOUNT_OBJECT
  })
  accountobjectinfo;

  @wire(getPicklistValues, {
    recordTypeId: "$accountobjectinfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_SLA_TYPE
  })
  slatypepicklist;

  handleChange(event) {
    let { name, value } = event.target;
    if (name === "parentaccount") {
      this.selectedparentacc = value;
    }
    if (name === "accountname") {
      this.selAccName = value;
    }
    if (name === "slaexpdate") {
      this.selExpDate = value;
    }
    if (name === "slatype") {
      this.selSlaType = value;
    }
    if (name === "nooflocations") {
      this.selnoOfLocations = value;
    }
    if (name === "description") {
      this.selDescrip = value;
    }
  }

  saveRecord() {
    if (this.validateInput) {
      let inputfields = {};
      inputfields[ACCOUNT_PARENT.fieldApiName] = this.selectedparentacc;
      inputfields[ACCOUNT_NAME.fieldApiName] = this.selAccName;
      inputfields[ACCOUNT_SLA_EXPIRY.fieldApiName] = this.selExpDate;
      inputfields[ACCOUNT_SLA_TYPE.fieldApiName] = this.selSlaType;
      inputfields[ACCOUNT_DESCRIPTION.fieldApiName] = this.selDescrip;
      inputfields[ACCOUNT_NOOFLOCATIONS.fieldApiName] = this.selnoOfLocations;
      if (this.recordId) {
        inputfields[ACCOUNT_ID.fieldApiName] = this.recordId;
        updateRecord({
          fields: inputfields
        })
          .then((result) => {
            console.log("Updated account record with id: ", result.id);
            this.showToast();
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
          });
      } else {
        createRecord({
          apiName: ACCOUNT_OBJECT.objectApiName,
          fields: inputfields
        })
          .then((result) => {
            this[NavigationMixin.Navigate]({
              type: "standard__recordPage",
              attributes: {
                recordId: result.id,
                objectApiName: ACCOUNT_OBJECT.objectApiName,
                actionName: "view"
              }
            });
            console.log("Created account record with id: ", result.id);
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
          });
      }
    } else {
      console.log("Inputs not valid");
    }
  }

  deleteRecord() {
    deleteRecord(this.recordId)
      .then(() => {
        console.log("Deleted account record with id:", this.recordId);
        let pageref = {
          type: "standard__objectPage",
          attributes: {
            objectApiName: ACCOUNT_OBJECT.objectApiName,
            actionName: "list"
          },
          state: {
            filterName: "AllAccounts"
          }
        };
        console.log(
          "🚀 ~ AccountDetails ~ .then ~ pageref.attributes.ACCOUNT_OBJECT.objectApiName:",
          pageref.attributes.ACCOUNT_OBJECT.objectApiName
        );
        console.log(
          "🚀 ~ AccountDetails ~ .then ~ pageref.attributes.list:",
          pageref.attributes.list
        );
        console.log(
          "🚀 ~ AccountDetails ~ .then ~ pageref.state.AllAccounts:",
          pageref.state.AllAccounts
        );
        this[NavigationMixin.Navigate](pageref);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  validateInput() {
    let fields = Array.from(this.template.querySelectorAll(".validateme"));
    let isValid = fields.every((currItem) => currItem.checkValidity());
    return isValid;
  }

  get formTitle() {
    if (this.recordId) {
      return "Edit Account";
      // eslint-disable-next-line no-else-return
    } else {
      return "Create Account";
    }
  }

  get isDeleteAvailable() {
    // if (this.recordId) {
    //   return true;
    // }
    // return false;
    return !!this.recordId;
  }

  showToast() {
    if (this.recordId) {
      const event = new ShowToastEvent({
        title: "Success",
        variant: "success",

        message: "Record Updated Successfully"
      });
      this.dispatchEvent(event);
    } else {
      const event = new ShowToastEvent({
        title: "Success",
        variant: "Success",
        message: "Record Created Successfully"
      });
      this.dispatchEvent(event);
    }
  }
}