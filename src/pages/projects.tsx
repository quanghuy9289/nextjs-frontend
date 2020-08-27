/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { IApplicationState, IConnectedReduxProps } from "../store";
import ProjectsBoardPage from "./projects/board";
// import { Hero } from '../store/heroes/types'
import ProjectsIndexPage from "./projects/index";
import ProjectsBoardTaskPage from "./projects/task";

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & RouteComponentProps<{}> & IConnectedReduxProps;

class ProjectsPage extends React.PureComponent<AllProps> {
  public render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route exact={true} path={match.path + "/"} component={ProjectsIndexPage} />
        <Route path={match.path + "/:id/:taskID"} component={ProjectsBoardTaskPage} />
        <Route path={match.path + "/:id"} component={ProjectsBoardPage} />
      </Switch>
    );
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ projects }: IApplicationState) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps)(ProjectsPage);
