import {Container, Footer} from 'rsuite';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Router from 'next/router';
import 'rsuite/lib/styles/themes/dark/index.less';
import Head from 'next/head';
import '../style.css';

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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:ital,wght@0,300;0,400;1,400&display=swap" rel="stylesheet" />
      </Head>
      <Header currentUser={currentUser}/>
      <div className="component-wrapper">
        <Component {...pageProps} currentUser={currentUser}/> 
      </div>         
    </Container>
  );
};

// NEXT JS passes information about the Request. Get the headers out of here and forward the cookie.
AppComponent.getInitialProps = async (appContext) => {
  // NEXT JS on the Server needs to reach out to INGRESS NGINX. ON THE Browser our host file routing clicks in.
  const client = buildClient(appContext.ctx)
  const {data} = await client.get('/api/users/currentuser');

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
}
export default AppComponent;
