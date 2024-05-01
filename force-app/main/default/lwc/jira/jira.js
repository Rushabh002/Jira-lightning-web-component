import { LightningElement, track,wire} from 'lwc';
import createTicket from 'c/createTicket'; 
import ticketViewPage from 'c/ticketViewPage';
import { NavigationMixin } from 'lightning/navigation';
import getTicketsGroupedByStatus from '@salesforce/apex/TicketController.getTicketsGroupedByStatus';
export default class Jira extends  NavigationMixin(LightningElement) {
  

ticketsByStatus;    
result;
@wire(getTicketsGroupedByStatus)
wiredTickets({ error, data }) {
    if (data) {
        // Assign the response data to ticketsByStatus
        console.log("ticketsByStatus", data);
        this.ticketsByStatus = Object.keys(data).map(key => ({ status: key, tickets: data[key] }));
        console.log("ticketsByStatus DATA", this.ticketsByStatus);
    } else if (error) {
        // Handle any errors
        console.error('Error fetching tickets:', error);
    }
}

async openCreateTicketForm() {
        this.result = await  createTicket.open({ label: "Create Ticket" });
        console.log(this.result);

        if (this.isValidTicketId(this.result)) {
            this.navigatetoView(this.result);
        } else {
            console.error('Invalid ticket ID:', this.result);
        }
        
    }

    navigatetoView(Id) {
        console.log("Hello ia mauhcsk",Id);
        let componentDef = {
            componentDef: "c:ticketViewPage",
            attributes: {

                TicketID: Id
            }
        };
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
    }
        isValidTicketId(ticketId) {
            return typeof ticketId === 'string' && ticketId.trim() !== '';
        }

}