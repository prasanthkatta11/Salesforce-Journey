import {
  createRecord,
  deleteRecord,
  updateRecord
} from "lightning/uiRecordApi";
import { LightningElement, wire } from "lwc";
import TASK_MANAGER_OBJECT from "@salesforce/schema/Task_Manager__c";
import TASK_NAME_FIELD from "@salesforce/schema/Task_Manager__c.Name";
import ID_FIELD from "@salesforce/schema/Task_Manager__c.Id";
import TASK_DATE_FIELD from "@salesforce/schema/Task_Manager__c.Task_Date__c";
import COMPLETED_DATE_FIELD from "@salesforce/schema/Task_Manager__c.Completed_Date__c";
import ISCOMPLETED_FIELD from "@salesforce/schema/Task_Manager__c.Is_Completed__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import loadAllIncompleteRecords from "@salesforce/apex/TaskManagerHelper.loadAllIncompleteRecords";
import loadAllCompleteRecords from "@salesforce/apex/TaskManagerHelper.loadAllCompleteRecords";

export default class ToDoComponent extends LightningElement {
  taskname = "";
  taskdate = null;
  taskId = "";
  incompletetask = [];
  completetask = [];
  inCompleteTaskResult;
  completeTaskResult;

  @wire(loadAllIncompleteRecords)
  wire_inCompleteRecords(result) {
    this.inCompleteTaskResult = result;
    let { data, error } = result;
    if (data) {
      console.log("🚀 ~ wire_inCompleteRecords ~ data:", data);
      this.incompletetask = data.map((currItem) => ({
        taskId: currItem.Id,
        taskname: currItem.Name,
        taskdate: currItem.Task_Date__c
      }));
      console.log(
        "🚀 ~ ToDoComponent ~ this.incompletetask ~ this.incompletetask:",
        this.incompletetask
      );
    } else if (error) {
      console.log("🚀 ~ wire_inCompleteRecords ~ error:", error);
    }
  }

  @wire(loadAllCompleteRecords)
  wire_CompleteRecords(result) {
    this.completeTaskResult = result;
    let { data, error } = result;
    if (data) {
      console.log("🚀 ~ wire_CompleteRecords ~ data:", data);
      this.completetask = data.map((currItem) => ({
        taskId: currItem.taskId,
        taskname: currItem.Name,
        taskdate: currItem.Task_Date__c
      }));
      console.log(
        "🚀 ~ ToDoComponent ~ this.completetask ~ this.completetask:",
        this.completetask
      );
    } else if (error) {
      console.log("🚀 ~ wire_CompleteRecords ~ error:", error);
    }
  }

  changeHandler(event) {
    let { name, value } = event.target;
    if (name === "taskname") {
      this.taskname = value;
    } else if (name === "taskdate") {
      this.taskdate = value;
    }
  }

  resetHandler() {
    this.taskname = "";
    this.taskdate = null;
  }

  addTaskHandler() {
    //if end date is missing, populate today's date as end date
    if (!this.taskdate) {
      this.taskdate = new Date().toISOString().slice(0, 10);
    }

    if (this.validateTask()) {
      let inputFields = {};
      inputFields[TASK_NAME_FIELD.fieldApiName] = this.taskname;
      inputFields[TASK_DATE_FIELD.fieldApiName] = this.taskdate;
      inputFields[ISCOMPLETED_FIELD.fieldApiName] = false;
      let recordInput = {
        apiName: TASK_MANAGER_OBJECT.objectApiName,
        fields: inputFields
      };
      createRecord(recordInput).then((result) => {
        console.log("🚀 ~ ToDoComponent ~ createRecord ~ result:", result);
        this.showToast("Success", "Record created successfully", "success");
        this.resetHandler();
        refreshApex(this.inCompleteTaskResult);
      });
      //   this.incompletetask = [
      //     ...this.incompletetask,
      //     {
      //       taskname: this.taskname,
      //       taskdate: this.taskdate
      //     }
      //   ];
      //   this.resetHandler();
      //   let sortedArray = this.sortTask(this.incompletetask);
      //   this.incompletetask = [...sortedArray];
      //   console.log(this.incompletetask);
    }
  }

  validateTask() {
    let isValid = true;
    let element = this.template.querySelector(".taskname");
    //Condition 1 ---check if task is Empty
    //Condition 2 ---if task name is not empty then check for duplicate
    if (!this.taskname) {
      //Check if task is empty
      isValid = false;
    } else {
      let taskitem = this.incompletetask.find(
        (currItem) =>
          currItem.taskname === this.taskname &&
          currItem.taskdate === this.taskdate
      );
      if (taskitem) {
        isValid = false;
        element.setCustomValidity("Duplicate task");
      }
    }
    if (isValid) {
      element.setCustomValidity("");
    }
    element.reportValidity();
    return isValid;
  }

  sortTask(inputArr) {
    let sortedArray = inputArr.sort(
      (a, b) => new Date(a.taskdate) - new Date(b.taskdate)
    );
    return sortedArray;
  }

  removeHandler(event) {
    //Remove from incomplete task array
    let recordId = event.target.name;
    console.log("🚀 ~ ToDoComponent ~ removeHandler ~ recordId:", recordId);
    deleteRecord(recordId)
      .then(() => {
        console.log("🚀 ~ ToDoComponent ~ removeHandler ~ recordId:", recordId);
        this.showToast("Deleted", "Record deleted successfully", "success");
        refreshApex(this.inCompleteTaskResult);
      })
      .catch((error) => {
        this.showToast("Deleted", "Record deletion failed", "success");
      });
    // this.incompletetask.splice(index, 1);
    // let sortedArray = this.sortTask(this.incompletetask);
    // this.incompletetask = [...sortedArray];
    // console.log(this.incompletetask);
  }

  completetaskHandler(event) {
    //remove from incomplete array
    //Add new task to completed items
    let recordId = event.target.name;
    this.refreshData(recordId);
  }

  dragStartHandler(event) {
    event.dataTransfer.setData("index", event.target.dataset.item);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  dropElementHandler(event) {
    let recordId = event.dataTransfer.getData("index");
    this.refreshData(recordId);
  }

  async refreshData(recordId) {
    let inputfields = {};
    inputfields[ID_FIELD.fieldApiName] = recordId;
    inputfields[ISCOMPLETED_FIELD.fieldApiName] = true;
    inputfields[COMPLETED_DATE_FIELD.fieldApiName] = new Date()
      .toISOString()
      .slice(0, 10);
    let recordInput = { fields: inputfields };

    try {
      await updateRecord(recordInput);
      await refreshApex(this.inCompleteTaskResult);
      await refreshApex(this.completeTaskResult);
      this.showToast("Updated", "Record updated successfully", "success");
    } catch (error) {
      console.log("🚀 ~ ToDoComponent ~ refreshData ~ error:", error);
    }
    // let removeItem = this.incompletetask.splice(index, 1);
    // let sortedArray = this.sortTask(this.incompletetask);
    // this.incompletetask = [...sortedArray];
    // console.log(this.incompletetask);
    // this.completetask = [...this.completetask, removeItem[0]];
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}