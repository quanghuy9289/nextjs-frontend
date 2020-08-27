/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    InputGroup,
    Menu,
    MenuItem,
    Popover,
    Position,
    Slider,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import { IColorsState, IStandardColor, IStandardColorGroup } from "../store/colors/types";
import * as navbarActions from "../store/navbar/actions";
import ColorsContextMenu from "./colors/colors-context-menu";
import RippleEditor from "./editor";
import UserAddButton from "./useraddbutton";
import UserImage from "./userimage";

const Container = styled.div`
    // display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface IPriorityDetailState {

}

interface IPropsFromState {
    colorgroups: IStandardColorGroup[];
}

interface IPropsFromDispatch {

}

interface IOwnProps {
    priority?: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class PriorityDetailPanel extends React.PureComponent<AllProps, IPriorityDetailState> {
    public state: IPriorityDetailState = {

    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        return (
            <Container>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Title"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <H1>
                        <EditableText
                            multiline={false}
                            minLines={1}
                            maxLines={1}
                            value={this.props.priority ? this.props.priority.title : ""}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                            placeholder="Priority title..."
                        // onChange={this.handleTitleChange}
                        />
                    </H1>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Color code"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <Button
                        rightIcon={IconNames.TINT}
                        text="Color"
                        onClick={(e) => this.showContextMenu(e)}
                    />
                </FormGroup>
            </Container>
        );
    }

    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <ColorsContextMenu
                colorgroups={this.props.colorgroups}
                onSelectColor={(selectedColor: IStandardColor) => {
                    // To do
                }}
            />,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
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

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PriorityDetailPanel);
