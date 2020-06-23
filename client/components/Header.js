import React, { Fragment } from 'react';
import Link from 'next/link';
import { Nav, Icon } from 'rsuite';

export default function Header({ currentUser }) {
  return (
    <Nav appearance="tabs">
      <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>

      {!currentUser && (
        <Fragment>
          <Link href="/auth/signin">
            <Nav.Item>Signin</Nav.Item>
          </Link>

          <Link href="/auth/signup">
            <Nav.Item>Signup</Nav.Item>
          </Link>
        </Fragment>
      )}

      {currentUser && (
        <Fragment>
          <Link href="/auth/signin">
            <Nav.Item>Tickets</Nav.Item>
          </Link>

          <Link href="/auth/signup">
            <Nav.Item>Orders</Nav.Item>
          </Link>

          <Link href="/auth/signout">
            <Nav.Item>Sign out</Nav.Item>
          </Link>
        </Fragment>
      )}
    </Nav>
  );
}
