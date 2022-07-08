import { App } from "../src/compo/App";
import { GlobalItemsProvider } from "../src/context/GlobalItemsProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalItemsProvider>
        <App Component={Component} pageProps={pageProps} />
      </GlobalItemsProvider>
    </>
  );
}

export default MyApp;
