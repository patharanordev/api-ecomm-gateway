import React from 'react';
import {
  Dashboard as DashboardIcon, 
  ViewComfy as ViewComfyIcon, 
  SaveAlt as SaveAltIcon, 
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon, 
  BarChart as BarChartIcon, 
  Assignment as AssignmentIcon
} from '@material-ui/icons'

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
  icon: <ShoppingCartIcon />,
  label: 'Orders',
  link: '/'
}, {
  icon: <BarChartIcon />,
  label: 'Reports',
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