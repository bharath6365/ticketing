import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Content, Panel } from 'rsuite';
import useRequest from '../hooks/use-request';
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

const Landing = ({ currentUser, tickets }) => {
  
  // Purchase button handler.
  const redirectToOrderPage = (ticket) => {
    Router.push('/tickets/[ticketId]', `/tickets/${ticket.id}`);
  }

  const renderTickets = (tickets) => {
    return (
      <List hover>
        {
          tickets.map((ticket, index) => (
            <List.Item style={{cursor: 'pointer'}} onClick={() => redirectToOrderPage(ticket)} key={ticket['title']} index={index}>
            <FlexboxGrid>
              {/*Icon*/}
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <Icon
                  icon='image'
                  style={{
                    color: 'darkgrey',
                    fontSize: '1.5em'
                  }}
                />
              </FlexboxGrid.Item>
              {/*Ticket name, Owner name */}
              <FlexboxGrid.Item
                colspan={3}
                style={{
                  ...styleCenter,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  overflow: 'hidden'
                }}
              >
                <div style={titleStyle}>{ticket['title']}</div>
                <div style={slimText}>
                  <div>
                    <Icon icon="user-circle-o" />
                    {' ' + ticket['owner']}
                  </div>
                  <div>{ticket['createdAt']}</div>
                </div>
              </FlexboxGrid.Item>
              {/* Price */}
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Price in INR</div>
                  <div style={dataStyle}>{ticket['price'].toLocaleString()}</div>
                </div>
              </FlexboxGrid.Item>
              {/* Ticket description */}
              <FlexboxGrid.Item colspan={10} style={styleCenter}>
                <div>
                  <div style={slimText}>Description</div>
                  <div style={dataStyle}>{ticket['description']}</div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item
                colspan={5}
                style={{
                  ...styleCenter
                }}
              >
                <a href="#">View</a>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
          ))
        }

      </List>
    )
  };

  return (
    <>
      <h2>Tickets</h2>
      <div>
        {tickets && renderTickets(tickets)}
      </div>
    </>
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
