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
import React from "react";
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

interface IUnitItemPointsFieldState {
    points: number;
    tempPointsStringValue: string;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    initialPoints: number;
    minUnitPoints: number;
    maxUnitPoints: number;
    onChange?: (newPoints: number) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    disabled?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class UnitItemPointsField extends React.PureComponent<AllProps, IUnitItemPointsFieldState> {
    public state: IUnitItemPointsFieldState = {
        points: this.props.initialPoints,
        tempPointsStringValue: this.props.initialPoints + "",
    };

    private refPointsInput: NumericInput | null = null;
    private refPointsStringValue: string = "";

    private debouncePointsChange = _.debounce(() => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(
                this.state.points,
            );
        }
    }, 500);

    public render() {
        return (
            <div>
                <NumericInput
                    leftIcon={IconNames.ENDORSED}
                    allowNumericCharactersOnly={false}
                    buttonPosition="right"
                    disabled={this.props.disabled}
                    fill={false}
                    intent={Intent.NONE}
                    large={false}
                    majorStepSize={10}
                    max={this.props.maxUnitPoints}
                    min={this.props.minUnitPoints}
                    minorStepSize={0.01}
                    selectAllOnFocus={false}
                    selectAllOnIncrement={false}
                    stepSize={0.5}
                    value={this.state.tempPointsStringValue}
                    clampValueOnBlur={true}
                    placeholder="Point..."
                    size={5}
                    ref={(element) => { this.refPointsInput = element; }}
                    onValueChange={(valueAsNumber: number, valueAsString: string) => {
                        this.refPointsStringValue = valueAsString;
                        if (this.onPointsChange !== undefined) {
                            const refPoints = parseFloat(this.refPointsStringValue);
                            if (refPoints >= this.props.minUnitPoints &&
                                refPoints <= this.props.maxUnitPoints
                            ) {
                                this.onPointsChange(refPoints);
                                this.setState({
                                    tempPointsStringValue: valueAsString,
                                });
                            }
                        }
                    }}
                    onBlur={() => {
                        this.handlePointsChange();
                        if (this.props.onBlur !== undefined) {
                            this.props.onBlur();
                        }
                    }}
                    onFocus={() => {
                        if (this.props.onFocus !== undefined) {
                            this.props.onFocus();
                        }
                    }}
                />
            </div>
        );
    }

    private onPointsChange = (newPoints: number) => {
        this.setState({
            points: newPoints,
        });
        this.debouncePointsChange();
    }

    private handlePointsChange = () => {
        if (this.onPointsChange !== undefined) {
            const refPoints = parseFloat(this.refPointsStringValue);
            if (refPoints >= this.props.minUnitPoints &&
                refPoints <= this.props.maxUnitPoints
            ) {
                this.onPointsChange(refPoints);
                this.refPointsInput!.setState({
                    value: refPoints + "",
                });
            } else {
                this.refPointsInput!.setState({
                    value: this.props.initialPoints + "",
                });
            }
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
)(UnitItemPointsField);
