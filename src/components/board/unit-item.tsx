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
import { IUser } from "../../store/users/types";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "./unit-item-points-field";
import UnitItemTitleField from "./unit-item-title-field";

const Container = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
`;

interface IUnitItemState {
    isEditing: boolean;
    tempPointsStringValue: string;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    large?: boolean;
    checked?: boolean;
    title?: string;
    alignIndicator?: Alignment;
    onChange?: (unit: IUnit, newValue: string) => void;
    onOrderChange?: (unit: IUnit, isUp: boolean) => void;
    onPointsChange?: (unit: IUnit, points: number) => void;
    onRemove: (unit: IUnit) => void;
    onUnitCompleted?: (unit: IUnit, completed: boolean) => void;
    removable: boolean;
    index: number;
    unit: IUnit;
    sprint: ISprint;
    minUnitPoints: number;
    maxUnitPoints: number;
    userMap: IStringTMap<IUser>;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class UnitItem extends React.PureComponent<AllProps, IUnitItemState> {
    public state: IUnitItemState = {
        isEditing: false,
        tempPointsStringValue: this.props.unit.points + "",
    };

    private refPointsInput: NumericInput | null = null;
    private refPointsStringValue: string = "";

    public render() {
        return (
            <Container>
                <div>
                    <NumericInput
                        className="hide-numeric-input-group"
                        allowNumericCharactersOnly={true}
                        buttonPosition="right"
                        disabled={false}
                        fill={false}
                        intent={Intent.NONE}
                        large={false}
                        majorStepSize={10}
                        max={100}
                        min={-100}
                        minorStepSize={0.1}
                        selectAllOnFocus={false}
                        selectAllOnIncrement={false}
                        stepSize={1}
                        value={this.props.index + 1}
                        placeholder="Index..."
                        onValueChange={(valueAsNumber: number) => {
                            if (this.props.onOrderChange !== undefined) {
                                this.props.onOrderChange(this.props.unit, (this.props.index - valueAsNumber) < 0);
                            }
                        }}
                    />
                </div>
                <UnitItemTitleField
                    alignIndicator={this.props.alignIndicator}
                    large={this.props.large}
                    checked={
                        _.isUndefined(this.props.unit.completedByUserID) ||
                        _.isEmpty(this.props.unit.completedByUserID) ?
                        false : true
                    }
                    userChecked={this.props.userMap[this.props.unit.completedByUserID]}
                    initialTitle={this.props.title}
                    onChange={(newValue: string) => {
                        if (this.props.onChange !== undefined) {
                            this.props.onChange(this.props.unit, newValue);
                        }
                    }}
                    onComplete={(completed: boolean) => {
                        if (this.props.onUnitCompleted !== undefined) {
                            this.props.onUnitCompleted(this.props.unit, completed);
                        }
                    }}
                    onFocus={this.onEditBegin}
                    onBlur={this.onEditEnd}
                />
                <UnitItemPointsField
                    initialPoints={this.props.unit.points}
                    minUnitPoints={this.props.minUnitPoints}
                    maxUnitPoints={this.props.maxUnitPoints}
                    onChange={((newPoints: number) => {
                        if (this.props.onPointsChange !== undefined) {
                            this.props.onPointsChange(this.props.unit, newPoints);
                        }
                    })}
                    onFocus={this.onEditBegin}
                    onBlur={this.onEditEnd}
                />
                {/* <div>
                    <NumericInput
                        leftIcon={IconNames.ENDORSED}
                        allowNumericCharactersOnly={false}
                        buttonPosition="right"
                        disabled={false}
                        fill={false}
                        intent={Intent.NONE}
                        large={false}
                        majorStepSize={10}
                        max={100}
                        min={0.5}
                        minorStepSize={0.1}
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
                            if (this.props.onPointsChange !== undefined) {
                                const refPoints = parseFloat(this.refPointsStringValue);
                                if (refPoints > 0 &&
                                    refPoints <= 100
                                ) {
                                    this.props.onPointsChange(this.props.unit, refPoints);
                                    this.setState({
                                        tempPointsStringValue: valueAsString,
                                    });
                                }
                            }
                        }}
                        onBlur={() => {
                            this.handlePointsChange();
                        }}
                    />
                </div> */}
                <div
                    style={{
                        width: "100px",
                    }}
                >
                    <Tag
                        className={Classes.FILL}
                        style={{
                            width: "100%",
                        }}
                        large={true}
                        onRemove={
                            this.props.removable && !this.state.isEditing ?
                            (e) => {
                                this.props.onRemove(this.props.unit);
                            } :
                            undefined
                        }
                    >
                        {this.props.sprint.name}
                    </Tag>
                </div>
                {/* <div
                    onClick={this.handleEditTitle}
                    style={{
                        flexGrow: 1,
                        paddingLeft: "0px",
                    }}
                    className={Classes.CONTROL}
                >
                    <EditableText
                        value={this.props.title}
                        placeholder={"Type your unit title..."}
                        isEditing={this.state.isEditing}
                        onConfirm={this.handleStopEditTitle}
                        onChange={this.props.onChange}
                        multiline={false}
                    />
                </div> */}
            </Container>
            // <Checkbox
            //     large={this.props.large}
            //     checked={this.props.checked}
            //     label={this.props.label}
            //     alignIndicator={this.props.alignIndicator}
            // />
            // <Navbar>
            //     <NavbarGroup
            //         align={Alignment.LEFT}
            //         style={{
            //             overflow: "hidden",
            //             whiteSpace: "nowrap",
            //         }}
            //     >
            //         <Checkbox
            //             large={this.props.large}
            //             checked={this.props.checked}
            //             // labelElement={
            //             //     // <EditableText
            //             //     //     value={this.props.title}
            //             //     //     placeholder={"Type your unit title..."}
            //             //     // />
            //             //     <span contentEditable={true}>
            //             //         {this.props.title}
            //             //     </span>}
            //             alignIndicator={this.props.alignIndicator}
            //         />
            //         <div
            //             onClick={this.handleEditTitle}
            //         >
            //             <EditableText
            //                 value={this.props.title}
            //                 placeholder={"Type your unit title..."}
            //                 isEditing={this.state.isEditing}
            //                 onConfirm={this.handleStopEditTitle}
            //                 onChange={this.props.onChange}
            //                 multiline={true}
            //             />
            //         </div>
            //     </NavbarGroup>
            //     {/* <NavbarGroup
            //         align={Alignment.RIGHT}
            //     >
            //         <Icon
            //             icon={IconNames.DRAG_HANDLE_VERTICAL}
            //             iconSize={Icon.SIZE_LARGE}
            //             intent={Intent.PRIMARY}
            //         />
            //     </NavbarGroup> */}
            // </Navbar>
        );
    }

    private onEditBegin = () => {
        this.setState({
            isEditing: true,
        });
    }

    private onEditEnd = () => {
        this.setState({
            isEditing: false,
        });
    }

    private handlePointsChange = () => {
        if (this.props.onPointsChange !== undefined) {
            const refPoints = parseFloat(this.refPointsStringValue);
            if (refPoints > 0 &&
                refPoints <= 100
            ) {
                this.props.onPointsChange(this.props.unit, refPoints);
                this.refPointsInput!.setState({
                    value: refPoints + "",
                });
            } else {
                this.refPointsInput!.setState({
                    value: this.props.unit.points + "",
                });
            }
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({
    userMap: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnitItem);
