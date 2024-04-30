import LightningModal from 'lightning/modal';
import { wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createTicket from '@salesforce/apex/TicketController.createTicket';
import { getPicklistValues,getObjectInfo } from 'lightning/uiObjectInfoApi';
import TICKET_OBJECT from "@salesforce/schema/Ticket__c";
import PRIORITY_FIELD from '@salesforce/schema/Ticket__c.Priority__c';
import STATUS_FIELD from '@salesforce/schema/Ticket__c.Status__c';
import ISSUE_FIELD from '@salesforce/schema/Ticket__c.Issue_Type__c';
import fetchLabelOptions from '@salesforce/apex/LabelController.fetchLabelOptions';
import createNewLabelValue from '@salesforce/apex/LabelController.createNewLabelValue';

export default class CreateTicket extends LightningModal {
    
    @track issueType;
    @track status;
    @track summary;
    @track dueDate;
    @track description;
    @track priority;
    @track assignee;
    @track title;
    ticketRecordTypeId;
    statusOptions; 
    TypeOptions;
    priorOptions;
    error;
    LabelOptions;
    @track selectedOptions = [];
    @track filteredOptions = [];
    showDropdown = false;
    @track selectedValue = '';

    @wire(fetchLabelOptions)
    wiredLabelOptions({ error, data }) {
        if (data) {
            this.LabelOptions = data.map(item => ({ label: item, value: item })); 
        } else if (error) {
            console.error('Error fetching Labels options:', error);
        }
    }

    handleSearch(event) {
      const searchTerm = event.target.value;
      this.selectedValue = searchTerm;
  
      if (searchTerm.trim() === '') {
          this.filteredOptions = this.LabelOptions.filter(option =>
              !this.selectedOptions.some(selectedOption => selectedOption.value === option.value)
          );
      } else {
          this.filteredOptions = this.LabelOptions.filter(option =>
              option.label.includes(searchTerm) &&
              !this.selectedOptions.some(selectedOption => selectedOption.value === option.value)
          );
      }
      this.showDropdown = true; 
  }

  handleOnClick() {
      this.filteredOptions = this.LabelOptions.filter(option =>
          !this.selectedOptions.some(selectedOption => selectedOption.value === option.value)
      );
      this.showDropdown = true; 
  }

  handleOptionClick(event) {
      const value = event.currentTarget.dataset.value;
      const label = this.LabelOptions.find(opt => opt.value === value).label;
      this.selectedOptions = [...this.selectedOptions, { label, value }];
      this.selectedValue="";
      this.showDropdown = false;
  }

  handleKeyDown(event) {
      if (event.key === 'Enter') {
          const searchTerm = event.target.value.trim();
          console.log(this.selectedOptions.some(option => option.label === searchTerm));
          if (!this.selectedOptions.some(option => option.label === searchTerm)) {
              createNewLabelValue({ labelName: searchTerm })
                  .then(result => {
                      this.LabelOptions = [...this.LabelOptions, { label: result, value: result }];
                      this.selectedOptions = [...this.selectedOptions, { label: result, value: result }];
                      this.selectedValue="";
                  })
                  .catch(error => {
                      console.error('Error creating label:', error);
                      const event = new ShowToastEvent({
                          title: 'Error',
                          message: 'Error creating label. Please contact system admin.',
                          variant: 'error'
                      });
                      this.dispatchEvent(event);
                  });
          } else {
              this.selectedValue = "";
          }
      }
  }

  removeOption(event) {
      const value = event.currentTarget.dataset.value;
      this.selectedOptions = this.selectedOptions.filter(opt => opt.value !== value);
  }

    
    handleCreate(){
      createTicket({
          status: this.status,
          summary: this.summary,
          duedate: this.dueDate,
          description: this.description,
          priority: this.priority,
          assignee: this.assignee,
          issuetype: this.issueType,
          title: this.title,
          label: this.selectedOptions.map(option => option.label).join(', ')
        })
      .then(result => {
        const ticketId = result;
          const event = new ShowToastEvent({
              title: 'Ticket Created',
              message: 'New Ticket created.',
              variant: 'success'
          });
          this.dispatchEvent(event);
          this.handleOkay(result);
        })
      .catch(error => {
          const event = new ShowToastEvent({
              title : 'Error',
              message : 'Error creating contact. Please Contact System Admin',
              variant : 'error'
          });
          this.dispatchEvent(event);
      });   
  }

    resetForm() {
        this.status = '';
        this.summary = '';
        this.dueDate = '';
        this.description = '';
        this.priority = '';
        this.assignee = '';
        this.issueType = '';
        this.title ='';
 }

    @wire(getObjectInfo, { objectApiName: TICKET_OBJECT })
    results({ error, data }) {
        if (data) {
          this.ticketRecordTypeId = data.defaultRecordTypeId;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.ticketRecordTypeId = undefined;
        }
      }
    
      @wire(getPicklistValues, { recordTypeId: "$ticketRecordTypeId", fieldApiName: STATUS_FIELD})
      picklistResult({ error, data }) {
        if (data) {
          this.statusOptions = data.values;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.statusOptions = undefined;
        }
      }

     

      @wire(getPicklistValues, { recordTypeId: "$ticketRecordTypeId", fieldApiName: ISSUE_FIELD})
      picklistResultss({ error, data }) {
        if (data) {
          this.TypeOptions = data.values;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.TypeOptions = undefined;
        }
      }

      @wire(getPicklistValues, { recordTypeId: "$ticketRecordTypeId", fieldApiName: PRIORITY_FIELD})
      picklistResults({ error, data }) {
        if (data) {
          this.priorOptions = data.values;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.priorOptions = undefined;
        }
      }

    handleIssueType(event){
        this.issueType = event.target.value;
    }
    handleStatus(event){
        this.status = event.target.value;
    }
    handlesummary(event){
        this.summary = event.target.value;
    }
    handleDueDateChange(event){
        this.dueDate = event.target.value;
    }
    handleDescriptionChange(event){
        this.description = event.target.value;
    }
   
    handlepriority(event){
        this.priority = event.target.value;
    }
    handletitle(event){
      this.title = event.target.value;
    }

    handleAssigneechange(event){
      this.assignee = event.detail.recordId
      console.log("Hiee",this.assignee);
    }
    handleLabelchange(event){
      this.label = event.target.value;
    }

    handleOkay(Id){
        this.close(Id);
    }
}