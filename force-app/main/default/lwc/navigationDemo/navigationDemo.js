import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class NavigationDemo extends NavigationMixin(LightningElement) {
  handleNavigateToHome() {
    let pageRef = {
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    };
    this[NavigationMixin.Navigate](pageRef);
  }

  handleNavigateToListView() {
    let pageRef = {
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Account",
        actionName: "list"
      },
      state: {
        filterName: "AllAccounts"
      }
    };
    this[NavigationMixin.Navigate](pageRef);
  }

  handleNavigateToNewAccount() {
    let pageRef = {
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Account",
        actionName: "new"
      }
      //   state: {
      //     defaultFieldValues:
      //       "AccountNumber=ACXXXX,CustomCheckbox__c=true,Name=Salesforce%2C%20%231%3DCRM,NumberOfEmployees=35000,OwnerId=005XXXXXXXXXXXXXXX",
      //     nooverride: "1"
      //   }
    };
    this[NavigationMixin.Navigate](pageRef);
  }
}