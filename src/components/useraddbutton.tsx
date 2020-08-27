/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable max-classes-per-file

import { Button, Classes, ContextMenu, ContextMenuTarget, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import classNames from "classnames";
import _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import * as usersActions from "../store/users/actions";
import { IUser } from "../store/users/types";
import { userSelectProps } from "./users/user-select-item";

const Container = styled.div`
    padding: 5px;
    display: inline-block;
    text-align: center;
`;

const UserSelect = Select.ofType<IUser>();

interface IUserAddButtonState {
    isContextMenuOpen: boolean;
}

interface IPropsFromState {
    usersLoading: boolean;
    usersLoaded: boolean;
    users: IUser[];
}

interface IPropsFromDispatch {
    getUsers: typeof usersActions.getUsers;
}

interface IOwnProps {
    sizeInPx?: number;
    doesDisplayName?: boolean;
    onSelectUser: (selectedUser: IUser) => void;
    excludeMembers?: string[];
    usePortal: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

/**
 * This component uses the imperative ContextMenu API.
 */
class UserAddButton extends React.PureComponent<AllProps, IUserAddButtonState> {
    public componentDidMount() {
        // Load roles
        if (!this.props.usersLoaded) {
            this.props.getUsers();
        }
    }

    public render() {
        // return <div
        //     className={classes}
        //     onContextMenu={this.showContextMenu}
        // >
        //     <img src={imgURL}/>
        // </div>;
        const doesDisplayName: boolean = this.props.doesDisplayName !== undefined ?
            this.props.doesDisplayName! : true ;
        const sizeInPx: number = this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80 ;
        return (
            <Container
                onClick={(e) => {e.stopPropagation(); }}
            >
                <UserSelect
                    {...userSelectProps}
                    items={_.filter(this.props.users, (eachUser: IUser) => {
                        if (this.props.excludeMembers !== undefined) {
                            return this.props.excludeMembers.indexOf(eachUser.id) < 0;
                        } else {
                            return true;
                        }
                    })}
                    // {...flags}
                    filterable={true}
                    disabled={this.props.usersLoading}
                    activeItem={null}
                    // isItemDisabled={false}
                    // initialContent={undefined}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.onSelectUser}
                    popoverProps={{
                        minimal: true,
                        usePortal: this.props.usePortal,
                        autoFocus: true,
                        enforceFocus: true,
                        position: "auto",
                        boundary: "viewport",
                    }}
                >
                    <div
                        style={{
                            width: `${sizeInPx}px`,
                            height: `${sizeInPx}px`,
                            overflow: "visible",
                        }}
                    >
                        <Button
                            active={true}
                            icon={IconNames.PLUS}
                            loading={this.props.usersLoading}
                            style={{
                                borderRadius: "50%",
                                height: "100%",
                                width: "100%",
                            }}
                        />
                    </div>
                    {doesDisplayName ?
                        (
                            <div
                                className={Classes.TEXT_MUTED}
                                style={{
                                    width: `${sizeInPx}px`,
                                    height: "20px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontSize: "0.8em",
                                }}
                            >
                                &nbsp;
                            </div>
                        ) :
                        null
                    }
                </UserSelect>
                {/* <Button
                    icon={IconNames.REFRESH}
                    minimal={true}
                    onClick={(e) => {
                        this.props.getUsers(); // Load users
                    }}
                /> */}
            </Container>
        );
    }

    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                {/* <MenuItem icon="search-around" text="Search around..." />
                <MenuItem icon="search" text="Object viewer" /> */}
                {/* <MenuItem icon="remove" text="Remove" /> */}
                <MenuItem icon="chat" text="Message" />
                <MenuItem icon="mobile-video" text="Call" />
                <MenuDivider />
                <MenuItem icon="layout-hierarchy" text="Role" />
                <MenuDivider />
                <MenuItem icon="remove" text="Remove" />
                {/* <MenuItem disabled={true} text="Clicked on node" /> */}
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }

    private onSelectUser = (selectedUser: IUser) => {
        this.props.onSelectUser(selectedUser);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({
    usersLoading: users.loading,
    usersLoaded: users.loaded,
    users: users.result.users,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUsers: () =>
        dispatch(usersActions.getUsers()),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserAddButton);
