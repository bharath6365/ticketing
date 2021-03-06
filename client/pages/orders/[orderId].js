import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useState } from 'react';
import {Message, Button, Icon} from 'rsuite';
import StripeCheckOut from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
const orderShow = ({ order, currentUser }) => {
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    onSuccess: (payment) => setPaymentSuccessMessage(`Success. Your payment has succeeded. Here's your payment id - ${payment.id}`)
  })
  
  // Flag to check if token expired.
  const [ expired, setExpired ] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setExpired(true);
      return <div className="timer">Too late...</div>;
    }

    return (
      <div className="timer">
        <div className="text">Expiring </div>
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  const expiresTime = Math.round((new Date(order.expiresAt) - new Date()) / 1000);
  // If it is less than zero. Set expired as true.
  if (expiresTime <0) {
    return <Message showIcon type="error" title="Error" description="This order has already expired." />
  } else {
    return (
    <div className="individual-ticket-page">
      <h2 className="title">Purchasing Ticket - {order.ticket.title}</h2>

      {!paymentSuccessMessage && (
      <div className="timer-wrapper">
        <CountdownCircleTimer
            isPlaying
            duration={expiresTime}
            colors={[ [ '#19219a' ], [ '#abaa3e' ], [ '#e53b27' ] ]}
            onComplete={() => [ false, 1000 ]}
          >
          {renderTime}
          </CountdownCircleTimer>
        </div>
      )}

      {!expired && !paymentSuccessMessage && (
        <StripeCheckOut
          token={({id}) => doRequest({
            orderId: order.id,
            token: id
          })}
          stripeKey="pk_test_51ApxhFJEiFsh2HzwGb0Kkb3e5BnZjn2FfiWwGtFunfSJ3i209ZCH6qBYqdBIw9BE670GGwIkYwngjtAJvP6AP8Z500dNOgmnVG"
          amount={order.ticket.price * 100}
          email={currentUser.email}
          currency="INR"
        >
        <Button color="cyan" appearance="ghost">
          <Icon icon="credit-card-alt" />
            Pay Now
        </Button>
        </StripeCheckOut>
      )}

      {paymentSuccessMessage && (
        <Message
          showIcon
          type="success"
          title="Success"
          description={paymentSuccessMessage}
        />
      )}



      {/* Show Expired message */}
      {!paymentSuccessMessage && expired && (
        <Message showIcon type="error" title="Error" description="This order has expired recently. Please create a new order." />
      )}

      {/* Display any errors */}
      <div style={{marginTop: '20px'}}>
        {errors}
      </div>
    </div>
  );
  }
  
};

orderShow.getInitialProps = async (context, client) => {
  try {
    // Gets the orderId out of the URL.
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
  } catch (e) {
    console.log(e.message);
  }
};

export default orderShow;
