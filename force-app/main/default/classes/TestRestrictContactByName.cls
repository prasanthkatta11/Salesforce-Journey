@isTest
public class TestRestrictContactByName {
    
@isTest   
    static void testInvalidLastName(){
        Contact invalidContact = new Contact(LastName='INVALIDNAME');
        Test.startTest();
        try{
            insert invalidContact;
            System.assert(false, 'Expected exception has not thrown');
           }catch(DmlException e){
            System.assertEquals('The Last Name "INVALIDNAME" is not allowed for DML', e.getDmlmessage(0));   
           }
        Test.stopTest();
    }

@isTest
    static void testValidName(){
    Contact validContact = new Contact(LastName='Katta');
    Test.startTest();
    insert validContact;
    Test.stopTest();
        
    Contact insertedContact = [Select Id, LastName FROM Contact WHERE Id = :validContact.Id];
    System.assertEquals('Katta', insertedContact.LastName);
    }
@isTest
    static void testNoInvalidLastName() {
    Contact validContact = new Contact(LastName = 'Doe');
    Test.startTest();
    insert validContact;
    Test.stopTest();
        
    Contact insertedContact = [SELECT Id, LastName FROM Contact WHERE Id = :validContact.Id];
    System.assertEquals('Doe', insertedContact.LastName);
    }
}