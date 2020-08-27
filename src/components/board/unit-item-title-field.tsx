/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Card,
    Checkbox,
    Classes,
    ContextMenu,
    Dialog,
    EditableText,
    Elevation,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NumericInput,
    Popover,
    Position,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { History } from "history";
import _ from "lodash";
import React, { FormEvent } from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route, Router } from "react-router";
import { withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor } from "../../store/colors/types";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import { ISprint } from "../../store/sprints/types";
import * as tasksActions from "../../store/tasks/actions";
import { IUnit } from "../../store/units/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { IStringTMap } from "../../utils/types";
import UserImage from "../userimage";

const Container = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
`;

interface IUnitItemTitleFieldState {
    title: string;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    initialTitle?: string;
    large?: boolean;
    checked?: boolean;
    alignIndicator?: Alignment;
    onChange?: (newValue: string) => void;
    onComplete?: (completed: boolean) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    userChecked?: IUser;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class UnitItemTitleField extends React.PureComponent<AllProps, IUnitItemTitleFieldState> {
    public state: IUnitItemTitleFieldState = {
        title: this.props.initialTitle !== undefined ? this.props.initialTitle  : "",
    };

    private debounceTitleChange = _.debounce(() => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(
                this.state.title,
            );
        }
    }, 500);

    public render() {
        return (
            <div
                style={{
                    flexGrow: 1,
                }}
            >
                <InputGroup
                    value={this.state.title}
                    placeholder={"Type your unit title..."}
                    onBlur={() => {
                        if (this.props.onBlur !== undefined) {
                            this.props.onBlur();
                        }
                    }}
                    onFocus={() => {
                        if (this.props.onFocus !== undefined) {
                            this.props.onFocus();
                        }
                    }}
                    rightElement={
                        _.isUndefined(this.props.userChecked) ?
                        // <Checkbox
                        //     large={this.props.large}
                        //     checked={this.props.checked}
                        //     alignIndicator={this.props.alignIndicator}
                        //     onChange={this.onCompletedChange}
                        // />
                        <Button
                            onClick={this.handleCompleteUnit}
                            active={true}
                            intent={Intent.PRIMARY}
                            style={{
                                maxWidth: `24px`,
                                maxHeight: `24px`,
                                borderRadius: "2px",
                                overflow: "hidden",
                                marginRight: "5px",
                            }}
                        />
                         :
                        <Button
                            onClick={this.handleUncompleteUnit}
                            active={true}
                            // minimal={true}
                            icon={
                                <img
                                    src={this.props.userChecked.avatarBase64}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        margin: "auto",
                                    }}
                                />
                            }
                            loading={_.isUndefined(this.props.userChecked.avatarBase64)}
                            style={{
                                maxWidth: `24px`,
                                maxHeight: `24px`,
                                borderRadius: "2px",
                                overflow: "hidden",
                                padding: "0px",
                                marginRight: "5px",
                                justifyContent: "center",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        />
                    }
                    onChange={(e) => {
                        this.onTitleChange(e.target.value);
                    }}
                />
            </div>
        );
    }

    private onTitleChange = (newValue: string) => {
        this.setState({
            title: newValue,
        });
        this.debounceTitleChange();
    }

    // private onCompletedChange = (e: FormEvent<HTMLInputElement>) => {
    //     if (this.props.onComplete !== undefined) {
    //         this.props.onComplete((e.target as HTMLInputElement).checked);
    //     }
    // }

    private handleCompleteUnit = (e) => {
        if (this.props.onComplete !== undefined) {
            this.props.onComplete(true);
        }
    }

    private handleUncompleteUnit = (e) => {
        if (this.props.onComplete !== undefined) {
            this.props.onComplete(false);
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnitItemTitleField);
