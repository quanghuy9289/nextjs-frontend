/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import _ from "lodash";
import * as React from "react";
import { Cookies, withCookies } from "react-cookie";
import { connect, Provider } from "react-redux";
import { Dispatch, Store } from "redux";
import HomeLayout from "./layout/home";
import MainLayout from "./layout/main";
import { IApplicationState } from "./store";
import * as cookiesActions from "./store/cookies/actions";
import * as dialogsActions from "./store/dialogs/actions";
import * as loginsActions from "./store/logins/actions";
import { ILoginInput, ILoginResult, ILoginValidation } from "./store/logins/types";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
  CONST_COOKIE_EMAIL,
  CONST_COOKIE_REMEMBER_ME,
} from "./utils/constants";
import { stringToBoolean } from "./utils/strings";
import { validateEmail } from "./utils/validator";

// Separate props from state and props from dispatch to their own interfaces.
interface IPropsFromState {
    isUsingDarkTheme: boolean;
}

interface IPropsFromDispatch {
    [key: string]: any;
    setCookiesSharedObject: typeof cookiesActions.setCookiesSharedObject;
    loginResult: typeof loginsActions.loginResult;
    setLoginInput: typeof loginsActions.setLoginInput;
    setLoginValidation: typeof loginsActions.setLoginValidation;
    openLoginDialog: typeof dialogsActions.openLoginDialog;
    getActiveUserProfileByAuthTokenRequest: typeof loginsActions.getActiveUserProfileByAuthTokenRequest;
}

// Any additional component props go here.
interface IOwnProps {
    store: Store<IApplicationState>;
    history: History;
}

// Create an intersection type of the component props and our Redux props.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class App extends React.Component<AllProps> {
  constructor(props) {
    super(props);
    // Share cookies object reference to redux store
    this.props.setCookiesSharedObject(this.props.cookies);
    // Load cookies to state
    const authToken: string | undefined = this.props.cookies.get(CONST_COOKIE_AUTHENTICATION_TOKEN);
    const email: string | undefined = this.props.cookies.get(CONST_COOKIE_EMAIL);
    const rememberMe: boolean = stringToBoolean(this.props.cookies.get(CONST_COOKIE_REMEMBER_ME));
    if (!_.isUndefined(authToken) && !_.isEmpty(authToken)) {
      this.props.loginResult({
        authtoken: authToken,
      });
      // Load the user profile
      this.props.getActiveUserProfileByAuthTokenRequest();
    } else {
      // Open log in dialog
      this.props.openLoginDialog(true);
    }

    if (email !== undefined) {
      this.props.setLoginInput({
        email,
        password: "",
        rememberMe,
      });
      this.props.setLoginValidation({
        isEmailValid: validateEmail(email),
      });
    }
  }

  public render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
            {/* <HomeLayout /> */}
            <MainLayout />
        </ConnectedRouter>
      </Provider>
    );
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, cookies }: IApplicationState) => ({
    isUsingDarkTheme: navbar.isUsingDarkTheme,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCookiesSharedObject: (cookies: Cookies) => dispatch(cookiesActions.setCookiesSharedObject(cookies)),
  loginResult: (result: ILoginResult) => dispatch(loginsActions.loginResult(result)),
  setLoginInput: (input: ILoginInput) => dispatch(loginsActions.setLoginInput(input)),
  setLoginValidation: (validation: ILoginValidation) =>
    dispatch(loginsActions.setLoginValidation(validation)),
  openLoginDialog: (isOpen: boolean) =>
    dispatch(dialogsActions.openLoginDialog(isOpen)),
  getActiveUserProfileByAuthTokenRequest: () =>
    dispatch(loginsActions.getActiveUserProfileByAuthTokenRequest()),
});

// Normally you wouldn't need any generics here (since types infer from the passed functions).
// But since we pass some props from the `index.js` file, we have to include them.
// For an example of a `connect` function without generics, see `./containers/LayoutContainer`.
export default withCookies(connect<IPropsFromState, IPropsFromDispatch, IOwnProps, IApplicationState>(
  mapStateToProps,
  mapDispatchToProps,
)(App));
