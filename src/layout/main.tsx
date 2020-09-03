/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import { Button, Classes, Drawer, Icon, Popover, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import UserMenu from "../components/context-menus/user-setting-menu";
import { IApplicationState } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as loginsActions from "../store/logins/actions";
import * as navbarActions from "../store/navbar/actions";
import { IProject } from "../store/projects/types";
import { PrimerClasses } from "../types/primercss";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {
  isShowingDrawer: boolean;
  isUsingDarkTheme: boolean;
  userLoading: boolean;
  currentProject: IProject;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
  showDrawer: typeof navbarActions.showDrawer;
  enableDarkTheme: typeof navbarActions.enableDarkTheme;
  logout: typeof loginsActions.logout;
  openSprintRequirementDialog: typeof dialogsActions.openSprintRequirementDialog;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
// type AllProps = IPropsFromState & RouteComponentProps<{}> & IConnectedReduxProps;
type AllProps = IPropsFromState & IPropsFromDispatch;

class MainLayout extends React.PureComponent<AllProps> {
  public componentDidMount() {
    this.switchTheme(this.props.isUsingDarkTheme);
  }

  public componentDidUpdate(prevProps: Readonly<AllProps>, prevState: Readonly<{}>) {
    this.switchTheme(this.props.isUsingDarkTheme);
  }

  public render() {
    // const { match } = this.props;
    const settingMenu = (
      <UserMenu
        currentProject={this.props.currentProject}
        enableDarkTheme={this.props.enableDarkTheme}
        isUsingDarkTheme={this.props.isUsingDarkTheme}
        logout={this.props.logout}
        openSprintRequirementDialog={this.props.openSprintRequirementDialog}
        userLoading={this.props.userLoading}
      />
    );
    return (
      <Container className="width-full theme-sensitive-bg">
        <Drawer
          // className={this.props.data.themeName}
          icon="info-sign"
          onClose={this.handleCloseDrawer}
          title="Palantir Foundry"
          autoFocus={true}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          enforceFocus={true}
          hasBackdrop={true}
          isOpen={this.props.isShowingDrawer}
          position={Position.LEFT}
          size={Drawer.SIZE_SMALL}
          usePortal={true}
        >
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <p>
                <strong>
                  {
                    "Data integration is the seminal problem of the digital age. For over ten years, we’ve helped the world’s premier organizations rise to the challenge. "
                  }
                </strong>
              </p>
              <p>
                Palantir Foundry radically reimagines the way enterprises interact with data by amplifying and extending
                the power of data integration. With Foundry, anyone can source, fuse, and transform data into any shape
                they desire. Business analysts become data engineers — and leaders in their organization’s data
                revolution.
              </p>
              <p>
                Foundry’s back end includes a suite of best-in-class data integration capabilities: data provenance,
                git-style versioning semantics, granular access controls, branching, transformation authoring, and more.
                But these powers are not limited to the back-end IT shop.
              </p>
              <p>
                In Foundry, tables, applications, reports, presentations, and spreadsheets operate as data integrations
                in their own right. Access controls, transformation logic, and data quality flow from original data
                source to intermediate analysis to presentation in real time. Every end product created in Foundry
                becomes a new data source that other users can build upon. And the enterprise data foundation goes where
                the business drives it.
              </p>
              <p>Start the revolution. Unleash the power of data integration with Palantir Foundry.</p>
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>Footer</div>
        </Drawer>
        <div className={PrimerClasses.Header.HEADER}>
          <div className={PrimerClasses.Header.HEADER_ITEM}>
            <Button minimal={true} large={true} icon={IconNames.MENU} onClick={this.handleMenuClicked} />
          </div>
          <div className={PrimerClasses.Header.HEADER_ITEM}>
            <Link href="/">
              <a
                className={
                  [PrimerClasses.Header.HEADER_LINK, PrimerClasses.Typography.TypeScaleUtilities.F4].join(" ") +
                  ` d-flex flex-items-center`
                }
              >
                {/* tslint:disable-next-line:max-line-length */}
                <svg
                  height="32"
                  className="octicon octicon-mark-github mr-2"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="32"
                  aria-hidden="true"
                >
                  {/* tslint:disable-next-line:max-line-length */}
                  <path
                    fillRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                  />
                </svg>
                <span>GomHet</span>
              </a>
            </Link>
          </div>
          <div className="Header-item">
            <input type="search" className="form-control input-dark" />
          </div>
          {/* <div className="Header-item Header-item--full">
                        Menu
                    </div> */}
          <div className="Header-item hide-sm">
            <Link href="/about">
              <a className="Header-link">About</a>
            </Link>
          </div>
          <div className="Header-item hide-sm">
            <Link href="/releases">
              <a className="Header-link">Releases</a>
            </Link>
          </div>
          <div className="Header-item hide-sm">
            <Link href="/team">
              <a className="Header-link">Team</a>
            </Link>
          </div>
          <div className="Header-item hide-sm">
            <Link href="/users-management">
              <a className="Header-link">Users Management</a>
            </Link>
          </div>
          <div className="Header-item Header-item--full" />
          <div className="Header-item hide-md hide-lg hide-xl mr-2">
            <Popover content={settingMenu} position={Position.RIGHT_BOTTOM}>
              <Button icon={<Icon icon={IconNames.MENU} iconSize={30} />} minimal={true} large={true} />
            </Popover>
          </div>
          {/* <div className="Header-item mr-0">
                        <img
                            className="avatar"
                            width="32"
                            height="32"
                            src="https://github.com/broccolini.png"
                            alt="broccolini"
                        />
                    </div> */}
          {/* <div className="Header-item mr-0">
                        <img
                            className="avatar"
                            width="32"
                            height="32"
                            src="https://github.com/broccolini.png"
                            alt="broccolini"
                        />
                        <span className="feature-preview-indicator js-feature-preview-indicator"/>
                        <span className="dropdown-caret"/>
                    </div> */}
          <div className="Header-item position-relative mr-0">
            {/* <details
                            className="details-overlay details-reset js-feature-preview-indicator-container"
                        > */}
            <Popover content={settingMenu} position={Position.RIGHT_BOTTOM}>
              <summary className="Header-link">
                <img
                  alt="@thienohs"
                  className="avatar"
                  src="https://avatars2.githubusercontent.com/u/4403470?s=40&amp;v=4"
                  height="20"
                  width="20"
                />
                <span className="feature-preview-indicator" />
                {/* <a className="Header-link" onClick={logout} style={{paddingLeft: "10px"}}>Logout</a> */}
                {/* <span className="dropdown-caret ml-1"/> */}
              </summary>
            </Popover>
            {/* </details> */}
          </div>
        </div>
        {/* <nav className="menu hide-md hide-lg hide-xl" aria-label="Person settings">
                    <a className="menu-item" href="#url" aria-current="page">Account</a>
                    <a className="menu-item" href="#url">Profile</a>
                    <a className="menu-item" href="#url">Emails</a>
                    <a className="menu-item" href="#url">Notifications</a>
                </nav> */}
        {this.props.children}
      </Container>
    );
  }

  private switchTheme = (isUsingDarkTheme: boolean) => {
    if (isUsingDarkTheme) {
      document.body.classList.add("bp3-dark");
    } else {
      document.body.classList.remove("bp3-dark");
    }
  };

  private handleCloseDrawer = () => {
    this.props.showDrawer(false);
  };

  private handleMenuClicked = () => {
    this.props.showDrawer(!this.props.isShowingDrawer);
  };
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, users, board }: IApplicationState) => ({
  isShowingDrawer: navbar.isShowingDrawer,
  isUsingDarkTheme: navbar.isUsingDarkTheme,
  userLoading: users.loading,
  currentProject: board.project,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  showDrawer: (show: boolean) => dispatch(navbarActions.showDrawer(show)),
  enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
  logout: () => dispatch(loginsActions.logout()),
  openSprintRequirementDialog: (isOpen: boolean) => dispatch(dialogsActions.openSprintRequirementDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
// export default withRouter(connect(mapStateToProps)(MainLayout));
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
