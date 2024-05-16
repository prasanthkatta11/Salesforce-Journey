public with sharing class customLookupController {
  @AuraEnabled(cacheable=true)
  public static List<sObject> searchRecords(
    String objectApiName,
    String searchKey
  ) {
    List<sObject> sObjectList = new List<sObject>();
    try {
      if (String.isNotBlank(searchKey)) {
        String key = '%' + searchKey + '%';
        String queryString =
          'SELECT Id, Name FROM ' +
          objectApiName +
          ' WHERE Name LIKE :Key';
        sObjectList = Database.query(queryString, AccessLevel.USER_MODE);
      }
    } catch (Exception e) {
      system.debug('Error Message: ' + e.getMessage());
    }
    return sObjectList;
  }
}