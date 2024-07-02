public with sharing class ContactTriggerHandler {
  public static void accountsWithContactsCount(List<Contact> conList) {
    Set<Id> accountIds = new Set<Id>();

    // Collect all Account Ids from the Contact list
    for (Contact con : conList) {
      if (con.AccountId != null) {
        accountIds.add(con.AccountId);
      }
    }

    // Proceed only if there are account IDs to process
    if (!accountIds.isEmpty()) {
      // Check for field-level security and object permissions
      if (
        Schema.sObjectType.Account.isAccessible() &&
        Schema.sObjectType.Account.fields.Id.isAccessible() &&
        Schema.sObjectType.Account.fields.Name.isAccessible() &&
        Schema.sObjectType.Account.fields.Contact_Count__c.isUpdateable() &&
        Schema.sObjectType.Contact.isAccessible() &&
        Schema.sObjectType.Contact.fields.Id.isAccessible() &&
        Schema.sObjectType.Contact.fields.AccountId.isAccessible()
      ) {
        // Query Accounts with their related Contacts
        List<Account> accountsToUpdate = [
          SELECT Id, Name, (SELECT Id FROM Contacts)
          FROM Account
          WHERE Id IN :accountIds
          WITH USER_MODE
        ];

        // Create a separate list to hold updated accounts
        List<Account> accountsWithUpdatedCounts = new List<Account>();

        // Iterate over the queried accounts and update Contact_Count__c
        for (Account acc : accountsToUpdate) {
          acc.Contact_Count__c = acc.Contacts.size();
          accountsWithUpdatedCounts.add(acc);
        }

        // Update the accounts outside the loop
        if (!accountsWithUpdatedCounts.isEmpty()) {
          try {
            update accountsWithUpdatedCounts;
          } catch (DmlException e) {
            System.debug('DML Exception: ' + e.getMessage());
          }
        }
      } else {
        System.debug(
          'Insufficient permissions to access/update Account or Contact records.'
        );
      }
    }
  }
}