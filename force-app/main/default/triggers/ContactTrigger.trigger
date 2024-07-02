trigger ContactTrigger on Contact(
  after insert,
  after delete,
  after undelete,
  after update
) {
  if (Trigger.isInsert) {
    if (Trigger.isAfter) {
      ContactTriggerHandler.accountsWithContactsCount(Trigger.new);
    }
  }

  if (Trigger.isUpdate) {
    if (Trigger.isAfter) {
      ContactTriggerHandler.accountsWithContactsCount(Trigger.new);
    }
  }

  if (Trigger.isDelete) {
    if (Trigger.isAfter) {
      ContactTriggerHandler.accountsWithContactsCount(Trigger.old);
    }
  }

  if (Trigger.isUndelete) {
    if (Trigger.isAfter) {
      ContactTriggerHandler.accountsWithContactsCount(Trigger.new);
    }
  }
}