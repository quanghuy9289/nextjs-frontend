/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable max-classes-per-file

import classNames from "classnames";
import * as React from "react";
import styled from "styled-components";

import {
    Button,
    Classes,
    ContextMenu,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../store";

const Container = styled.div`
    padding: 5px;
    display: inline-block;
    text-align: center;
`;

interface IUserAvatarUploaderState {
    isContextMenuOpen: boolean;
    tempImageURL: string;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    name: string;
    doesDisplayName?: boolean;
    sizeInPx?: number;
    base64Image?: string;
    intent: Intent;
    onAvatarBase64Uploaded: (fileBase64: string) => void;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

/**
 * This component uses the imperative ContextMenu API.
 */
class UserAvatarUploader extends React.PureComponent<AllProps, IUserAvatarUploaderState> {
    public state = {
        isContextMenuOpen: false,
        tempImageURL: "",
    };
    private fileUploader: HTMLInputElement | null = null;
    private imgAvatarExtractor: HTMLImageElement | null = null;

    public render() {
        const classes = classNames(
            "user-context-menu-node",
            { "user-context-menu-open": this.state.isContextMenuOpen },
        );

        const doesDisplayName: boolean = this.props.doesDisplayName !== undefined ? this.props.doesDisplayName! : true ;
        const sizeInPx: number = this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80 ;
        return (
            <Container>
                <input
                    type="file"
                    ref={(el) => this.fileUploader = el}
                    style={{display: "none"}}
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {this.handlePastedFiles(e.target.files); }}
                />
                <img
                    ref={(el) => this.imgAvatarExtractor = el}
                    src={this.state.tempImageURL}
                    crossOrigin="anonymous"
                    style={{display: "none"}}
                />

                {this.props.base64Image ?
                    (
                        <div
                            className={classes}
                            onClick={this.showContextMenu}
                            onContextMenu={this.showContextMenu}
                            style={{
                                width: `${sizeInPx}px`,
                                height: `${sizeInPx}px`,
                                border: `${sizeInPx / 20}px solid #fff`,
                                display: "flex",
                                backgroundColor: "white",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            <img
                                style={{
                                    // width: "auto",
                                    // height: "100%",
                                    maxWidth: "100%",
                                    // maxHeight: "100%",
                                    margin: "auto",
                                }}
                                src={this.props.base64Image}
                            />
                        </div>
                    ) :
                    (
                        <div
                            onClick={this.showContextMenu}
                            style={{
                                width: `${sizeInPx}px`,
                                height: `${sizeInPx}px`,
                                overflow: "visible",
                            }}
                        >
                            <Button
                                active={true}
                                icon={IconNames.MEDIA}
                                intent={this.props.intent}
                                style={{
                                    borderRadius: "50%",
                                    height: "100%",
                                    width: "100%",
                                }}
                            />
                        </div>
                    )
                }
                {doesDisplayName ?
                    (
                    <div
                        className={Classes.TEXT_MUTED}
                        style={{
                            width: `${sizeInPx}px`,
                            height: "20px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.8em",
                        }}
                    >
                        {this.props.name}
                    </div>
                    ) :
                    null
                }
            </Container>
        );
    }

    public getBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            resolve(reader.result!);
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
        });
    }

    public getBase64FromImage = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        return dataURL;
        // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    public handlePastedFiles = (files) => {
        // this part puts the file as an image in the editor
        if (files.length > 0) {
            let fileBase64 = "";
            this.getBase64(files[0]).then((result) => {
                fileBase64 = result as string;
                this.props.onAvatarBase64Uploaded(fileBase64);
            });
        }
    }

    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                <MenuItem
                    icon={IconNames.UPLOAD}
                    text="Upload from computer"
                    onClick={this.onClickUploadFromComputer}
                />
                {/* <MenuItem
                    icon={IconNames.LINK}
                    text="Paste from URL"
                    onClick={this.showAvatarURLInputContextMenu}
                /> */}
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ ...this.state, isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ ...this.state, isContextMenuOpen: true });
    }

    private showAvatarURLInputContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                <InputGroup
                    // value={this.state.tempImageURL}
                    placeholder="Paste URL here..."
                    onChange={this.onChangeAvatarURL}
                />
                <Button
                    text="Ok"
                    onClick={() => {
                        const fileBase64 = this.getBase64FromImage(this.imgAvatarExtractor!);
                        this.props.onAvatarBase64Uploaded(fileBase64);
                    }}
                />
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ ...this.state, isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ ...this.state, isContextMenuOpen: true });
    }

    private onClickUploadFromComputer = (e) => {
        if (this.fileUploader != null) {
            this.fileUploader!.click();
        }
    }

    private onChangeAvatarURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, tempImageURL: e.target.value});
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserAvatarUploader);
