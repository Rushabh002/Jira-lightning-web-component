import { LightningElement, track} from 'lwc';
import createTicket from 'c/createTicket'; 
import ticketViewPage from 'c/ticketViewPage';
import { NavigationMixin } from 'lightning/navigation';

export default class Jira extends  NavigationMixin(LightningElement) {
  
result;
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


    todoTasks = [
        {
        title:'AI-ML Avatar Body Generation Approach',
        id: 'AH-1035'    
        },
        {
            title:'Learning how to create Microservices in Java (Spring Boot)',
            id: 'AH-106'    
        },
        {
            title:'BPSP-POC',
            id: 'AH-1040'    
            }
    ];

    inProgressTasks = [
        {
            title:'Shopify R&D',
            id: 'AH-105'    
            },
            {
                title:'Freshers Interview',
                id: 'AH-1035'    
            }
    ];

    doneTasks = [
        {
            title:'GCP Course',
            id: 'AH-1035'    
            },
            {
                title:'Setu_Poc',
                id: 'AH-1035'    
            },
            {
                title:'AI-ML Avatar Body Generation Approach',
                id: 'AH-1035'    
                }
    ];
    
}