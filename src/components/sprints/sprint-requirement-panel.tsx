/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    NumericInput,
    Popover,
    Position,
    Slider,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";
import { IActiveUserProfile } from "../../store/logins/types";
import * as projectsActions from "../../store/projects/actions";
import * as sprintrequirementsActions from "../../store/sprintrequirements/actions";
import { ISprintRequirement, ISprintRequirementUpdateMinUnitPointsInput } from "../../store/sprintrequirements/types";
import { ISprint } from "../../store/sprints/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { CONST_MAXIMUM_UNIT_POINTS_POSSIBLE } from "../../utils/constants";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "../board/unit-item-points-field";
import SprintRequirementItem from "./sprint-requirement-item";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface ISprintRequirementPanelState {

}

interface IPropsFromState {
    userMap: IStringTMap<IUser>;
    activeUserProfile: IActiveUserProfile;
    sprintRequirementBySprintIDAndUserIDMap: IStringTMap<ISprintRequirement>;
}

interface IPropsFromDispatch {
    updateSprintRequirementMinUnitPointsRequest:
    typeof sprintrequirementsActions.updateSprintRequirementMinUnitPointsRequest;
    getSprintRequirementRequestBySprintAndUser:
    typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
}

interface IOwnProps {
    sprint: ISprint;
    displayActiveOnly: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintRequirementPanel extends React.PureComponent<AllProps, ISprintRequirementPanelState> {
    public state: ISprintRequirementPanelState = {

    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // Load the sprint requirement of the users
        _.values(this.props.userMap).forEach((eachUser: IUser) => {
            const sprintRequirement: ISprintRequirement | undefined =
                this.props.sprintRequirementBySprintIDAndUserIDMap[
                combineIDs(this.props.sprint.id, eachUser.id)
                ];
            if (_.isUndefined(sprintRequirement)) {
                this.props.getSprintRequirementRequestBySprintAndUser(
                    this.props.sprint.id, eachUser.id,
                );
            }
        });
    }

    public render() {
        return (
            <Container>
                {
                    _.values(this.props.userMap).map((eachUser: IUser) => {
                        // Find the sprint requirement
                        const sprintRequirement: ISprintRequirement | undefined =
                            this.props.sprintRequirementBySprintIDAndUserIDMap[
                            combineIDs(this.props.sprint.id, eachUser.id)
                            ];
                        if (!this.props.displayActiveOnly ||
                            (sprintRequirement === undefined || sprintRequirement.minUnitPoints > 0)) {
                            return (
                                sprintRequirement === undefined ?
                                    <Button
                                        key={combineIDs(this.props.sprint.id, eachUser.id)}
                                        loading={true}
                                    /> :
                                    <SprintRequirementItem
                                        key={combineIDs(this.props.sprint.id, eachUser.id)}
                                        minUnitPoints={0}
                                        maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                                        removable={false}
                                        user={eachUser}
                                        disabled={
                                            eachUser.id !== this.props.activeUserProfile.id &&
                                            // <Move to authority when implemented>
                                            (
                                                this.props.activeUserProfile.email !== "andrew@cookingthebooks.com.au" &&
                                                this.props.activeUserProfile.email !== "jess@cookingthebooks.com.au" &&
                                                this.props.activeUserProfile.email !== "tom@cookingthebooks.com.au" &&
                                                this.props.activeUserProfile.email !== "mike@cookingthebooks.com.au"
                                            )
                                            // </Move to authority when implemented>
                                        }
                                        sprintRequirement={sprintRequirement}
                                        onPointsChange={this.onMinUnitPointsChange}
                                    />
                            );
                        } else {
                            return (null);
                        }
                    })
                }
            </Container>
        );
    }

    private onMinUnitPointsChange = (sprintRequirement: ISprintRequirement, newPoints: number) => {
        this.props.updateSprintRequirementMinUnitPointsRequest({
            minUnitPoints: newPoints,
            sprintID: sprintRequirement.sprintID,
            userID: sprintRequirement.userID,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users, board, logins }: IApplicationState) => ({
    userMap: users.userMap,
    sprintRequirementBySprintIDAndUserIDMap: board.sprintRequirementBySprintIDAndUserIDMap,
    activeUserProfile: logins.activeUserProfile,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateSprintRequirementMinUnitPointsRequest: (input: ISprintRequirementUpdateMinUnitPointsInput) =>
        dispatch(sprintrequirementsActions.updateSprintRequirementMinUnitPointsRequest(input)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintRequirementPanel);
