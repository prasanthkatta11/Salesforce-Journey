public class Indian {
   public static String formatPhNumber(String phone){
        String countryCode='+91';
        String newPhone=phone;
        String ph='';
        try{
            phone = phone.deleteWhitespace().replaceAll('\\D','').replaceFirst( '^0+', '');
            System.debug(phone);
            if (phone.startsWith('91')){
                phone = phone.replaceFirst( '91', '');
                System.debug(phone);
            }
            ph = phone; // Corrected assignment
            System.debug(ph);
            if ((ph.startsWith('9') || ph.startsWith('8') || ph.startsWith('7') || ph.startsWith('6')) && (ph.length() == 10)) {
                ph = countryCode + ' ' + ph.substring(0, 3) + ' ' + ph.substring(3, 6) + ' ' + ph.substring(6, 10);
                System.debug(ph);
            } 
            newPhone = ph;
        } catch (Exception e){
            System.debug(e.getMessage());
        }
        return newPhone;
    }
}