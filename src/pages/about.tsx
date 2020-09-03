/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Switch } from "@blueprintjs/core";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import testAvatarData, { IAvatarData } from "../data/test-avatar-data";
import MainLayout from "../layout/main";
import { IApplicationState, IConnectedReduxProps } from "../store";
import * as navbarActions from "../store/navbar/actions";

// Props passed from mapStateToProps
interface IPropsFromState {
  isUsingDarkTheme: boolean;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
  enableDarkTheme: typeof navbarActions.enableDarkTheme;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & RouteComponentProps<{}> & IConnectedReduxProps;

class Page extends React.PureComponent<AllProps> {
  public static getInitialProps({ store }) {
    // Load something server side for the page
  }

  constructor(props) {
    super(props);
  }

  public render() {
    const { match } = this.props;

    return (
      <MainLayout>
        <div className="container-lg clearfix p-2">
          <div className="col-12 col-md-4 float-left border p-4">{"This is"}</div>
          <div className="col-12 col-md-4 float-left border p-4">{"the"}</div>
          <div className="col-12 col-md-4 float-left border p-4">{"About page"}</div>
        </div>
      </MainLayout>
    );
  }

  public onToggleDarkTheme = () => {
    this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
  };
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar }: IApplicationState) => ({
  isUsingDarkTheme: navbar.isUsingDarkTheme,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps, mapDispatchToProps)(Page);
