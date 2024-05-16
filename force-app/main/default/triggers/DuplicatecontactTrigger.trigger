trigger DuplicatecontactTrigger on Contact (before insert) {
    if(Trigger.isInsert && Trigger.isBefore){
        ContactHandler.handleDuplicateContacts(Trigger.NEW);
    }

}