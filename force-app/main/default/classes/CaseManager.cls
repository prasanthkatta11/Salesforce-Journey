@RestResource(urlMapping='/Cases/*')
global with sharing class CaseManager { 
@HttpPatch
    global static ID updateCaseFields() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId];
        // Deserialize the JSON string into name-value pairs
        Map<String, Object> p = (Map<String, Object>)JSON.deserializeUntyped(request.requestbody.toString());
        // Iterate through each parameter field and value
        for(String fieldName : p.keySet()) {
            // Set the field and value on the Case sObject
            thisCase.put(fieldName, p.get(fieldName));
        }
        update thisCase;
        return thisCase.Id;
    } 
    
}