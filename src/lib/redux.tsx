/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { createBrowserHistory, createMemoryHistory, History } from "history";
import App from "next/app";
import React from "react";
import { Provider } from "react-redux";
import configureStore, {IApplicationState} from "../store";

const history = createMemoryHistory();

export const withRedux = (PageComponent, { ssr = true } = {}) => {
  const WithRedux = ({ initialReduxState, ...props }) => {
    const store = getOrInitializeStore(initialReduxState);
    return (
      <Provider store={store}>
        <PageComponent {...props} />
      </Provider>
    );
  };

  // Make sure people don't use this HOC on _app.js level
  if (process.env.NODE_ENV !== "production") {
    const isAppHoc =
      PageComponent === App || PageComponent.prototype instanceof App;
    if (isAppHoc) {
      throw new Error("The withRedux HOC only works with PageComponents");
    }
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    WithRedux.displayName = `withRedux(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithRedux.getInitialProps = async (context) => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStoreInstance = getOrInitializeStore(undefined);

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStoreInstance;

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === "function"
          ? await PageComponent.getInitialProps(context)
          : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStoreInstance.getState(),
      };
    };
  }

  return WithRedux;
};

let reduxStore;
const getOrInitializeStore = (initialState: any | undefined) => {
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
