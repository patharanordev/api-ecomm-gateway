import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';

export default function Index() {
  return (
    <div>
      <Container>
        <Box>
          <Button onClick={()=>{
            window.location.href = '/signin'
          }}>
          Sign-In
          </Button>
        </Box>
      </Container>
    </div>
  );
}
