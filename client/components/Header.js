import React, { Fragment } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { Header as RSuiteHeader, Nav, Icon } from 'rsuite';

const ROUTES = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  signout: '/auth/signout',
  sell: '/tickets/new',
  orders: '/orders'
};

export default function Header({ currentUser }) {
  const router = useRouter();
  // Utility function that decides which route is active.
  const isActive = (href) => {
    return router.pathname === href;
  };

  return (
    <RSuiteHeader style={{ marginBottom: '30px' }}>
      <Nav appearance="tabs" justified>
        <Link href={ROUTES.home}>
          <Nav.Item active={isActive(ROUTES.home)} icon={<Icon icon="home" />}>
            Home
          </Nav.Item>
        </Link>

        {!currentUser && (
          <Fragment>
            <Link href={ROUTES.signin}>
              <Nav.Item active={isActive(ROUTES.signin)} icon={<Icon icon="sign-in" />}>Signin</Nav.Item>
            </Link>

            <Link href={ROUTES.signup}>
              <Nav.Item active={isActive(ROUTES.signup)} icon={<Icon icon="user-plus" />}>Signup</Nav.Item>
            </Link>
          </Fragment>
        )}

        {currentUser && (
          <Fragment>
            <Link href={ROUTES.sell}>
              <Nav.Item active={isActive(ROUTES.sell)} icon={<Icon icon="plus-square" />}>Sell</Nav.Item>
            </Link>

            <Link href={ROUTES.orders}>
              <Nav.Item active={isActive(ROUTES.orders)} icon={<Icon icon="shopping-cart" />}>Orders</Nav.Item>
            </Link>

            <Link href={ROUTES.signout}>
              <Nav.Item active={isActive(ROUTES.signout)} icon={<Icon icon="sign-out" />}>Sign out</Nav.Item>
            </Link>
          </Fragment>
        )}
      </Nav>
    </RSuiteHeader>
  );
}
