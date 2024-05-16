public class DailyLeadProcessor implements Schedulable{
    
    public void execute(SchedulableContext cxt){
        
        List<Lead> leads = [SELECT Id, LeadSource FROM Lead WHERE LeadSource = null LIMIT 200];
        for(Lead l : leads){
            l.LeadSource = 'Dreamforce';
        }
        Update leads;
    }
}