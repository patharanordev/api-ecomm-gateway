import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 1,
  },
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  }
}));

const defaultSkeleton = (index) => {
  return (
    <Grid item xs={12} key={`skli-grid-${index}`}>
      <Grid container spacing={2} key={`skli-grid-subcontaner-${index}`}>
        <Grid item xs={4} align={'center'} key={`skli-grid-subitem-${index}`}>
          <Skeleton variant="circle" width={40} height={40} key={`skli-avatar-${index}`}/>
        </Grid>
        <Grid item xs={8} key={`skli-grid-title-${index}`}>
          <Skeleton variant="text" width={160} key={`skli-title-${index}`}/>
          <Skeleton variant="text" width={80} key={`skli-subtitle-${index}`}/>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default function TopUser(props) {
  const classes = useStyles();
  const defaultPicture = '';
  return (
    <React.Fragment>
      <Title>Top User</Title>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <List className={classes.root}>
          {
            props.topUser
            ?
              props.topUser.map((v,i) => {
                const username = v.username ? v.username : '';
                return (
                  <>
                    <ListItem alignItems="flex-start" key={`li-user${i}`}>
                      <ListItemAvatar key={`li-user-avatar${i}`}>
                        <Avatar key={`user-avatar${i}`} alt={username} src={v.picture ? v.picture : defaultPicture} />
                      </ListItemAvatar>
                      <ListItemText 
                        key={`li-user-title${i}`}
                        primary={username}
                        secondary={
                          <React.Fragment key={`rfrgmt-subtitle${i}`}>
                            <Typography
                              key={`li-user-subtitle${i}`}
                              component="span"
                              variant="caption"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              Last access
                            </Typography>
                            <small key={`last-update-${i}`}>{` — ${v.last_access ? v.last_access : ''}`}</small>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" key={`li-divider${i}`} />
                  </>
                )
              })
            :
              <Grid container spacing={2}>
              {
                [1,2,3,4,5].map((v,i) => {
                  return defaultSkeleton(i)
                })
              }
              </Grid>
          }
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}