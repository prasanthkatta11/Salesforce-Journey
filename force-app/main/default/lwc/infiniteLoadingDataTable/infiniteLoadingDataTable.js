import { LightningElement } from "lwc";
import loadDataById from "@salesforce/apex/infiniteLoadController.loadDataById";
import loadMoreData from "@salesforce/apex/infiniteLoadController.loadMoreData";
import countOfAccounts from "@salesforce/apex/infiniteLoadController.countOfAccounts";

const columns = [
  { label: "Name", fieldName: "Name" },
  { label: "Industry", fieldName: "Industry" },
  { label: "Rating", fieldName: "Rating" }
];

export default class InfiniteLoadingDataTable extends LightningElement {
  data = [];
  columns = columns;
  totalRecords = 0;
  recordsLoaded = 0;

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      this.totalRecords = await countOfAccounts();
      this.data = await loadDataById();
      this.recordsLoaded = this.data.length;
    } catch (error) {
      console.log(error);
    }
  }

  async loadMoreData(event) {
    try {
      const { target } = event;
      target.isLoading = true;
      let currentRecords = this.data;
      let lastRecord = currentRecords[currentRecords.length - 1];
      let newRecords = await loadMoreData({
        lastName: "lastRecord.Name",
        lastId: "lastRecord.Id"
      });
      this.data = [...currentRecords, ...newRecords];
      target.isLoading = false;
      this.recordsLoaded = this.data.length;
    } catch (error) {
      console.log(error);
    }
  }
}
