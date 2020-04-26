import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import Deposits from './Deposits';
import TopUser from './TopUser';
import Orders from './Orders';


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
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart dailyAccount={props.dailyAccount}/>
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits revenue={props.revenue}/>
        </Paper>
      </Grid>
      {/* Top User */}
      <Grid item xs={12} md={5} lg={4}>
        <Paper className={classes.paper}>
          <TopUser topUser={props.topUser}/>
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12} md={7} lg={8}>
        <Paper className={classes.paper}>
          <Orders recentOrder={props.recentOrder}/>
        </Paper>
      </Grid>
    </Grid>
  );
}