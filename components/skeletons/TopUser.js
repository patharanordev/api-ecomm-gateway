import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid } from '@material-ui/core';

export default function TopUserSkeleton(props) {
  const row = [...Array(props.row ? props.row : 5).keys()]
  return (
    <Grid container spacing={2}>
    {
      row.map((r,rIndex) => {
        return (
          <Grid item xs={12} key={`gi${rIndex}`}>
            <Grid container spacing={2} key={`sgc${rIndex}`}>
              <Grid item xs={4} align={'center'} key={`sgi-a${rIndex}`}>
                <Skeleton variant="circle" width={40} height={40} key={`sk-a${rIndex}`}/>
              </Grid>
              <Grid item xs={8} key={`sgi-t${rIndex}`}>
                <Skeleton variant="text" width={160} key={`sk-tt${rIndex}`}/>
                <Skeleton variant="text" width={80} key={`sk-st${rIndex}`}/>
              </Grid>
            </Grid>
          </Grid>
        )
      })
    }
    </Grid>
  )
}