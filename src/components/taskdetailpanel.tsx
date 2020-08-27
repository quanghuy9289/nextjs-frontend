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
    IPanelProps,
    Popover,
    Position,
    Slider,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import TaskDetailPanelSelectColumnContextMenu from "../components/context-menus/taskdetailpanelselectcolumn";
import TaskDetailPanelSelectPriorityContextMenu from "../components/context-menus/taskdetailpanelselectpriority";
import { IApplicationState } from "../store";
import { IColumn } from "../store/columns/types";
import * as navbarActions from "../store/navbar/actions";
import { IPriority } from "../store/priorities/types";
import { ITask } from "../store/tasks/types";
import { IStringTMap } from "../utils/types";
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

interface ITaskDetailState {
    value1: number;
    value2: number;
    value3: number;
}

interface IPropsFromState {
    columnMap: IStringTMap<IColumn>;
    priorityMap: IStringTMap<IPriority>;
}

interface IPropsFromDispatch {

}

interface IOwnProps {
    columnID: string;
    priorityID: string;
    task?: ITask;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskDetailPanel extends React.PureComponent<AllProps & IPanelProps, ITaskDetailState> {
    public state: ITaskDetailState = {
        value1: 5,
        value2: 7,
        value3: 7,
    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        const priority: IPriority | undefined = this.props.priorityMap[this.props.priorityID];
        const column: IColumn | undefined = this.props.columnMap[this.props.columnID];

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
                            value={this.props.task ? this.props.task.title : ""}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                            placeholder="Task title..."
                        // onChange={this.handleTitleChange}
                        />
                    </H1>
                    {/* <InputGroup
                        disabled={false}
                        large={true}
                        // leftIcon="filter"
                        // onChange={this.handleTitleChange}
                        placeholder="Task title..."
                        // rightElement={maybeSpinner}
                        // small={small}
                        value="Doing something"
                    /> */}
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Members"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <UserImage name="Tom" />
                    <UserImage name="Sam" />
                    <UserImage name="Tuan" />
                    <UserImage name="Trung" />
                    <UserImage name="Jess" />
                    <UserImage name="Andrew" />
                    <UserImage name="Mike" />
                    <UserAddButton
                        onSelectUser={() => {
                            // To do
                        }}
                        usePortal={false}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Managers"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <UserImage name="Jess" />
                    <UserImage name="Andrew" />
                    <UserImage name="Tom" />
                    <UserAddButton
                        onSelectUser={() => {
                            // To do
                        }}
                        usePortal={false}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Column"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <Popover
                        captureDismiss={true}
                        content={<TaskDetailPanelSelectColumnContextMenu
                            onSelectColumn={() => { return; }}
                        />}
                        position={Position.RIGHT_BOTTOM}
                    >
                        <Button
                            rightIcon={IconNames.CHEVRON_RIGHT}
                            text={column ? column.title : "Select column..."}
                        />
                    </Popover>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Priority"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <Popover
                        captureDismiss={true}
                        content={<TaskDetailPanelSelectPriorityContextMenu
                            onSelectPriority={() => { return; }}
                        />}
                        position={Position.RIGHT_BOTTOM}
                    >
                        <Button
                            rightIcon={IconNames.CHEVRON_RIGHT}
                            text={priority ? priority.title : "Select priority..."}
                        />
                    </Popover>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Technical value"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <SliderContainer>
                        <Slider
                            min={0}
                            max={10}
                            stepSize={1}
                            labelStepSize={10}
                            onChange={this.getChangeHandler1()}
                            value={this.state.value1}
                            vertical={false}
                            labelRenderer={this.renderLabel1}
                        />
                    </SliderContainer>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Business value"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <SliderContainer>
                        <Slider
                            min={0}
                            max={20}
                            stepSize={1}
                            labelStepSize={10}
                            onChange={this.getChangeHandler2()}
                            value={this.state.value2}
                            vertical={false}
                            labelRenderer={this.renderLabel2}
                        />
                    </SliderContainer>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Customer value"
                    labelFor="text-input"
                // labelInfo="(required)"
                >
                    <SliderContainer>
                        <Slider
                            min={-10}
                            max={10}
                            stepSize={1}
                            labelStepSize={10}
                            onChange={this.getChangeHandler3()}
                            value={this.state.value3}
                            vertical={false}
                            labelRenderer={this.renderLabel3}
                        />
                    </SliderContainer>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Description"
                    labelFor="text-input"
                    // labelInfo="(optional)"
                    className="fg-editor-task-description"
                >
                    <RippleEditor />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Comment"
                    labelFor="text-input"
                    className="fg-editor-task-comment"
                // labelInfo="(required)"
                >
                    <RippleEditor />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Comment 2"
                    labelFor="text-input"
                    className="fg-editor-task-comment"
                // labelInfo="(required)"
                >
                    <RippleEditor />
                </FormGroup>
            </Container>
        );
    }

    private getChangeHandler1() {
        return (value: number) => this.setState({ value1: value });
    }

    private getChangeHandler2() {
        return (value: number) => this.setState({ value2: value });
    }

    private getChangeHandler3() {
        return (value: number) => this.setState({ value3: value });
    }

    private renderLabel1(val: number) {
        return `${val}`;
    }

    private renderLabel2(val: number) {
        // return `${Math.round(val * 100)}%`;
        return `${val}`;
    }

    private renderLabel3(val: number) {
        // return val === 0 ? `£${val}` : `£${val},000`;
        return `${val}`;
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board }: IApplicationState) => ({
    columnMap: board.columnMap,
    priorityMap: board.priorityMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskDetailPanel);
