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
private class ParentAccountQueUpdateTest {
  private static Id parentAccId;
  private static List<Account> accList;

  @TestSetup
  static void setUpData() {
    Account parentAcc = new Account(Name = 'Parent Account');
    insert parentAcc;
    parentAccId = parentAcc.Id;

    accList = new List<Account>();
    for (Integer i = 0; i < 200; i++) {
      Account acc = new Account();
      acc.Name = 'Test Acc ' + i;
      acc.BillingState = 'NY';
      accList.add(acc);
    }
    insert accList;
  }

  @isTest
  static void myUnitTest() {
    List<Account> childAccList = [
      SELECT Id, ParentId
      FROM Account
      WHERE ParentId = NULL
    ];

    for (Account acc : childAccList) {
      System.assertEquals(
        null,
        acc.ParentId,
        'Initial parentId should be null'
      );
    }

    Test.startTest();
    parentAccountQueUpdate que = new parentAccountQueUpdate(
      childAccList,
      parentAccId
    );
    Id jobId = System.enqueueJob(que);

    Test.stopTest();

    childAccList = [
      SELECT Id, ParentId
      FROM Account
      WHERE ParentId = :parentAccId
    ];
    for (Account acc : childAccList) {
      System.assertEquals(
        parentAccId,
        acc.ParentId,
        'Parent Id should be ' + parentAccId
      );
    }
  }
}
