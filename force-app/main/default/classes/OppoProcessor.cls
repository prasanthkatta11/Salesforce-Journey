public with sharing class OppoProcessor implements Database.Batchable<SObject>, Database.stateful {
  public integer recordCount = 0;

  public Database.QueryLocator start(Database.BatchableContext bc) {
    return Database.getQueryLocator([SELECT id, LeadSource FROM Opportunity]);
  }

  public void execute(Database.BatchableContext bc, List<Opportunity> opps) {
    if (!opps.isEmpty()) {
      for (Opportunity opp : opps) {
        opp.LeadSource = 'Web';
      }
      update opps;
      recordCount = recordCount + opps.size();
    }
  }

  public void finish(Database.BatchableContext bc) {
    System.debug('OppoProcessor: processed' + recordCount + 'records.');
  }
}
