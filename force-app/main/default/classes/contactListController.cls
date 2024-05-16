public with sharing class contactListController {
  @AuraEnabled(cacheable=true)
  public static List<Contact> getcontactListC() {
    List<Contact> conList = [
      SELECT Id, Name, FirstName, LastName, Title, Phone, Email, PhotoUrl
      FROM Contact
      WHERE PhotoUrl != NULL
      WITH USER_MODE
    ];
    return conList;
  }
}