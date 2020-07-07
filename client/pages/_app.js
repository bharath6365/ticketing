import 'rsuite/lib/styles/themes/dark/index.less';
import '../style.less';
import {Container, Footer} from 'rsuite';
import Header from '../components/Header';
import buildClient from '../api/build-client';
console.log('Base Client App listening for events');

// Next Wraps all our component(Pages) inside the App. We are defining our custom App Component.
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Container>
      <Header currentUser={currentUser}/>
      <Component {...pageProps} currentUser={currentUser}/>      
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
