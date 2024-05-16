import { LightningElement } from "lwc";

export default class ToDoComponent extends LightningElement {
  taskname = "";
  taskdate = null;
  incompletetask = [];
  completetask = [];

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
      this.incompletetask = [
        ...this.incompletetask,
        {
          taskname: this.taskname,
          taskdate: this.taskdate
        }
      ];
      this.resetHandler();
      let sortedArray = this.sortTask(this.incompletetask);
      this.incompletetask = [...sortedArray];
      console.log(this.incompletetask);
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
    let index = event.target.name;
    this.incompletetask.splice(index, 1);
    let sortedArray = this.sortTask(this.incompletetask);
    this.incompletetask = [...sortedArray];
    console.log(this.incompletetask);
  }

  completetaskHandler(event) {
    //remove from incomplete array
    //Add new task to completed items
    let index = event.target.name;
    this.refreshData(index);
  }

  dragStartHandler(event) {
    event.dataTransfer.setData("index", event.target.dataset.item);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  dropElementHandler(event) {
    let index = event.dataTransfer.getData("index");
    this.refreshData(index);
  }

  refreshData(index) {
    let removeItem = this.incompletetask.splice(index, 1);
    let sortedArray = this.sortTask(this.incompletetask);
    this.incompletetask = [...sortedArray];
    console.log(this.incompletetask);
    this.completetask = [...this.completetask, removeItem[0]];
  }
}