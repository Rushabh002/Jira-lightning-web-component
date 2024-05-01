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

    @AuraEnabled(cacheable=true)
    public static Map<String, List<Ticket__c>> getTicketsGroupedByStatus() {
        // Query tickets grouped by status
        Map<String, List<Ticket__c>> ticketsByStatus = new Map<String, List<Ticket__c>>();
        for (AggregateResult ar : [SELECT Status__c, COUNT(Id) numTickets FROM Ticket__c GROUP BY Status__c]) {
            String status = (String)ar.get('Status__c');
            Integer numTickets = (Integer)ar.get('numTickets');
            ticketsByStatus.put(status, new List<Ticket__c>());
        }

        // Query tickets for each status
        for (String status : ticketsByStatus.keySet()) {
            List<Ticket__c> tickets = [SELECT Id, Name, Description__c, Status__c, Title__c FROM Ticket__c WHERE Status__c = :status];
            ticketsByStatus.put(status, tickets);
        }

        return ticketsByStatus;
    }
}
