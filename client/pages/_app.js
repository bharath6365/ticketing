import 'rsuite/lib/styles/themes/dark/index.less';
import Header from '../components/Header';
import buildClient from '../api/build-client';

// Next Wraps all our component(Pages) inside the App. We are defining our custom App Component.
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component {...pageProps} currentUser={currentUser}/>
    </div>
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
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }  

  return {
    pageProps,
    currentUser: data.currentUser
  };
}
export default AppComponent;
