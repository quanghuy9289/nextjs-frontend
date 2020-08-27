/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Classes,
    ContextMenu,
    Icon,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Position,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PropTypes from "prop-types";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";
import * as loginsActions from "../../store/logins/actions";
import * as navbarActions from "../../store/navbar/actions";
import * as projectsActions from "../../store/projects/actions";
import {
    IProject,
    IProjectDeleteInput,
    IProjectUpdateColorInput,
    IProjectUpdateUnitPointsRangeInput,
} from "../../store/projects/types";
import { CONST_MAXIMUM_UNIT_POINTS_POSSIBLE } from "../../utils/constants";
import UnitItemPointsField from "../board/unit-item-points-field";
import ColorsContextMenu from "../colors/colors-context-menu";

interface IProjectItemContextMenuState {
    isConfirmingDelete: boolean;
}

// Props passed from mapStateToProps
interface IPropsFromState {

}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    updateProjectColorRequest: typeof projectsActions.updateProjectColorRequest;
    updateProjectUnitPointsRangeRequest: typeof projectsActions.updateProjectUnitPointsRangeRequest;
    deleteProjectRequest: typeof projectsActions.deleteProjectRequest;
}

// Component-specific props.
interface IOwnProps {
    project: IProject;
    colorgroups: IStandardColorGroup[];
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ProjectItemContextMenu extends React.PureComponent<AllProps, IProjectItemContextMenuState> {
    public state: IProjectItemContextMenuState = {
        isConfirmingDelete: false,
    };
    public updateProjectUnitPointsRangeRequest;
    public render() {
        return (
            <Menu
                className={Classes.ELEVATION_1}
            >
                <MenuDivider title="SETTINGS" />
                <MenuItem
                    icon="style"
                    text="Archive"
                    disabled={true}
                    shouldDismissPopover={false}
                    labelElement={
                        <Switch
                            large={true}
                            disabled={true}
                            // checked={this.props.isUsingDarkTheme}
                            alignIndicator={Alignment.RIGHT}
                            // onChange={this.onToggleDarkTheme}
                        />
                    }
                />
                <MenuItem
                    text="Color code"
                    shouldDismissPopover={true}
                    icon={
                        <Icon
                            icon={IconNames.TINT}
                            color={
                                `rgba(
                                    ${this.props.project.color.red},
                                    ${this.props.project.color.green},
                                    ${this.props.project.color.blue},
                                    ${this.props.project.color.alpha})`
                            }
                        />
                    }
                    labelElement={
                        <Button
                            text="Change"
                            onClick={(e) => this.showProjectColorContextMenu(e)}
                        />
                    }
                >
                    {/* <ColorsContextMenu
                        colorgroups={this.props.colorgroups}
                        onSelectColor={(selectedColor: IStandardColor) => {
                            this.props.updateProjectColorRequest({
                                id: this.props.project.id,
                                color: selectedColor,
                            });
                        }}
                    /> */}
                </MenuItem>
                <MenuItem
                    text="Mimium unit points"
                    shouldDismissPopover={false}
                    icon={IconNames.ENDORSED}
                    labelElement={
                        <UnitItemPointsField
                            initialPoints={this.props.project.minUnitPoints}
                            minUnitPoints={0}
                            maxUnitPoints={this.props.project.maxUnitPoints}
                            onChange={((newPoints: number) => {
                                if (this.onMinUnitPointsChange !== undefined) {
                                    this.onMinUnitPointsChange(newPoints);
                                }
                            })}
                        />
                    }
                />
                <MenuItem
                    text="Maximum unit points"
                    shouldDismissPopover={false}
                    icon={IconNames.ENDORSED}
                    labelElement={
                        <UnitItemPointsField
                            initialPoints={this.props.project.maxUnitPoints}
                            minUnitPoints={this.props.project.minUnitPoints}
                            maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                            onChange={((newPoints: number) => {
                                if (this.onMaxUnitPointsChange !== undefined) {
                                    this.onMaxUnitPointsChange(newPoints);
                                }
                            })}
                        />
                    }
                />
                <MenuItem
                    icon={IconNames.REMOVE}
                    text="Delete"
                    shouldDismissPopover={false}
                    onClick={this.handleConfirmDelete}
                />
            </Menu>
        );
    }

    // private handleRemoveProject = (e: React.MouseEvent<HTMLElement>) => {
    //     this.props.deleteProjectRequest({
    //         id: this.props.project.id,
    //     });
    // }

    private handleDelete = () => {
        this.setState({
            isConfirmingDelete: true,
        });
    }

    private handleNotConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });
    }

    private handleConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });

        this.props.deleteProjectRequest({
            id: this.props.project.id,
        });
    }

    private onMinUnitPointsChange = (newPoints: number) => {
        this.props.updateProjectUnitPointsRangeRequest({
            id: this.props.project.id,
            minUnitPoints: newPoints,
            maxUnitPoints: this.props.project.maxUnitPoints,
        });
    }

    private onMaxUnitPointsChange = (newPoints: number) => {
        this.props.updateProjectUnitPointsRangeRequest({
            id: this.props.project.id,
            minUnitPoints: this.props.project.minUnitPoints,
            maxUnitPoints: newPoints,
        });
    }

    private showProjectColorContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <ColorsContextMenu
                colorgroups={this.props.colorgroups}
                onSelectColor={(selectedColor: IStandardColor) => {
                    this.props.updateProjectColorRequest({
                        id: this.props.project.id,
                        color: selectedColor,
                    });
                }}
            />,
            { left: e.clientX, top: e.clientY },
            () => {return; },
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ colors }: IApplicationState) => ({
    colorgroups: colors.colorgroups,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateProjectColorRequest: (input: IProjectUpdateColorInput) =>
        dispatch(projectsActions.updateProjectColorRequest(input)),
    updateProjectUnitPointsRangeRequest: (input: IProjectUpdateUnitPointsRangeInput) =>
        dispatch(projectsActions.updateProjectUnitPointsRangeRequest(input)),
    deleteProjectRequest: (input: IProjectDeleteInput) =>
        dispatch(projectsActions.deleteProjectRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectItemContextMenu);
