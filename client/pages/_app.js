import 'rsuite/lib/styles/themes/dark/index.less';


// Next Wraps all our component(Pages) inside the App. We are defining our custom App Component.
export default ({Component, pageProps}) => {
  return <Component {...pageProps} />
}