public class NewCaseListController {
    public List<Case> getNewCases(){
        List<Case> filterListCase = [SELECT Id, CaseNumber FROM Case WHERE status = 'New'];
        return filterListCase;
    }
}