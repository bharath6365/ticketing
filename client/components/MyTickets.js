import React from 'react';
import {FlexboxGrid, List, Icon} from 'rsuite';

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const slimText = {
  fontSize: '0.666em',
  color: '#97969B',
  fontWeight: 'lighter',
  paddingBottom: 5
};

const titleStyle = {
  paddingBottom: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500,
  fontSsize: '2rem'
};

const dataStyle = {
  fontSize: '1.2em',
  fontWeight: 500
};

export default function myTickets({tickets, handleClick, currentUser}) {

  if (!currentUser) {
    return <p>Login to view your current tickets.</p>
  }
  return (
    <ul className="ticket-list">
        {
          tickets.map((ticket, index) => (
            <li>
              <span className="ticket-title">
                {ticket.title}
              </span>

              <span className="ticket-status">
                Sold
              </span>
              
            </li>
          ))
        }
      </ul>
    )
}
