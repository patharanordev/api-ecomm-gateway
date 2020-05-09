import React from 'react';
import * as moment from 'moment';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '../skeletons/TableBody';
import Title from '../Title';
import {
  Link, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import Router from 'next/router';

function preventDefault(event) {
  event.preventDefault();
  Router.push(event.target.href.replace(window.location.origin, ''));
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

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
        {

          props.recentOrder && Array.isArray(props.recentOrder)
          ?
            <TableBody>
            {
              props.recentOrder.map((o,i) => {
                let price = -1;
                try { price = parseFloat(o.price)*parseFloat(o.qty); } 
                catch(err) { console.warn('Unknown type of price value'); }
                return (
                  <TableRow key={`order-index-${i}`}>
                    <TableCell>
                      {moment(o.timestamp).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
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
            }
            </TableBody>
          :
            <Skeleton col={5}/>
        }
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href='/order' onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}