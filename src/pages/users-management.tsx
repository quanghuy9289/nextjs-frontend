/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
  Alert,
  Alignment,
  AnchorButton,
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
  Tooltip,
} from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import MainLayout from "../layout/main";
import { IApplicationState, IConnectedReduxProps } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as navbarActions from "../store/navbar/actions";
import * as userActions from "../store/users/actions";
import { ICreateUser, IUser } from "../store/users/types";
import { IStringTMap } from "../utils/types";

// Props passed from mapStateToProps
interface IPropsFromState {
  isUsingDarkTheme: boolean;
  users: IStringTMap<IUser>;
  columns: Column[];
  isAddNew: boolean;
  isOpen: boolean;
  isOpenDeletePopup: boolean;
  email: string;
  password: string;
  fullName: string;
  nickName: string;
  avatarBase64: string;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
  enableDarkTheme: typeof navbarActions.enableDarkTheme;
  getUsers: typeof userActions.getUsers;
  updateUserRequest: typeof userActions.updateUserRequest;
  deleteUserRequest: typeof userActions.deleteUserRequest;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & RouteComponentProps<{}> & IConnectedReduxProps;

class Page extends React.PureComponent<AllProps> {
  public static getInitialProps({ store }) {
    // Load something server side for the page
  }

  public state = {
    columns: [
      // default column name
      <Column key="0" name="Id" />,
      <Column key="1" name="Email" />,
      <Column key="2" name="Full Name" />,
      <Column key="3" name="Nick Name" />,
      <Column key="4" name="Action" />,
    ],
    isAddNew: false,
    isOpen: false,
    isOpenDeletePopup: false,
    currentUser: null,
    id: "",
    email: "",
    password: "",
    fullName: "",
    nickName: "",
    avatarBase64: "",
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.props.getUsers();
  }

  public render() {
    const { match } = this.props;
    const numRows = _.values(this.props.users).length;
    let columns = this.state.columns;
    if (numRows > 0) {
      const firstUser = _.values(this.props.users)[0];
      const colSize = Object.keys(firstUser).length;
      columns = Object.keys(firstUser).map((columnName, index) => (
        <Column key={index} name={this.formatColumnName(columnName)} cellRenderer={this.renderCell} />
      ));
      // push action column
      columns.push(<Column key={colSize + 1} name="Action" cellRenderer={this.renderActionColumn} />);
    }

    return (
      <MainLayout>
        <div className="container-lg clearfix p-2">
          <h1>Users</h1>
          <div style={{ height: "30px", margin: "10px 0px", display: "flex" }}>
            <Tooltip content="Add new user">
              <Button onClick={() => this.handleAddNewUser()} icon="add" intent="primary">
                Add
              </Button>
            </Tooltip>
            <div style={{marginLeft: "10px"}}>
            <InputGroup
              type="input"
              placeholder="Input value"
            />
            </div>
            <div style={{marginLeft: "10px"}}>
            <InputGroup
              type="input"
              className="bp3-icon bp3-icon-search"
              placeholder="Input search value"
              rightElement={< Button icon="search" minimal={true} />}
            />
            </div>
          </div>
          <Table numRows={numRows} defaultRowHeight={30}>
            {columns}
          </Table>
          {this.renderUpdateDialog()}
          {this.renderDeleteConfirm()}
        </div>
      </MainLayout>
    );
  }

  public onToggleDarkTheme = () => {
    this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
  };

