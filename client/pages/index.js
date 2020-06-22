import React from 'react';
import { Button } from 'rsuite';
import buildClient from '../api/build-client';

const Landing = ({ currentUser }) => {
  console.log('Current user is', currentUser);
  return (
    <Button appearance="primary" href="https://rsuitejs.com/">
      Getting started
    </Button>
  );
};

// NEXT JS passes information about the Request. Get the headers out of here and forward the cookie.
Landing.getInitialProps = async (context) => {
  // NEXT JS on the Server needs to reach out to INGRESS NGINX. ON THE Browser our host file routing clicks in.
  const client = buildClient(context)
  const {data} = await client.get('/api/users/currentuser');
  
  return data;
}

export default Landing;
