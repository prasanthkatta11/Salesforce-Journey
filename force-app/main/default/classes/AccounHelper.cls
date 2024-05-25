public with sharing class AccounHelper {
  @AuraEnabled(Cacheable=true)
  public static List<Account> getAccountData(string inputIndustry) {
    try {
      return [
        SELECT Id, Name, Industry, Rating
        FROM ACCOUNT
        WHERE Industry = :inputIndustry
        WITH USER_MODE
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

  @AuraEnabled
  public static String updateTickerRecord(String recordId, String newTicker) {
    // Check if the current user has permission to update the Account object
    if (!Schema.sObjectType.Account.isUpdateable()) {
      return 'Current user does not have permission to update Account records.';
    }

    // Continue with the update operation
    Account acc = new Account(Id = recordId, TickerSymbol = newTicker);
    try {
      update acc;
      return 'Ticker has been inserted successfully';
    } catch (Exception e) {
      return e.getMessage();
    }
  }
}
