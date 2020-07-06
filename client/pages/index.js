import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Content, Panel } from 'rsuite';
import useRequest from '../hooks/use-request';

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px'
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
  fontWeight: 500
};

const dataStyle = {
  fontSize: '1.2em',
  fontWeight: 500
};

const Landing = ({ currentUser, tickets }) => {
  
  // Purchase button handler.
  const redirectToOrderPage = (ticket) => {
    Router.push('/tickets/[ticketId]', `/tickets/${ticket.id}`);
  }

  const renderTickets = (tickets) => {
      return tickets.map((ticket, index) => {
        return (
          <Panel onClick={() => redirectToOrderPage(ticket)} shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
            <img src="https://via.placeholder.com/240x240" height="240" />
            <Panel header={ticket.title}>
                <p>
                  <small>{ticket.price}</small>
                </p>
            </Panel>
          </Panel>
        )
      }

    );
  };

  if (tickets) {
    return renderTickets(tickets);
  }
  return (
    <Content>
      <Button appearance="primary" href="/">
        {currentUser ? 'You are logged in' : 'Log in'}
      </Button>
    </Content>
  );
};

Landing.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  // This will be passed as tickets.
  return { tickets: data };
};

export default Landing;
/*



*/
