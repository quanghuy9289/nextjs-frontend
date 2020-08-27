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
import Board from "../../components/board/board";
import { IApplicationState, IConnectedReduxProps } from "../../store";
import * as boardActions from "../../store/board/actions";
import * as loginsActions from "../../store/logins/actions";
import { IActiveUserProfile } from "../../store/logins/types";
import { IProject } from "../../store/projects/types";

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 15px;
`;

interface IProjectsBoardPageState {
  displayReload: boolean;
}

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {
  // loading: boolean
  // selected?: TeamSelectedPayload
  // errors?: string
  project: IProject;
  getBoardLoading: boolean;
  activeUserProfile: IActiveUserProfile;
}

interface IPropsFromDispatch {
  // selectTeam: typeof selectTeam
  // clearSelected: typeof clearSelected
  setBoardProjectShortcode: typeof boardActions.setBoardProjectShortcode;
  clearBoard: typeof boardActions.clearBoard;
  getBoardRequest: typeof boardActions.getBoardRequest;
}

interface IRouteParams {
  id: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState &
  IPropsFromDispatch &
  RouteComponentProps<IRouteParams> &
  IConnectedReduxProps;

class ProjectsBoardPage extends React.PureComponent<AllProps, IProjectsBoardPageState> {
  public state: IProjectsBoardPageState = {
    displayReload: _.isEmpty(this.props.activeUserProfile.id),
  };

  public componentDidMount() {
    this.loadBoard();
  }

  public componentDidUpdate(prevProps: Readonly<AllProps>) {
    // Reload the board if the previous profile got nothing but now we got authentication information
    if (_.isEmpty(prevProps.activeUserProfile.id) &&
      !_.isEmpty(this.props.activeUserProfile.id)) {
      this.loadBoard();
      this.setState({
        displayReload: false,
      });
    }
  }

  public componentWillUnmount() {
    // clear selected team state before leaving the page
    // this.props.clearSelected()
  }

  public render() {
    // if (this.props.getBoardLoading) {
    //   return (
    //       <LoadingContainer>
    //           <Spinner
    //           />
    //       </LoadingContainer>
    //   );
    // } else {
    //   return (
    //     <Board
    //       projectShortcode={this.props.match.params.id}
    //     />
    //     // <BoardTable />
    //   );
    // }
    return (
      this.state.displayReload ?
      (
        <Button
          intent={Intent.PRIMARY}
          text="Authenticating..."
          disabled={true}
        />
      ) :
      this.props.getBoardLoading || _.isEmpty(this.props.project.id) ?
      (
        <LoadingContainer>
            <Spinner
            />
        </LoadingContainer>
      ) :
      (
        <Board
          projectShortcode={this.props.match.params.id}
        />
      )
    );
  }

  private loadBoard() {
    const { match } = this.props;
    console.log(match, "Board Params");
    if (this.props.project.shortcode !== match.params.id) {
      this.props.setBoardProjectShortcode(match.params.id);
      // this.props.clearBoard();
      this.props.getBoardRequest(match.params.id);
      // this.props.selectTeam(match.params.id)
    }
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, logins}: IApplicationState) => ({
  // loading: teams.loading,
  // errors: teams.errors,
  // selected: teams.selected
  project: board.project,
  getBoardLoading: board.getBoardLoading,
  activeUserProfile: logins.activeUserProfile,
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  // selectTeam: (team_id: string) => dispatch(selectTeam(team_id)),
  // clearSelected: () => dispatch(clearSelected())
  setBoardProjectShortcode: (projectShortcode: string) =>
        dispatch(boardActions.setBoardProjectShortcode(projectShortcode)),
  clearBoard: () =>
        dispatch(boardActions.clearBoard()),
  getBoardRequest: (projectShortcode: string) =>
        dispatch(boardActions.getBoardRequest(projectShortcode)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsBoardPage);
