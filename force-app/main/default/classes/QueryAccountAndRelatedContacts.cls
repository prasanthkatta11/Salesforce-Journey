public with sharing class QueryAccountAndRelatedContacts {
  public static void accountWithContacts() {
    List<Account> accList = [
      SELECT
        Id,
        Name,
        Industry,
        AnnualRevenue,
        (SELECT Id, Name, Email FROM Contacts)
      FROM Account
      WHERE Phone != NULL
      WITH USER_MODE
    ];

    if (!accList.isEmpty()) {
      for (Account acc : accList) {
        System.debug(
          'Account Name ' +
            acc.Name +
            ' Has ' +
            acc.Contacts.size() +
            ' Contacts'
        );
      }
    }
  }

  public static void accountWithOppoSum() {
    List<Account> accList = [
      SELECT
        Id,
        Name,
        (SELECT Id, Name, Amount FROM Opportunities WHERE Amount != NULL)
      FROM Account
      WHERE Phone != NULL
      WITH USER_MODE
    ];

    System.debug('Accounts retrieved: ' + accList.size());

    if (!accList.isEmpty()) {
      for (Account acc : accList) {
        Decimal oppSum = 0;
        for (Opportunity opp : acc.Opportunities) {
          oppSum += opp.Amount;
        }
        System.debug(
          'Account Name ' + acc.Name + ' Has ' + oppSum + ' Worth Opportunities'
        );
      }
    }
  }
}