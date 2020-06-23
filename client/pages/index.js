import React from 'react';
import { Button } from 'rsuite';

const Landing = ({ currentUser }) => {
  return (
    <Button appearance="primary" href="/">
      {currentUser ? 'You are logged in' : 'Log in'}
    </Button>
  );
};

export default Landing;
