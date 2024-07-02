trigger AccountObjectTrigger on Account(after update) {
  if (Trigger.isUpdate && Trigger.isAfter) {
    AccountObjectTriggerHandler.updateRelatedContactPhoneNumbers(
      Trigger.New,
      Trigger.oldMap
    );
  }
}
