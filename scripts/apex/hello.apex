for (List<Contact> conList : [
  SELECT Id, Picture__c, Rank__c, Title
  FROM Contact
  LIMIT 10
]) {
  for (Contact con : conList) {
    con.Picture__c = 'https://www.salesforce.com/content/dam/web/en_us/www2016/assets/images/logos/salesforce-logo-blue.svg';

    if (string.isBlank(con.Title)) {
      con.Rank__c = 1;
    } else {
      con.Rank__c = 2;
    }
  }
  update conList;
}

DeleteAccountsWithNoContacts.deleteAccountsWithNoContacts();

List<Account> accounts = [
  SELECT Id, Name, Count_Of_Contacts__c
  FROM Account
  LIMIT 10
];

Set<Id> accIds = new Set<Id>();
for (Account acc : accounts) {
  accIds.add(acc.Id);
}

AccountContactsCount.countOfContacts(accIds);

OppoProcessor oppProcess = new OppoProcessor();
Id BatchId = Database.executeBatch(oppProcess, 5);

List<Account> accList = [
  SELECT Id, Name
  FROM Account
  WHERE BillingState = 'NY'
];

Id parentAccId = [
  SELECT Id
  FROM Account
  WHERE Name = 'Parent Account'
]
.id;

parentAccountQueUpdate que = new parentAccountQueUpdate(accList, parentAccId);
Id jobId = System.enqueueJob(que);
