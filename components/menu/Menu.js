import React from 'react';
import clsx from 'clsx';
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import { mainMenuList, secondaryMenuList } from './listItems';
import Copyright from '../CopyRight';

import {
  CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography,
  Divider, IconButton, Badge, Container, Grid, Avatar, ListItem,
  ListItemIcon, ListItemText, 
} from '@material-ui/core';

import {
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon, 
  Notifications as NotificationsIcon
} from '@material-ui/icons'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function MenuComponent(props) {

  const { currentUser } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };

  // console.log(props);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            { props.title ? props.title : '' }
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Typography variant="body2" color="inherit" noWrap className={classes.title}>
              {currentUser && currentUser.displayName ? `${currentUser.displayName}` : ''}
            </Typography>

            {
              currentUser && currentUser.picture 
              ? 
                <Avatar 
                  alt={currentUser.displayName ? currentUser.displayName : ''} 
                  src={currentUser.picture}
                  style={{ marginLeft:'10px' }} />

              : 
                <Avatar style={{ marginLeft:'10px' }}>
                {
                  currentUser.displayName ? currentUser.displayName[0] : ''
                }
                </Avatar>
            }
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
            <div>
            {
                mainMenuList.map((o,i) => {
                    return (
                        <ListItem 
                          button 
                          key={`mainMenuIndex-${i}`}
                          onClick={() => {
                            Router.push(o.link ? o.link : '/signin')
                          }}>
                            <ListItemIcon>{o.icon}</ListItemIcon>
                            <ListItemText primary={o.label} />
                        </ListItem>
                    )
                })
            }
            </div>
        </List>
        <Divider />
        <List>
            <div>
            {
                secondaryMenuList.map((o,i) => {
                    return (
                        <ListItem 
                          button 
                          key={`secondaryMenuIndex-${i}`}
                          onClick={() => {
                            Router.push(o.link ? o.link : '/signin')
                          }}>
                            <ListItemIcon>{o.icon}</ListItemIcon>
                            <ListItemText primary={o.label} />
                        </ListItem>
                    )
                })
            }
            </div>
      </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          
            <Grid container>
                <Grid item xs={12}>
                {
                    /** Page content here */
                    props.children
                }
                </Grid>
            </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}