public with sharing class TicketController {

    @AuraEnabled
    public static Id createTicket(String status, String summary, Date duedate, String description, String priority,Id assignee,String issuetype,String label,String title) {
        
        Ticket__c newTicket = new Ticket__c(

            Status__c = status,
            Summary__c = summary,
            DueDate__c = duedate,
            Description__c = description,
            Priority__c = priority,
            Assignee__c = assignee,
            Issue_Type__c = issuetype,
            Label__c = label,
            Title__c = title
        );
        insert newTicket;
        
        return newTicket.Id;
    }
}
