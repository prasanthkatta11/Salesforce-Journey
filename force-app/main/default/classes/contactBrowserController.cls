public with sharing class contactBrowserController {
  @AuraEnabled(cacheable=true)
  public static List<Contact> getContactListByFilter(
    string accountId,
    string industry
  ) {
    string query = 'SELECT id, Name, Title, Email, Phone, PhotoUrl FROM Contact';
    List<String> filters = new List<String>();
    if (String.isNotBlank(accountid)) {
      filters.add('accountid =:accountid');
    }
    if (String.isNotBlank(industry)) {
      filters.add('Contact.Account.industry =:industry');
    }
    if (!filters.isEmpty()) {
      query += ' WHERE ' + String.join(filters, ' AND ');
    }
    query += ' WITH USER_MODE ';
    query += ' ORDER by name';
    System.debug('query ' + query);
    List<Contact> contactList = Database.query(query);
    return contactList;
  }
}