/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Classes, Icon, Menu, MenuDivider, MenuItem, Switch } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PropTypes from "prop-types";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as dialogsActions from "../../store/dialogs/actions";
import * as loginsActions from "../../store/logins/actions";
import { IProject } from "../../store/projects/types";
import { ITask } from "../../store/tasks/types";

// Props passed from mapStateToProps
interface IPropsFromState {

}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
}

// Component-specific props.
interface IOwnProps {
    project: IProject;
    task: ITask;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

// type TaskContextMenuProps = {
//     enableDarkTheme: boolean,
//     onToggleDarkTheme: any
// }

class TaskContextMenu extends React.PureComponent<AllProps> {
    public render() {
        return (
            <Route
                render={({history}) => (
                    <Menu>
                        {/* <MenuItem icon="search-around" text="Search around..." />
                        <MenuItem icon="search" text="Object viewer" /> */}
                        {/* <MenuItem icon="remove" text="Remove" /> */}
                        <MenuItem
                            icon={IconNames.APPLICATION}
                            text="Open"
                            onClick={() => {
                                history.push(
                                    `/projects/${this.props.project.shortcode}/${this.props.task.id}`,
                                );
                            }}
                        />
                        <MenuItem
                            icon={IconNames.APPLICATION}
                            text="Open in dialog"
                            onClick={this.openEditTaskDialog}
                        />
                        <MenuItem icon={IconNames.APPLICATIONS} text="Open in new tab" onClick={this.openInNewTab}/>
                        <MenuItem icon={IconNames.MOBILE_VIDEO} text="Call person in charge" />
                        <MenuDivider />
                        <MenuItem icon={IconNames.LIST_COLUMNS} text="Column">
                            <MenuItem icon="bold" text="Bold" />
                            <MenuItem icon="italic" text="Italic" />
                            <MenuItem icon="underline" text="Underline" />
                        </MenuItem>
                        <MenuItem icon={IconNames.LIST} text="Priority">
                            <MenuItem icon="bold" text="Bold" />
                            <MenuItem icon="italic" text="Italic" />
                            <MenuItem icon="underline" text="Underline" />
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={IconNames.REMOVE}  text="Remove" />
                        {/* <MenuItem disabled={true} text="Clicked on node" /> */}
                    </Menu>
                )}
            />
        );
    }

    private openEditTaskDialog = () => {
        // this.props.setEditTaskState(this.props.columnID, this.props.priorityID, this.props.task);
        this.props.openEditTaskDialog(true);
    }

    private openInNewTab = () => {
        window.open(`/projects/${this.props.project.shortcode}/${this.props.task.id}`);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEditTaskDialog: (isOpen: boolean) =>
         dispatch(dialogsActions.openEditTaskDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskContextMenu);
