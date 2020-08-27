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
import { ISprintRequirement } from "../../store/sprintrequirements/types";
import { ISprint } from "../../store/sprints/types";
import * as tasksActions from "../../store/tasks/actions";
import { IUnit } from "../../store/units/types";
import { IUser } from "../../store/users/types";
import { CONST_ROUNDING_STANDARD_PRECISION } from "../../utils/constants";
import { getUserPresentationName } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "../board/unit-item-points-field";
import UnitItemTitleField from "../board/unit-item-title-field";
import UserSettingMenu from "../users/user-setting-menu";

const Container = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
`;

interface ISprintRequirementItemState {
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
    onPointsChange?: (sprintRequirement: ISprintRequirement, points: number) => void;
    removable: boolean;
    sprintRequirement: ISprintRequirement;
    minUnitPoints: number;
    maxUnitPoints: number;
    user: IUser;
    disabled?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintRequirementItem extends React.PureComponent<AllProps, ISprintRequirementItemState> {
    public state: ISprintRequirementItemState = {
        isEditing: false,
        tempPointsStringValue: this.props.sprintRequirement.minUnitPoints + "",
    };

    private refPointsInput: NumericInput | null = null;
    private refPointsStringValue: string = "";

    public render() {
        return (
            <Container>
                {/* <div>
                    Image here
                </div> */}
                <div
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <InputGroup
                        value={`   ` + getUserPresentationName(this.props.user)}
                        readOnly={true}
                        style={{
                            paddingRight: "15px",
                        }}
                        // disabled={true}
                        leftIcon={
                            <Button
                                active={true}
                                // minimal={true}
                                icon={
                                    <img
                                        src={this.props.user.avatarBase64}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            margin: "auto",
                                        }}
                                    />
                                }
                                // loading={_.isUndefined(this.props.user.avatarBase64)}
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
                            // this.onTitleChange(e.target.value);
                        }}
                    />
                </div>
                <UnitItemPointsField
                    initialPoints={this.props.sprintRequirement.minUnitPoints}
                    minUnitPoints={this.props.minUnitPoints}
                    maxUnitPoints={this.props.maxUnitPoints}
                    onChange={((newPoints: number) => {
                        if (this.props.onPointsChange !== undefined) {
                            this.props.onPointsChange(this.props.sprintRequirement, newPoints);
                        }
                    })}
                    onFocus={this.onEditBegin}
                    onBlur={this.onEditEnd}
                    disabled={this.props.disabled}
                />
                <div
                    style={{
                        width: "100px",
                    }}
                >
                    {/* <Tag
                        className={Classes.FILL}
                        style={{
                            width: "100%",
                        }}
                        large={true}
                    >
                        {this.props.sprint.name}
                    </Tag> */}
                    <Tag
                        intent={
                            this.props.sprintRequirement.totalCompletedPoints >=
                            this.props.sprintRequirement.minUnitPoints ?
                            this.props.sprintRequirement.minUnitPoints === 0 ? Intent.DANGER : Intent.SUCCESS :
                            Intent.WARNING
                        }
                        // round={true}
                        large={true}
                        className={`tag-score`}
                        style={{
                            width: "100%",
                        }}
                    >
                        {
                            `${_.round(
                                this.props.sprintRequirement.totalCompletedPoints,
                                CONST_ROUNDING_STANDARD_PRECISION)
                            }/` +
                            `${this.props.sprintRequirement.minUnitPoints}`
                        }
                    </Tag>
                </div>
                <Popover
                    disabled={this.props.disabled}
                    content={<UserSettingMenu user={this.props.user}/>}
                    position={Position.RIGHT}
                >
                    <Button
                        disabled={this.props.disabled}
                        icon={IconNames.COG}
                        minimal={true}
                    />
                </Popover>
            </Container>
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
                this.props.onPointsChange(this.props.sprintRequirement, refPoints);
                this.refPointsInput!.setState({
                    value: refPoints + "",
                });
            } else {
                this.refPointsInput!.setState({
                    value: this.props.sprintRequirement.minUnitPoints + "",
                });
            }
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintRequirementItem);
