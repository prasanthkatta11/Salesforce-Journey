public class AccountHandler {
    
    public static void insertAccount(Integer value){
        List<Account> addAccounts = new List<Account>();
        Integer N=1;
    	while(N<=value){
        	Account store = new Account();
            store.Name = 'Acme Inc N' +N;
            store.AccountNumber = 'A000n'+N;
            addAccounts.add(store);
            N++;
    		}
        insert addAccounts;
    }
}