import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import ProTip from '../src/ProTip';
import Link from '../src/Link';

import SignIn from '../components/SignIn';
import Dashboard from '../components/dashboard/Dashboard';

let isAuth = false;

export default function Index() {
  return (
    isAuth
    ? <Dashboard/>
    : <SignIn/>
  );
}
