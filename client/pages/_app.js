import { Container, Footer } from 'rsuite';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Router from 'next/router';
import 'rsuite/lib/styles/themes/dark/index.less';
import Head from 'next/head';
import '../style.scss';

//styles of nprogress

import Header from '../components/Header';
import buildClient from '../api/build-client';

// Navigation Progress...
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Next Wraps all our component(Pages) inside the App. We are defining our custom App Component.
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Container>
      <Head>
        <title>Ticket Sell</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="component-wrapper">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </Container>
  );
};

// NEXT JS passes information about the Request. Get the headers out of here and forward the cookie.
AppComponent.getInitialProps = async (appContext) => {
  // NEXT JS on the Server needs to reach out to INGRESS NGINX. ON THE Browser our host file routing clicks in.
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // Get the page props and call the getInitialProps of all the child components.
  let pageProps;
  if (appContext.Component.getInitialProps) {
    // Pass client and current user as get initial props as well.
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    currentUser: data.currentUser
  };
};
export default AppComponent;
