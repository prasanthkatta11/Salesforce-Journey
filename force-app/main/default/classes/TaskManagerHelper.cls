public with sharing class TaskManagerHelper {
  @AuraEnabled(cacheable=true)
  public static List<Task_Manager__c> loadAllIncompleteRecords() {
    try {
      return [
        SELECT Id, Name, Task_Date__c
        FROM Task_Manager__c
        WHERE ownerId = :UserInfo.getUserId() AND Is_Completed__c = FALSE
        WITH USER_MODE
        ORDER BY Task_Date__c
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Task_Manager__c> loadAllCompleteRecords() {
    try {
      return [
        SELECT Id, Name, Task_Date__c
        FROM Task_Manager__c
        WHERE Is_Completed__c = TRUE
        WITH USER_MODE
        ORDER BY Completed_Date__c DESC
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}