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
import { IColumn } from "../../store/columns/types";
import * as navbarActions from "../../store/navbar/actions";
import { IStringTMap } from "../../utils/types";

// Props passed from mapStateToProps
interface IPropsFromState {
    isUsingDarkTheme: boolean;
    columnMap: IStringTMap<IColumn>;
    columnsOrder: string[];
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    enableDarkTheme: typeof navbarActions.enableDarkTheme;
}

// Component-specific props.
interface IOwnProps {
    onSelectColumn: (selectedColumn: IColumn) => void;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskDetailPanelSelectColumnContextMenu extends React.PureComponent<AllProps> {
    public onToggleDarkTheme = () => {
        this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
    }

    public render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <MenuDivider title="Select column" />
                {
                    this.props.columnsOrder.map((eachColumnID: string) => {
                        const column = this.props.columnMap[eachColumnID];
                        if (column !== undefined) {
                            return (
                                <MenuItem
                                    key={column.id}
                                    text={column.title}
                                    onClick={() => {this.props.onSelectColumn(column); }}
                                />
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </Menu>
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, board }: IApplicationState) => ({
    isUsingDarkTheme: navbar.isUsingDarkTheme,
    columnMap: board.columnMap,
    columnsOrder: board.columnsOrder,
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
)(TaskDetailPanelSelectColumnContextMenu);
