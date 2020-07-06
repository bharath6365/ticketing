import { CountdownCircleTimer } from "react-countdown-circle-timer";
//import "./styles.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Too late...</div>;
  }

  return (
    <div className="timer">
      <div className="text">Order expiring in </div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

const orderShow = ({ order }) => {
  const expiresTime = (new Date(order.expiresAt) - new Date()) / 1000;
  return (
    <div>
<h2>Purchasing {order.ticket.title}</h2>

      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={180}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [false, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
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
