public with sharing class contactListController {
  @AuraEnabled(cacheable=true)
  public static List<Contact> getcontactListC() {
    List<Contact> conList = [
      SELECT Id, Name, FirstName, LastName, Title, Phone, Email, PhotoUrl
      FROM Contact
      WHERE PhotoUrl != NULL
      WITH USER_MODE
    ];
    return conList;
  }

  @AuraEnabled(cacheable=true)
  public static List<Contact> getcontactListDataTable() {
    List<Contact> conList = [
      SELECT
        Id,
        Name,
        FirstName,
        LastName,
        Title,
        Phone,
        Email,
        Picture__c,
        Rank__c,
        AccountId,
        Account.Name
      FROM Contact
      WHERE AccountId != NULL
      WITH USER_MODE
    ];
    return conList;
  }

  @AuraEnabled(cacheable=true)
  public static List<contactWrapper> getcontactListBasedOnAccount(
    string accountId
  ) {
    List<Contact> conList = [
      SELECT
        Id,
        Name,
        FirstName,
        LastName,
        Title,
        Phone,
        Email,
        Picture__c,
        Rank__c,
        LeadSource,
        AccountId,
        Account.Name,
        (SELECT Id FROM Cases)
      FROM Contact
      WHERE AccountId = :accountId
      WITH USER_MODE
    ];
    List<contactWrapper> wrapperList = new List<contactWrapper>();
    for (Contact con : conList) {
      contactWrapper wrapper = new contactWrapper();
      wrapper.FirstName = con.FirstName;
      wrapper.lastName = con.LastName;
      wrapper.Title = con.Title;
      wrapper.Phone = con.Phone;
      wrapper.Email = con.Email;
      wrapper.LeadSource = con.LeadSource;
      wrapper.numberOfCases = con.Cases.size();
      if (con.LeadSource == 'Phone Inquiry' && String.isBlank(con.Phone)) {
        wrapper.isBadContact = true;
      } else {
        wrapper.isBadContact = false;
      }
      wrapper.Id = con.Id;

      wrapperList.add(wrapper);
    }
    return wrapperList;
  }

  public class contactWrapper {
    @AuraEnabled
    public string FirstName;
    @AuraEnabled
    public string lastName;
    @AuraEnabled
    public string Title;
    @AuraEnabled
    public string Phone;
    @AuraEnabled
    public string Email;
    @AuraEnabled
    public string LeadSource;
    @AuraEnabled
    public Integer numberOfCases;
    @AuraEnabled
    public Boolean isBadContact;
    @AuraEnabled
    public String Id;
  }
}
