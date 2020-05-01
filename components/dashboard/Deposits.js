import React from 'react';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import {
  Link, Typography
} from '@material-ui/core'

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Revenue</Title>
      <Typography component="p" variant="h4">
        <NumberFormat 
          value={props.revenue ? props.revenue : 0} 
          displayType={'text'} 
          thousandSeparator={true} 
          decimalScale={2}
          prefix={'$'} />
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Total
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}