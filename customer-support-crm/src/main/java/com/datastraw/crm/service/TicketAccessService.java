package com.datastraw.crm.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.User;

@Service
public class TicketAccessService {

	public void checkTicketAccess(Ticket ticket,User user) {
		if (hasTicketAccess(ticket,user)) {
			return;
		}
		throw new AccessDeniedException(
				 "You do not have access to this ticket");
	}
	
	private boolean hasTicketAccess(Ticket ticket,User user) {
		switch(user.getRole().getName()) {
		 
		case ADMIN:
			return true;
		case MANAGER:
			return ticket.getAssignedAgent()!=null &&
			        ticket.getAssignedAgent().getManager()!=null
			        && ticket.getAssignedAgent().getManager().getId()
			        .equals(user.getId());
		case AGENT:
			return ticket.getAssignedAgent()!=null && 
					ticket.getAssignedAgent().getId()
					   .equals(user.getId());
		case CUSTOMER:
			return  ticket.getCustomer() != null
                    && ticket.getCustomer().getUser() != null
                    && ticket.getCustomer().getUser().getId()
                        .equals(user.getId());
			
		default:
			 return false;
		}
	}
}
