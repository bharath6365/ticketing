import React from 'react';

export default function myTickets({tickets, handleClick, currentUser}) {

  if (!currentUser) {
    return <p>Login to view your current tickets.</p>
  }
  return (
    <ul className="ticket-list">
        {
          tickets.map((ticket) => (
            <li key={ticket.id}>
              <span className="ticket-title">
                {ticket.title} - 
              </span>
               
              <span className="ticket-status">
                {ticket.orderId ? "Sold" : "Open"}
              </span>
              
            </li>
          ))
        }
      </ul>
    )
}
