public with sharing class infiniteLoadController {
  @AuraEnabled(cacheable=true)
  public static List<Account> loadDataById() {
    try {
      return [
        SELECT Id, Name, Industry, Rating
        FROM Account
        WITH USER_MODE
        ORDER BY Name, Id
        LIMIT 500
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Account> loadMoreData(String lastName, String lastId) {
    try {
      return [
        SELECT Id, Name, Industry, Rating
        FROM Account
        WHERE Name > :lastName OR (Name = :lastName AND Id > :lastId)
        WITH USER_MODE
        ORDER BY Name, Id
        LIMIT 500
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static Integer countOfAccounts() {
    try {
      AggregateResult agr = [
        SELECT Count(Id) recordCount
        FROM Account
        WITH USER_MODE
      ];
      return (Integer)agr.get('recordCount');
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}