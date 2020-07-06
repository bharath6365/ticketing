import React, { Fragment } from 'react';
import Link from 'next/link';
import { Header as RSuiteHeader, Nav, Icon } from 'rsuite';

export default function Header({ currentUser }) {
  return (
    <RSuiteHeader style={{marginBottom: '30px'}}>
      <Nav appearance="tabs">
        <Link href="/">
          <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
        </Link>

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
            <Link href="/tickets/new">
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
    </RSuiteHeader>
  );
}
