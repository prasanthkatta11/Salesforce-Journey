@isTest
public class DailyLeadProcessorTest {
    
     @isTest
     private static void testSchedulableclass(){
        
        string CRON_EXP = '0 0 0 ? * * *';  //Midnight everyday
        List<Lead> leads = new List<Lead>();
        for(Integer i=0; i<500; i++){
            if(i<250){
                leads.add(new Lead(LastName = 'Prasanth ' +i, Company='Salesforce'));
            } else{
                leads.add(new Lead(LastName = 'Prasanth ' +i, Company='Salesforce', LeadSource='Other'));
            }
        }
        insert leads;
        
        Test.startTest();
        string jobId = System.schedule ('Process leads', CRON_EXP, new DailyLeadProcessor());
        Test.stopTest();
        
        List<Lead> updatedleads = [SELECT Id, LeadSource FROM Lead WHERE LeadSource = 'Dreamforce'];
        System.assertEquals(200, updatedleads.size(), 'ERROR: Atleast one record not updated correctly');
        
        List<CronTrigger> cts = [SELECT Id, TimesTriggered, NextFireTime FROM CronTrigger WHERE Id = :jobId];
        System.debug('Next Fire Time' + cts[0].NextFireTime);
    }
}