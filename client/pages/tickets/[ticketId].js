import { Button, Icon, Whisper, Tooltip } from 'rsuite';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const ticketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    }
  });

  const isUserSame = currentUser && currentUser.email === ticket.owner;

  const tooltip = (
    <Tooltip>
      You can't buy tickets that are created by you 🙆🏽‍♂️
    </Tooltip>
  );

  const isLoggedIn = !!currentUser;
  return (
    <div className="individual-ticket-page">
      <h1 className="title">
        <Icon icon="ticket" size="5x" />
        {ticket.title}
      </h1>
      <p className="description">Description - {ticket.description}</p>
      <p className="price">
        <Icon icon="inr" size="3x" />
        {ticket.price}
      </p>
      <p className="date">
        <Icon icon="calendar-o" style={{ color: '#f44336' }} />
        {new Date(ticket.createdAt).toLocaleDateString()}
      </p>
      <p className="user">
        <Icon icon="user-info" />
        {ticket.owner}
      </p>

      {isUserSame && (
        <Whisper placement="right" trigger="hover" speaker={tooltip}>
          <span>
            <Button disabled onClick={() => doRequest({ ticketId: ticket.id })} color="cyan" appearance="ghost">
            <Icon icon="credit-card-alt" />
            {currentUser ? "You own this ticket. Can't buy it" : "Login to purchase this ticket."}
          </Button>
          </span>
        </Whisper>
      )}

      {!isUserSame && (
        <Button disabled={!isLoggedIn} onClick={() => doRequest({ ticketId: ticket.id })} color="cyan" appearance="ghost">
          <Icon icon="credit-card-alt" />
          {isLoggedIn ? "Purchase Ticket" : "Login to Purchase Ticket" }
        </Button>
      )}

      {errors}
    </div>
  );
};

ticketShow.getInitialProps = async (context, client) => {
  // Gets the ticketId out of the URL.
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default ticketShow;
