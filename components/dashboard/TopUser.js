import React from 'react';
import * as moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '../skeletons/TopUser';
import Title from '../Title';
import {
  Typography, Grid, Divider, Avatar, 
  List, ListItem, ListItemText, ListItemAvatar
} from '@material-ui/core';

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
                          <small key={`last-update-${i}`}>
                          {` — ${
                            v.last_access 
                            ? moment(v.last_access).format('YYYY-MM-DD HH:mm') 
                            : ''}`
                          }
                          </small>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                )
              })
            :
              <Skeleton/>
          }
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}