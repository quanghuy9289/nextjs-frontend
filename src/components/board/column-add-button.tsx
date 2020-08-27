/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Callout,
    Card,
    Classes,
    Colors,
    Dialog,
    EditableText,
    Elevation,
    H3,
    Icon,
    InputGroup,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    Position,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as dialogsActions from "../../store/dialogs/actions";
import Priority from "./priority";

const Container = styled.div`
    margin: 8px;
    padding-right: 10px;
    width: 335px;
    min-width: 325px;
    height: auto;
`;

interface IColumnState {

}

interface IPropsFromState {
    isOpenEditColumnTitleDialog?: boolean;
}

interface IPropsFromDispatch {
    openEditColumnTitleDialog: typeof dialogsActions.openEditColumnTitleDialog;
    openAddColumnDialog: typeof dialogsActions.openAddColumnDialog;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Column extends React.Component<AllProps> {
    public render() {
        return (
            <Container>
                <Button
                    active={true}
                    icon={IconNames.PLUS}
                    style={{
                        width: "100%",
                        height: "50px",
                    }}
                    onClick={() => this.props.openAddColumnDialog(true)}
                />
            </Container>
        );
    }

    // private handleTitleChange = (title: string) => {
    //     this.setState({title});
    // }

    // private handleTitleChange = (event: React.FormEvent<HTMLElement>) => {
    //     // return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
    //     this.setState({title: (event.target as HTMLInputElement).value});
    // }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ dialogs }: IApplicationState) => ({
    isOpenEditColumnTitleDialog: dialogs.isOpenEditColumnTitleDialog,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEditColumnTitleDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnTitleDialog(isOpen)),
    openAddColumnDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddColumnDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Column);
