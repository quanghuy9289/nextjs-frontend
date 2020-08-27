/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    EditableText,
    FormGroup,
    H1,
    InputGroup,
    Popover,
    Position,
    Slider,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import ColumnDetailPanelSelectColumnContextMenu from "../components/context-menus/taskdetailpanelselectcolumn";
import ColumnDetailPanelSelectPriorityContextMenu from "../components/context-menus/taskdetailpanelselectpriority";
import { IApplicationState } from "../store";
import * as navbarActions from "../store/navbar/actions";
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

const SliderContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

interface IColumnDetailState {

}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    column?: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ColumnDetailPanel extends React.PureComponent<AllProps, IColumnDetailState> {
    public state: IColumnDetailState = {

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
                            value={this.props.column ? this.props.column.title : ""}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                            placeholder="Column title..."
                        // onChange={this.handleTitleChange}
                        />
                    </H1>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Column managers"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <UserImage name="Sam" />
                    <UserImage name="Jess" />
                    <UserImage name="Andrew" />
                    <UserAddButton
                        onSelectUser={() => {
                            // To do
                        }}
                        usePortal={false}
                    />
                </FormGroup>
            </Container>
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ColumnDetailPanel);
