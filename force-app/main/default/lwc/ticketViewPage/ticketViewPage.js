import { LightningElement, api, wire } from 'lwc';
import createContentVersion from '@salesforce/apex/CreateContentVersion.createContentVersion';
import { getRecord } from 'lightning/uiRecordApi';

export default class TicketViewPage extends LightningElement {
    @api TicketID;

    @wire(getRecord, { recordId: '$TicketID', fields: ['Ticket__c.Issue_Type__c','Ticket__c.Assignee__c', 'Ticket__c.Label__c', 'Ticket__c.Description__c', 'Ticket__c.DueDate__c', 'Ticket__c.Priority__c', 'Ticket__c.Status__c', 'Ticket__c.Summary__c', 'Ticket__c.Title__c'] })
    ticket;

    get ticketDetails() {
        const fields = this.ticket.data ? this.ticket.data.fields : {};
        
        const directValues = {};
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                directValues[key] = fields[key].value;
            }
        }
        return directValues;
    }


    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;

        uploadedFiles.forEach(file => {
            createContentVersion({
                title: file.name,
                pathOnClient: file.name,
                versionData: file.documentId,
                parentId: this.TicketID
            })
            .then(() => {
                console.log('ContentVersion created successfully.');
            })
            .catch(error => {
                console.error('Error creating ContentVersion: ', error);
            });
        });
    }
}