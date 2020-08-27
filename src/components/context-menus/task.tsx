/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Classes, Icon, Menu, MenuDivider, MenuItem, Switch } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as navbarActions from "../../store/navbar/actions";

// Props passed from mapStateToProps
interface IPropsFromState {
    isUsingDarkTheme: boolean;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    enableDarkTheme: typeof navbarActions.enableDarkTheme;
}

// Component-specific props.
interface IOwnProps {
    task: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskContextMenu extends React.PureComponent<AllProps> {
    public onToggleDarkTheme = () => {
        this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
    }

    public render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <MenuDivider title="Task menu" />
                <Route
                    render={({history}) => (
                        <MenuItem
                            icon="application"
                            text="Open"
                            onClick={() => {
                                history.push(
                                    `/projects/${this.props.task.lane.project.id}/${this.props.task.id}`,
                                );
                            }}
                        />
                    )}
                />
                <MenuItem icon="applications" text="Open in new tab" onClick={this.openInNewTab}/>
                <MenuItem icon="mobile-video" text="Call person in charge" />
                <MenuDivider />
                <MenuItem icon="remove" text="Remove" />
            </Menu>
        );
    }

    private openInNewTab = () => {
        window.open(`/projects/${this.props.task.lane.project.id}/${this.props.task.id}`);
    }
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
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskContextMenu);