  private renderUpdateDialog() {
    return (
      <Dialog icon="info-sign" onClose={this.handleClose} title="Add/Update user" {...this.state}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            // helperText="Helper text with details..."
            label="Email"
          // labelFor="text-input"
          // labelInfo="(required)"
          >
            <InputGroup
              value={this.state.email}
              placeholder="Email..."
              onChange={(e) => this.onChangeUserInfor("email", e.target.value)}
            // intent={this.props.loginValidation.isEmailValid === false ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
          {this.state.isAddNew && (
            <FormGroup
              // helperText="Helper text with details..."
              label="Password"
            // labelFor="text-input"
            // labelInfo="(required)"
            >
              <InputGroup
                value={this.state.password}
                type="password"
                placeholder="Password..."
                onChange={(e) => this.onChangeUserInfor("password", e.target.value)}
              // intent={this.props.loginValidation.isEmailValid === false ? Intent.DANGER : Intent.NONE}
              />
            </FormGroup>
          )}
          <FormGroup
            // helperText="Helper text with details..."
            label="FullName"
          // labelFor="text-input"
          // labelInfo="(required)"
          >
            <InputGroup
              value={this.state.fullName}
              placeholder="FullName..."
              onChange={(e) => this.onChangeUserInfor("fullName", e.target.value)}
            // intent={this.props.loginValidation.isEmailValid === false ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
          <FormGroup
            // helperText="Helper text with details..."
            label="NickName"
          // labelFor="text-input"
          // labelInfo="(required)"
          >
            <InputGroup
              value={this.state.nickName}
              placeholder="NickName..."
              onChange={(e) => this.onChangeUserInfor("nickName", e.target.value)}
            // intent={this.props.loginValidation.isEmailValid === false ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Tooltip content="This button is hooked up to close the dialog.">
              <Button onClick={this.handleClose}>Close</Button>
            </Tooltip>
            <AnchorButton intent={Intent.PRIMARY} onClick={this.handleSave}>
              Save
            </AnchorButton>
          </div>
        </div>
      </Dialog>
    );
  }

  private renderDeleteConfirm = () => {
    return (
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete this user?"
        icon="trash"
        isOpen={this.state.isOpenDeletePopup}
        intent={Intent.DANGER}
        onCancel={this.handleCancelDeletePopup}
        onConfirm={this.handleDeleteUser}
      >
        <p>
          Are you sure you want to move user <b>{this.state.email}</b> to Trash? You will be able to restore it later,
          but it will become private to you.
        </p>
      </Alert>
    );
  };

  private renderCell = (rowIndex: number, columnIndex: number) => {
    const user = _.values(this.props.users)[rowIndex];
    return <Cell>{user[Object.keys(user)[columnIndex]]}</Cell>;
  };

  private renderActionColumn = (rowIndex: number, columnIndex: number) => {
    const user = _.values(this.props.users)[rowIndex];
    return (
      <Cell>
        <>
          <Button minimal={true} onClick={() => this.handleEditUser(user)} icon="edit" />
          <Button minimal={true} icon="delete" intent="danger" onClick={() => this.handleClickDeleteUser(user)} />
        </>
      </Cell>
    );
  };

  private formatColumnName = (columnName: string) => {
    return columnName.replace(/([A-Z])/g, " $1").replace(/^./, (firstCharacter) => firstCharacter.toUpperCase());
  };

  private handleAddNewUser = () => {
    // this.setState({
    //   isAddNew: true,
    //   isOpen: true,
    //   id: "",
    //   email: "",
    //   fullName: "",
    //   nickName: "",
    //   avatarBase64: "",
    // });
  };

  private handleEditUser = (user: IUser) => {
    this.setState({
      isAddNew: false,
      isOpen: true,
      id: user.id,
      email: user.email,
      fullName: user.fullname,
      nickName: user.nickname,
      avatarBase64: user.avatarBase64,
    });
  };

  private handleClickDeleteUser = (user: IUser) => {
    this.setState({
      isOpen: false,
      isOpenDeletePopup: true,
      id: user.id,
      email: user.email,
    });
  };

  private handleOpen = () => this.setState({ isOpen: true });
  private handleClose = () => this.setState({ isOpen: false });
  private handleCancelDeletePopup = () => this.setState({ isOpenDeletePopup: false });

  private onChangeUserInfor = (field: string, value: any) => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  };

  private handleSave = () => {
    const user: IUser = {
      id: this.state.id,
      email: this.state.email,
      fullname: this.state.fullName,
      nickname: this.state.nickName,
      avatarBase64: this.state.avatarBase64,
    };
    this.props.updateUserRequest(user);
    this.setState({
      isOpen: false,
    });
  };

  private handleDeleteUser = () => {
    this.setState(
      {
        isOpenDeletePopup: false,
      },
      () => this.props.deleteUserRequest(this.state.id),
    );
  };
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, users }: IApplicationState) => ({
  isUsingDarkTheme: navbar.isUsingDarkTheme,
  users: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
  getUsers: () => dispatch(userActions.getUsers()),
  createUserRequest: (input: ICreateUser) => dispatch(userActions.createUserRequest(input)),
  updateUserRequest: (input: IUser) => dispatch(userActions.updateUserRequest(input)),
  deleteUserRequest: (id: string) => dispatch(userActions.deleteUserRequest(id)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps, mapDispatchToProps)(Page);
