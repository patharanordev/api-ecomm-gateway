import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const mainMenuList = [{
  icon: <DashboardIcon />,
  label: 'Dashboard',
  link: '/dashboard'
}, {
  icon: <ViewComfyIcon />,
  label: 'Gallery',
  link: '/gallery'
}, {
  icon: <SaveAltIcon />,
  label: 'Import',
  link: '/import-product'
}, {
  icon: <PeopleIcon />,
  label: 'Customers',
  link: '/'
}, {
  icon: <BarChartIcon />,
  label: 'Reports',
  link: '/'
}, {
  icon: <LayersIcon />,
  label: 'Integrations',
  link: '/'
}]

export const secondaryMenuList = [{
  icon: <AssignmentIcon />,
  label: 'Current month',
  link: '/'
}, {
  icon: <AssignmentIcon />,
  label: 'Last quarter',
  link: '/'
}, {
  icon: <AssignmentIcon />,
  label: 'Year-end sale',
  link: '/'
}]

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);