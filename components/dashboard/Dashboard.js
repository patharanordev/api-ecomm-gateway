import React from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const Chart = dynamic(import('./Chart'), { ssr: false })
const TopUser = dynamic(import('./TopUser'), { ssr: false })
const Deposits = dynamic(import('./Deposits'), { ssr: false })
const OrderStatus = dynamic(import('./OrderStatus'), { ssr: false })
const RecentOrders = dynamic(import('./RecentOrders'), { ssr: false })

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // console.log(props);

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          {
            Chart ? <Chart dailyAccount={props.dailyAccount}/> : null
          }
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={3} lg={3}>
        <Paper className={fixedHeightPaper}>
        {
          OrderStatus ? <OrderStatus orderStatus={props.orderStatus}/> : null
        }
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={3} lg={3}>
        <Paper className={fixedHeightPaper}>
        {
          Deposits ? <Deposits revenue={props.revenue}/> : null
        }
        </Paper>
      </Grid>
      {/* Top User */}
      <Grid item xs={12} md={5} lg={4}>
        <Paper className={classes.paper}>
          {
            TopUser ? <TopUser topUser={props.topUser}/> : null
          }
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12} md={7} lg={8}>
        <Paper className={classes.paper}>
          {
            RecentOrders ? <RecentOrders recentOrder={props.recentOrder}/> : null
          }
        </Paper>
      </Grid>
    </Grid>
  );
}