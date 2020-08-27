/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button, Intent, Spinner } from "@blueprintjs/core";
import _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import TaskDetailPanel from "../../components/board/task-detail-panel";
import { IApplicationState, IConnectedReduxProps } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IActiveUserProfile } from "../../store/logins/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import { ITask, ITaskUpdateInput } from "../../store/tasks/types";
import { IStringTMap } from "../../utils/types";

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 15px;
`;

interface IProjectsBoardTaskPageState {
  displayReload: boolean;
}

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {
  project: IProject;
  getBoardLoading: boolean;
  setBoardProjectShortcode: typeof boardActions.setBoardProjectShortcode;
  getBoardRequestThenLoadTaskUpdate: typeof boardActions.getBoardRequestThenLoadTaskUpdate;
  getTaskRequestThenLoadTaskUpdate: typeof tasksActions.getTaskRequestThenLoadTaskUpdate;
  updateTaskSetInput: typeof tasksActions.updateTaskSetInput;
  taskMap: IStringTMap<ITask>;
  updateTaskInput: ITaskUpdateInput;
  activeUserProfile: IActiveUserProfile;
}

interface IPropsFromDispatch {

}

interface IRouteParams {
  id: string;
  taskID: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState &
  IPropsFromDispatch &
  RouteComponentProps<IRouteParams> &
  IConnectedReduxProps;

class ProjectsBoardTaskPage extends React.PureComponent<AllProps, IProjectsBoardTaskPageState> {
  public state: IProjectsBoardTaskPageState = {
    displayReload: _.isEmpty(this.props.activeUserProfile.id),
  };

  public componentDidMount() {
    this.loadTask();
  }

  public componentWillUnmount() {
    // clear selected team state before leaving the page
    // this.props.clearSelected()
    this.props.updateTaskSetInput({
      ...this.props.updateTaskInput,
      id: "", // Back to loading
    });
  }

  public componentDidUpdate(prevProps: Readonly<AllProps>) {
    // Reload the board if the previous profile got nothing but now we got authentication information
    if (_.isEmpty(prevProps.activeUserProfile.id) &&
      !_.isEmpty(this.props.activeUserProfile.id)) {
      this.loadTask();
      this.setState({
        displayReload: false,
      });
    }
  }

  public render() {
    return (
      this.state.displayReload ?
      (
        <Button
          intent={Intent.PRIMARY}
          text="Authenticating..."
          disabled={true}
        />
      ) :
      this.props.taskMap[this.props.match.params.taskID] === undefined || _.isEmpty(this.props.updateTaskInput.id) ?
      (
        <LoadingContainer>
            <Spinner
            />
        </LoadingContainer>
      ) :
      (
        <TaskDetailPanel
          isAdd={false}
        />
      )
    );
  }

  private loadTask() {
    const { match } = this.props;
    console.log(match, "Board Params");
    if (this.props.project.shortcode !== match.params.id) {
      this.props.setBoardProjectShortcode(match.params.id);
      // this.props.clearBoard();
      this.props.getBoardRequestThenLoadTaskUpdate(match.params.id, match.params.taskID);
      // this.props.selectTeam(match.params.id)
    } else {
      this.props.getTaskRequestThenLoadTaskUpdate(match.params.taskID);
    }
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, tasks, logins}: IApplicationState) => ({
  project: board.project,
  getBoardLoading: board.getBoardLoading,
  taskMap: board.taskMap,
  updateTaskInput: tasks.updateTaskInput,
  activeUserProfile: logins.activeUserProfile,
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setBoardProjectShortcode: (projectShortcode: string) =>
        dispatch(boardActions.setBoardProjectShortcode(projectShortcode)),
  getBoardRequestThenLoadTaskUpdate: (projectShortcode: string, taskID: string) =>
        dispatch(boardActions.getBoardRequestThenLoadTaskUpdate(projectShortcode, taskID)),
  getTaskRequestThenLoadTaskUpdate: (taskID: string) =>
        dispatch(tasksActions.getTaskRequestThenLoadTaskUpdate(taskID)),
  updateTaskSetInput: (input: ITaskUpdateInput) =>
        dispatch(tasksActions.updateTaskSetInput(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsBoardTaskPage);
