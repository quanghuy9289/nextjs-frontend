/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import "@atlaskit/css-reset";
import React from "react";
import "../../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
// import 'medium-draft/lib/index.css';
// import '../../node_modules/megadraft/dist/css/megadraft.css'
// import '../../node_modules/draft-js-inline-toolbar-plugin/lib/plugin.css'
import "../../node_modules/@blueprintjs/table/lib/css/table.css";
import "../../node_modules/normalize.css/normalize.css";
import "../css/index.css";
import "../scss/index.scss";

// function MyApp({ Component, pageProps }) {
//     return <Component {...pageProps} />;
// }

// // Only uncomment this method if you have blocking data requirements for
// // every single page in your application. This disables the ability to
// // perform automatic static optimization, causing every page in your app to
// // be server-side rendered.
// //
// // MyApp.getInitialProps = async (appContext) => {
// //   // calls page's `getInitialProps` and fills `appProps.pageProps`
// //   const appProps = await App.getInitialProps(appContext);
// //
// //   return { ...appProps }
// // }

// export default MyApp;

import { createMemoryHistory } from "history";
import _ from "lodash";
import withRedux from "next-redux-wrapper";
import App from "next/app";
import { Provider } from "react-redux";
import { AnyAction, Store } from "redux";
import configureStore, { IApplicationState } from "../store";

import cookie from "js-cookie";
import Router from "next/router";
import { CONST_COOKIE_AUTHENTICATION_TOKEN } from "../utils/constants";

const history = createMemoryHistory();

let reduxStore: Store<IApplicationState, AnyAction>;
const getOrInitializeStore = (initialState: any | undefined): Store<IApplicationState, AnyAction> => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return configureStore(history, initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = configureStore(history, initialState);
  }

  return reduxStore;
};

class MyApp extends App<{ store: Store<IApplicationState, AnyAction> }> {
  public static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    // Anything returned here can be accessed by the client
    return { pageProps };
  }

  public componentDidMount() {
    const { logins } = this.props.store.getState();
    const authToken: string | undefined = cookie.get(CONST_COOKIE_AUTHENTICATION_TOKEN);

    if (!_.isUndefined(authToken) && !_.isEmpty(authToken)) {
      logins.result.authtoken = authToken;
      // TODO: Load the user profile by token
      // this.props.store.dispatch(loginsActions.getActiveUserProfileByAuthTokenRequest());
    } else {
      Router.push("/login");
    }
  }

  public render() {
    // pageProps that were returned  from 'getInitialProps' are stored in the props i.e. pageprops
    const { Component, pageProps, store } = this.props;

    return (
      <>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
}

// makeStore function that returns a new store for every request
const makeStore = () => getOrInitializeStore(undefined);

// withRedux wrapper that passes the store to the App Component
export default withRedux(makeStore)(MyApp);
