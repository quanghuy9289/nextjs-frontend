/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Classes,
    Menu,
    MenuItem,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../../store";
import {
    IProject,
    IProjectDeleteInput,
    IProjectUpdateColorInput,
    IProjectUpdateUnitPointsRangeInput,
} from "../../store/projects/types";
import { CONST_MAXIMUM_UNIT_POINTS_POSSIBLE } from "../../utils/constants";
import UnitItemPointsField from "../board/unit-item-points-field";

interface ISprintRequirementListContextMenuState {
    isConfirmingDelete: boolean;
}

// Props passed from mapStateToProps
interface IPropsFromState {

}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {

}

// Component-specific props.
interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintRequirementListContextMenu extends React.PureComponent<AllProps, ISprintRequirementListContextMenuState> {
    public state: ISprintRequirementListContextMenuState = {
        isConfirmingDelete: false,
    };
    public render() {
        return (
            <Menu
                className={Classes.ELEVATION_1}
            >
                <MenuItem
                    text="Mimium unit points"
                    shouldDismissPopover={false}
                    icon={IconNames.ENDORSED}
                    labelElement={
                        <UnitItemPointsField
                            initialPoints={0}
                            minUnitPoints={0}
                            maxUnitPoints={100}
                            onChange={((newPoints: number) => {
                                if (this.onMinUnitPointsChange !== undefined) {
                                    this.onMinUnitPointsChange(newPoints);
                                }
                            })}
                        />
                    }
                />
            </Menu>
        );
    }

    private onMinUnitPointsChange = (newPoints: number) => {
        // To do
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ colors }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintRequirementListContextMenu);
