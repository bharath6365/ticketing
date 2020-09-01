import React from 'react';
import { Icon, Panel, Row, Col } from 'rsuite';

const Card = (props) => {
  const {ticket} = props;
  
  return (
    <Panel className="ticket-card" {...props} bordered header={ticket.title}>

      <p className="description">
        <Icon icon="file-text" />
        {ticket.description}
      </p>

      <p className="price">
        <Icon icon="inr" size="2x"/>
        {ticket.price}
      </p>

      <p>
        <Icon icon="user"/> {ticket.owner}
      </p>

      <p>
        <Icon icon="calendar-o" style={{ color: '#f44336' }} />
        {new Date(ticket.createdAt).toDateString()}
      </p>
    </Panel>
  )
};

export default function AllTickets({ tickets, handleClick }) {
  // Sort them
  tickets = tickets.sort((ticket1, ticket2) => {
    if (ticket1.createdAt > ticket2.createdAt) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <>
      {tickets.map((ticket, index) => {
        if (!ticket.owner) return null;
        return (
          <Col key={index} md={8} sm={24} onClick={() => handleClick(ticket)}>
            <Card ticket={ticket} />
          </Col>
        )
      })}
    </>
  );
}
