const orderIndex = ({orders}) => {
  return (
    <div>
    <h2>Orders</h2>
    
    <ul>
    {
      orders.map(order => {
        let orderDate = new Date(order.createdAt);
        // Backward compatiblity.
        if (orderDate) {
          orderDate =orderDate.toDateString();
        }
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status} - {orderDate}
          </li>
        )
        
      })
    }
    </ul>
    </div>
  )
}

orderIndex.getInitialProps = async (context, client) => {
  const {data} = await client.get('/api/orders');

  return {orders: data};
}

export default orderIndex;