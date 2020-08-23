import { Table } from 'rsuite';

const { Column, HeaderCell, Cell, Pagination } = Table;
const orderIndex = ({orders}) => {
  // Sort them
  orders = orders.sort((order1, order2) => {
    if (order1.createdAt > order2.createdAt) {
      return -1;
    } else {
      return 1;
    }
  });
  return (
    <div>
    <h2>Orders</h2>

    <div>
        <Table
          height={400}
          data={orders}
        >
          <Column width={350} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={300} fixed>
            <HeaderCell>Ticket</HeaderCell>
            <Cell>
              {rowData => rowData.ticket.title}
            </Cell>
          </Column>

          <Column width={100}>
            <HeaderCell>Price(INR)</HeaderCell>
            <Cell>
              {rowData => rowData.ticket.price}
            </Cell>
          </Column>

          <Column width={100}>
            <HeaderCell>Status</HeaderCell>
            <Cell dataKey="status" />
          </Column>

          <Column width={300}>
            <HeaderCell>Date</HeaderCell>
            <Cell>
              {rowData => new Date(rowData.createdAt).toLocaleDateString()}
            </Cell>
          </Column>
        </Table>
      </div>
  
    </div>
  )
}

orderIndex.getInitialProps = async (context, client) => {
  const {data} = await client.get('/api/orders');

  return {orders: data};
}

export default orderIndex;