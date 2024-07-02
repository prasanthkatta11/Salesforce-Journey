public with sharing class AccountTriggerHelper {
  public static void updateRelatedContactPhoneNumbers(
    List<Account> accList,
    Map<Id, Account> accOldMap
  ) {
    List<Contact> conList = new List<Contact>();
    Map<Id, Account> accMap = new Map<Id, Account>();

    for (Account acc : accList) {
      if (acc.Phone != accOldMap.get(acc.Id).Phone) {
        accMap.put(acc.Id, acc);
      }
    }

    if (
      Schema.sObjectType.Contact.isAccessible() &&
      Schema.sObjectType.Contact.fields.Phone.isUpdateable() &&
      Schema.sObjectType.Contact.fields.AccountId.isAccessible()
    ) {
      for (Contact con : [
        SELECT Id, AccountId, Phone, Name
        FROM Contact
        WHERE AccountId IN :accMap.keySet()
      ]) {
        if (accMap.containsKey(con.AccountId)) {
          con.Phone = accMap.get(con.AccountId).Phone;
          conList.add(con);
        }
      }

      if (conList.size() > 0) {
        update conList;
      }
    }
  }
}
