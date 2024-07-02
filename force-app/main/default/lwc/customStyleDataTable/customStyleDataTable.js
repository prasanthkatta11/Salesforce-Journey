import { LightningElement, wire } from "lwc";
import getcontactListDataTable from "@salesforce/apex/contactListController.getcontactListDataTable";
const columns = [
  {
    label: "Name",
    type: "customName",
    typeAttributes: {
      contactName: { fieldName: "Name" }
    }
  },
  {
    label: "Account Name",
    fieldName: "accountLink",
    type: "url",
    typeAttributes: {
      label: { fieldName: "accountName" }
    },
    target: "_blank"
  },
  { label: "Title", fieldName: "Title" },
  {
    label: "Rank",
    fieldName: "Rank__c",
    type: "customRank",
    typeAttributes: {
      rankIcon: { fieldName: "rankIcon" }
    }
  },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Email", fieldName: "Email", type: "email" },
  {
    label: "Picture",
    type: "customPicture",
    typeAttributes: {
      pictureUrl: { fieldName: "Picture__c" }
    },
    cellAttributes: {
      Alignment: "centre"
    }
  }
];

export default class CustomStyleDataTable extends LightningElement {
  contacts;
  columns = columns;

  @wire(getcontactListDataTable)
  wiredcontacts({ data, error }) {
    if (data) {
      console.log("🚀 ~ CustomStyleDataTable ~ wiredcontacts ~ data:", data);
      this.contacts = data.map((record) => {
        let accountLink = "/" + record.AccountId;
        let accountName = record.Account.Name;
        let rankIcon = record.Rank__c > 1 ? "utility:ribbon" : "";
        return {
          ...record,
          accountLink: accountLink,
          accountName: accountName,
          rankIcon: rankIcon
        };
      });
      //this.contacts = data;
    } else if (error) {
      console.log("🚀 ~ CustomStyleDataTable ~ wiredcontacts ~ error:", error);
    }
  }
}