public class ContactsListWithController {
    private String sortOrder = 'LastName';
    private Integer pageSize = 10;
    private Integer pageNumber = 1;

    public List<Contact> getContacts() {
        Integer offset = (pageNumber - 1) * pageSize;
        return Database.query(
            'SELECT Id, FirstName, LastName, Title, Email ' +
            'FROM Contact ' +
            'ORDER BY ' + sortOrder + ' ASC ' +
            'LIMIT :pageSize OFFSET :offset'
        );
    }

    public void sortByLastName() {
        this.sortOrder = 'LastName';
        this.pageNumber = 1; // Reset page number when changing sorting
    }

    public void sortByFirstName() {
        this.sortOrder = 'FirstName';
        this.pageNumber = 1; // Reset page number when changing sorting
    }

    public void firstPage() {
        this.pageNumber = 1;
    }

    public void previousPage() {
        if (pageNumber > 1) {
            pageNumber--;
        }
    }

    public void nextPage() {
        // Assuming we know the total number of records
        List<Contact> contacts = getContacts();
        if (contacts.size() == pageSize) {
            pageNumber++;
        }
    }

    public void lastPage() {
        // Assuming we know the total number of records
        List<Contact> contacts = getContacts();
        Integer totalRecords = [SELECT count() FROM Contact];
        Integer totalPages = (totalRecords + pageSize - 1) / pageSize; // Ceiling division
        pageNumber = totalPages;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    public Integer getTotalPages() {
        // Assuming we know the total number of records
        Integer totalRecords = [SELECT count() FROM Contact];
        return (totalRecords + pageSize - 1) / pageSize; // Ceiling division
    }
}