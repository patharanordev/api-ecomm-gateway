import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NumberFormat from 'react-number-format';
import Title from './Title';

import Skeleton from '@material-ui/lab/Skeleton';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

// const rows = [
//   createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
//   createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
//   createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
// ];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const defaultSkeleton = (index) => {
  return (
    <TableRow key={`order-index-${index}`}>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right"><Skeleton variant="text" /></TableCell>
    </TableRow>
  )
}

export default function Orders(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // rows.map((row) => (
            //   <TableRow key={row.id}>
            //     <TableCell>{row.date}</TableCell>
            //     <TableCell>{row.name}</TableCell>
            //     <TableCell>{row.shipTo}</TableCell>
            //     <TableCell>{row.paymentMethod}</TableCell>
            //     <TableCell align="right">{row.amount}</TableCell>
            //   </TableRow>
            // ))

            props.recentOrder && Array.isArray(props.recentOrder)
            ?
              props.recentOrder.map((o,i) => {
                let price = -1;
                try { price = parseFloat(o.price)*parseFloat(o.qty); } 
                catch(err) { console.warn('Unknown type of price value'); }
                return (
                  <TableRow key={`order-index-${i}`}>
                    <TableCell>{o.timestamp}</TableCell>
                    <TableCell>{Array.isArray(o.users) && o.users.length>0 ? o.users[0].username : 'UNKNOWN FORMAT'}</TableCell>
                    <TableCell>{o.shipping}</TableCell>
                    <TableCell>{`${o.payment_method} :: **** ${o.payment_card_id.substring(o.payment_card_id.length-4)}`}</TableCell>
                    <TableCell align="right">
                      <NumberFormat 
                        value={price} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} />
                    </TableCell>
                  </TableRow>
                )
              })
            :
              [1,2,3,4,5].map((v,i) => {
                return defaultSkeleton(i)
              })
          }
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}