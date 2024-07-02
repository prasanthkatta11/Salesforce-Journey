public with sharing class DeleteAccountsWithNoContacts {
  public static void deleteAccountsWithNoContacts() {
    Set<Id> accountsWithNoContacts = new Set<Id>();
    for (Account acc : [
      SELECT Id
      FROM Account
      WHERE Id NOT IN (SELECT AccountId FROM Contact)
    ]) {
      accountsWithNoContacts.add(acc.Id);
    }

    Set<Id> accountsWithClosedOpps = new Set<Id>();
    for (Opportunity opp : [
      SELECT AccountId
      FROM Opportunity
      WHERE IsClosed = TRUE AND AccountId IN :accountsWithNoContacts
    ]) {
      accountsWithClosedOpps.add(opp.AccountId);
    }
    accountsWithNoContacts.removeAll(accountsWithClosedOpps);

    if (!accountsWithNoContacts.isEmpty()) {
      Set<Id> accountsWithCases = new Set<Id>();
      for (Case c : [
        SELECT AccountId
        FROM Case
        WHERE AccountId IN :accountsWithNoContacts
      ]) {
        accountsWithCases.add(c.AccountId);
      }
      accountsWithNoContacts.removeAll(accountsWithCases);
    }

    Set<Id> accountsWithEntitlements = new Set<Id>();
    for (Entitlement ent : [
      SELECT AccountId
      FROM Entitlement
      WHERE AccountId IN :accountsWithNoContacts
    ]) {
      accountsWithEntitlements.add(ent.AccountId);
    }
    accountsWithNoContacts.removeAll(accountsWithEntitlements);

    if (!accountsWithNoContacts.isEmpty()) {
      try {
        List<Account> accountsToDelete = [
          SELECT Id
          FROM Account
          WHERE Id IN :accountsWithNoContacts
        ];
        delete accountsToDelete;
      } catch (DmlException e) {
        System.debug('DML Exception: ' + e.getMessage());
      }
    } else {
      System.debug(
        'No Accounts found with no contacts, no closed opportunities, and no entitlements.'
      );
    }
  }
}