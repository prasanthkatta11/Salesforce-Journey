public with sharing class contactListController {
  @AuraEnabled(cacheable=true)
  public static List<Contact> getcontactListC() {
    List<Contact> conList = [
      SELECT Id, Name, FirstName, LastName, Title, Phone, Email, PhotoUrl
      FROM Contact
      WHERE PhotoUrl != NULL
    ];
    return conList;
  }

  @AuraEnabled(cacheable=true)
  public static List<Contact> getcontactListDataTable() {
    List<Contact> conList = [
      SELECT
        Id,
        Name,
        FirstName,
        LastName,
        Title,
        Phone,
        Email,
        Picture__c,
        Rank__c,
        AccountId,
        Account.Name
      FROM Contact
      WHERE AccountId != NULL
    ];
    return conList;
  }
}
