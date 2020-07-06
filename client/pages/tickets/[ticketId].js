import {Button} from 'rsuite';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const ticketShow = ({ ticket }) => {
  const {doRequest, errors} = useRequest({
    url: '/api/orders',
    method: 'post',
    onSuccess: (order) => {
      console.log('Order is', order);
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    }
  })
  return (
    <div>
      <h1>{ticket.title}</h1>
      <p>{ticket.price}</p>
      <Button onClick={() => doRequest({ticketId: ticket.id})} color="green">Purchase Ticket</Button>
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
