@RestResource(urlMapping='/acctMgmt/')
global with sharing class AccountManagement {
  @HttpGet
  global static AccountWrapper getTopAccounts() {
    Map<String, String> paramsMap = RestContext.request.params;
    String accIndustry = paramsMap.get('Industry');

    if (
      !Schema.sObjectType.Account.isAccessible() &&
      !Schema.sObjectType.Contact.isAccessible() &&
      !Schema.sObjectType.Case.isAccessible()
    ) {
      throw new SecurityException('Insufficient permissions to access records');
    }

    Map<Id, Account> accountsList = new Map<Id, Account>(
      [
        SELECT Id, Name, Industry, Rating, AnnualRevenue
        FROM Account
        WHERE AnnualRevenue != NULL OR Industry = :accIndustry
        ORDER BY AnnualRevenue DESC
      ]
    );

    Set<Id> accIdList = accountsList.keySet();

    List<Contact> contactsList = [
      SELECT Id, FirstName, LastName, Email
      FROM CONTACT
      WHERE AccountId IN :accIdList
    ];

    List<Case> casesList = [
      SELECT Id, Subject, Priority
      FROM Case
      WHERE AccountId IN :accIdList
    ];

    AccountWrapper accWrapper = new AccountWrapper();
    accWrapper.accList = accountsList.values();
    accWrapper.contList = contactsList;
    accWrapper.caseList = casesList;

    return accWrapper;
  }

  @HttpPost
  // global static String createAccount(
  //   String accName,
  //   String accIndustry,
  //   String accRating,
  //   Decimal accAnnualRevenue
  // ) {
  //   Account acc = new Account();
  //   acc.Name = accName;
  //   acc.Rating = accRating;
  //   acc.Industry = accIndustry;
  //   acc.AnnualRevenue = accAnnualRevenue;

  //   try {
  //     insert acc;
  //     return acc.id + ' inserted successfully';
  //   } catch (Exception ex) {
  //     return ex.getMessage();
  //   }
  // }

  global static String getAccountInformation(AccountInformation info) {
    if (
      !Schema.sObjectType.Account.isAccessible() &&
      !Schema.sObjectType.Contact.isAccessible() &&
      !Schema.sObjectType.Case.isAccessible()
    ) {
      throw new SecurityException('Insufficient permissions to access records');
    }

    Account accRecord = info.accountRecord;
    Contact contRecord = info.contactRecord;
    try {
      insert accRecord;
      contRecord.AccountId = accRecord.Id;
      insert contRecord;
      return accRecord.Id + ' and ' + contRecord.Id + ' inserted successfully';
    } catch (Exception ex) {
      return ex.getMessage();
    }
  }

  @HttpDelete
  global static String deleteAccount() {
    Map<String, String> paramsMap = RestContext.request.params;
    String accId = paramsMap.get('Id');
    List<Account> accList = [SELECT Id, Name FROM ACCOUNT WHERE Id = :accId];

    if (!accList.isEmpty()) {
      try {
        Account accToDelete = accList[0];
        delete accToDelete;
        return accToDelete.Id + ' deleted successfully';
      } catch (Exception ex) {
        return ex.getMessage();
      }
    } else {
      return 'No Records Found';
    }
  }

  global class AccountWrapper {
    global List<Account> accList;
    global List<Contact> contList;
    global List<Case> caseList;
  }

  global class AccountInformation {
    global Account accountRecord { get; set; }
    global Contact contactRecord { get; set; }
  }
}
