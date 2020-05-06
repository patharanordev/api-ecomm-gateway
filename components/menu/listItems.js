import React from 'react';

import {
  Dashboard as DashboardIcon, 
  ViewComfy as ViewComfyIcon, 
  SaveAlt as SaveAltIcon, 
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon, 
  BarChart as BarChartIcon, 
  TouchApp as TouchAppIcon
} from '@material-ui/icons'

export const mainMenuList = [{
  icon: <DashboardIcon />,
  label: 'Dashboard',
  link: '/dashboard',
  isDisabled: false
}, {
  icon: <ViewComfyIcon />,
  label: 'Gallery',
  link: '/gallery',
  isDisabled: false
}, {
  icon: <SaveAltIcon />,
  label: 'Import',
  link: '/import-product',
  isDisabled: false
}, {
  icon: <PeopleIcon />,
  label: 'Customers',
  link: '/',
  isDisabled: true
}, {
  icon: <ShoppingCartIcon />,
  label: 'Order',
  link: '/order',
  isDisabled: false
}, {
  icon: <BarChartIcon />,
  label: 'Reports',
  link: '/',
  isDisabled: true
}]

export const secondaryMenuList = [{
  icon: <TouchAppIcon />,
  label: 'Simulate',
  link: '/simulate',
  isDisabled: false
}]
