public with sharing class AccounHelper {
  @AuraEnabled(Cacheable=true)
  public static List<Account> getAccountData() {
    try {
      return [
        SELECT Id, Name, Industry, Rating
        FROM ACCOUNT
        WITH USER_MODE
        LIMIT 20
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(Cacheable=true)
  public static List<Account> getParentAccount() {
    try {
      return [
        SELECT Id, Name, Industry
        FROM ACCOUNT
        WHERE AnnualRevenue != NULL
        WITH USER_MODE
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
