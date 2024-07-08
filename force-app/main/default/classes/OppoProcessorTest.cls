/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class OppoProcessorTest {
  @isTest
  static void testOppoProcessorBatchClass() {
    List<Opportunity> oppsList = new List<Opportunity>();

    for (integer i = 0; i < 200; i++) {
      Opportunity opp = new Opportunity();
      opp.Name = 'TestOpportunity' + i;
      opp.StageName = 'Prospecting';
      opp.CloseDate = system.today();
      oppsList.add(opp);
    }

    Test.startTest();
    insert oppsList;

    OppoProcessor op = new OppoProcessor();
    Id batchId = Database.executeBatch(op, 200);
    Test.stopTest();

    List<Opportunity> oppList = [
      SELECT Id, Name, StageName, CloseDate, LeadSource
      FROM Opportunity
      WHERE LeadSource = 'Web'
    ];
    system.assertEquals(200, oppList.size());
  }
}
