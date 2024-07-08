public with sharing class AccountContactsCount {
  @future
  public static void countOfContacts(Set<Id> accIds) {
    List<Account> accountsList = [
      SELECT Id, Name, Count_Of_Contacts__c, (SELECT Id, Name FROM Contacts)
      FROM Account
      WHERE Id IN :accIds
      WITH SECURITY_ENFORCED
    ];

    for (Account acc : accountsList) {
      acc.Count_Of_Contacts__c = acc.Contacts.size();
    }

    if (!accountsList.isEmpty()) {
      update accountsList;
    }
  }
}
