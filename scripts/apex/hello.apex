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
