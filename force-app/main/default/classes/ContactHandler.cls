public class ContactHandler {
    public static void handleDuplicateContacts(List<Contact> newContacts) {
        Set<String> existingEmails = new Set<String>();
        for (Contact existingContact : [SELECT Email FROM Contact]) {
            existingEmails.add(existingContact.Email);
        }

        for (Contact newContact : newContacts) {
            // Check for duplicate email addresses
            if (existingEmails.contains(newContact.Email)) {
                newContact.addError('Duplicate email address found.');
            } 
            // Add additional duplicate checks if needed
        }
    }
}