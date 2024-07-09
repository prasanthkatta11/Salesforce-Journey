public with sharing class ParentAccountQueUpdate implements Queueable {
  private List<Account> accList;
  private Id parentAccId;

  public ParentAccountQueUpdate(List<Account> accList, Id parentAccId) {
    this.accList = accList;
    this.parentAccId = parentAccId;
  }
  public void execute(QueueableContext context) {
    for (Account acc : accList) {
      acc.ParentId = parentAccId;
    }
    update accList;
  }
}
