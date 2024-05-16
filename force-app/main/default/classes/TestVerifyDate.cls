@isTest
private class TestVerifyDate {
    
    @isTest
    static void testCheckDates_DateWithin30Days() {
        Date date1 = Date.today();
        Date date2 = date1.addDays(15); // date2 is within 30 days of date1
        
        Date result = VerifyDate.CheckDates(date1, date2);
        
        System.assertEquals(date2, result);
    }
    
    @isTest
    static void testCheckDates_DateNotWithin30Days() {
        Date date1 = Date.today();
        Date date2 = date1.addDays(35); // date2 is not within 30 days of date1
        
        Date result = VerifyDate.CheckDates(date1, date2);
        
        Date expected = getExpectedEndOfMonthDate(date1);
        System.assertEquals(expected, result);
    }
    
    @isTest
    static void testCheckDates_Date2BeforeDate1() {
        Date date1 = Date.today();
        Date date2 = date1.addDays(-5); // date2 is before date1
        
        Date result = VerifyDate.CheckDates(date1, date2);
        
        Date expected = getExpectedEndOfMonthDate(date1);
        System.assertEquals(expected, result);
    }
    
    // Helper method to get the expected end of month date
    private static Date getExpectedEndOfMonthDate(Date date1) {
        Integer totalDays = Date.daysInMonth(date1.year(), date1.month());
        return Date.newInstance(date1.year(), date1.month(), totalDays);
    }
}