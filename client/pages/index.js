import React from 'react';
import Router from 'next/router';
import { FlexboxGrid } from 'rsuite';
import AllTickets from '../components/AllTickets';
import MyTickets from '../components/MyTickets';

const Landing = ({ currentUser, allTickets, myTickets }) => {
  
  // Purchase button handler.
  const redirectToOrderPage = (ticket) => {
    Router.push('/tickets/[ticketId]', `/tickets/${ticket.id}`);
  }

  const renderAllTickets = (tickets) => {
    return (
      <>
        <h2>Tickets</h2>
        <AllTickets tickets={tickets} handleClick={redirectToOrderPage} />
      </>
    )
  };

  const renderMyTickets = (tickets) => {

    return (
      <>
        <h4>Tickets created by me</h4>
        <MyTickets currentUser={currentUser} tickets={tickets} handleClick={redirectToOrderPage} />
      </>
    )
  };

  return (
    <>
      <FlexboxGrid className="tickets-home-container">
        <FlexboxGrid.Item colspan={16}>{renderAllTickets(allTickets)}</FlexboxGrid.Item>
        {
          myTickets && (
            <FlexboxGrid.Item className="my-tickets" colspan={8}>{renderMyTickets(myTickets)}</FlexboxGrid.Item>
          ) 
        }
        
      </FlexboxGrid>
    </>
  );
};

Landing.getInitialProps = async (context, client, currentUser) => {
  const allTickets = await client.get('/api/tickets');

  let myTickets;

  if (currentUser) {
    myTickets = await client.get('/api/tickets-currentuser');
    console.log('My Tickets is', myTickets);
  }

  // This will be passed as tickets.
  return { allTickets: allTickets.data, myTickets: myTickets ? myTickets.data : []};
};

export default Landing;

