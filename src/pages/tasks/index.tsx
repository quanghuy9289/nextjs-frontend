/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this task.
 */

import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import TaskListTabPanel from "../../components/tasks/task-list-tab-panel";
import { IApplicationState, IConnectedReduxProps } from "../../store";

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {
  // loading: boolean
  // selected?: TeamSelectedPayload
  // errors?: string
}

interface IPropsFromDispatch {
  // selectTeam: typeof selectTeam
  // clearSelected: typeof clearSelected
}

interface IRouteParams {
  id: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState &
  IPropsFromDispatch &
  RouteComponentProps<IRouteParams> &
  IConnectedReduxProps;

class TasksPage extends React.PureComponent<AllProps> {
  public componentDidMount() {
    const { match } = this.props;

    // this.props.selectTeam(match.params.id)
  }

  public componentWillUnmount() {
    // clear selected team state before leaving the page
    // this.props.clearSelected()
  }

  public render() {
    return (
      <TaskListTabPanel
      />
    );
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ tasks }: IApplicationState) => ({
  // loading: teams.loading,
  // errors: teams.errors,
  // selected: teams.selected
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  // selectTeam: (team_id: string) => dispatch(selectTeam(team_id)),
  // clearSelected: () => dispatch(clearSelected())
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TasksPage);
