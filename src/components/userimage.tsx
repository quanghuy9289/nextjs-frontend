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
    ContextMenuTarget,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    Position,
    Spinner,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../store";
import * as componentsAction from "../store/components/actions";
import { IComponentUserImageState } from "../store/components/types";
import { CONST_DEFAULT_COMPONENT_ID } from "../utils/constants";
import { generateUUID } from "../utils/strings";
import { IStringTMap } from "../utils/types";
import UserImageContextMenu from "./context-menus/user-image-context-menu";

const Container = styled.div`
    padding: 5px;
    display: inline-block;
    text-align: center;
`;

interface IUserImageState {
    isContextMenuOpen: boolean;
}

interface IPropsFromState {
    // userImagesMap: IStringTMap<IComponentUserImageState>;
}

interface IPropsFromDispatch {
    // addUserImageState: typeof componentsAction.addUserImageState;
    // setUserImageState: typeof componentsAction.setUserImageState;
    // removeUserImageState: typeof componentsAction.removeUserImageState;
}

interface IOwnProps {
    name: string;
    doesDisplayName?: boolean;
    sizeInPx?: number;
    imgSource?: string;
    borderRatio?: number;
    allowContextMenu?: boolean;
    userID?: string;
    displayTooltip?: boolean;
    tooltipPosition?: Position;
    allowRemoveButton?: boolean;
    onRemoveUser?: (userID: string) => void;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

/**
 * This component uses the imperative ContextMenu API.
 */
class UserImage extends React.PureComponent<AllProps, IUserImageState> {
    public state = {
        isContextMenuOpen: false,
        // imgURL: `https://loremflickr.com/` +
        //     `${this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80}/` +
        //     `${this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80 }?random=${Math.random()}`,
    };

    public componentID: string = generateUUID();

    constructor(props) {
        super(props);
        // this.props.addUserImageState(this.componentID,
        //     {
        //         isContextMenuOpen: false,
        //         imgURL: `https://loremflickr.com/` +
        //             `${this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80}/` +
        //             `${this.props.sizeInPx !== undefined ? this.props.sizeInPx! : 80 }?random=${Math.random()}`,
        //     },
        // );
    }

    public componentWillUnmount() {
        // this.props.removeUserImageState(this.componentID);
    }

    // public shouldComponentUpdate(nextProps: Readonly<AllProps>) {
    //     // if (nextProps.name === this.props.name) {
    //     //     return false;
    //     // }
    //     // return true;
    //     if (isEqual(this.props, nextProps)) {
    //         return false;
    //     }
    //     return true;
    // }

    // public componentDidUpdate() {
    //     console.log("componentDidUpdate", this.props.name);
    // }

    public render() {
        // let state: IComponentUserImageState = this.props.userImagesMap[this.componentID];
        // if (state === undefined) {
        //     state = this.props.userImagesMap[CONST_DEFAULT_COMPONENT_ID];
        // }
        const classes = classNames(
            "user-context-menu-node",
            { "user-context-menu-open": this.state.isContextMenuOpen },
        );
        // return <div
        //     className={classes}
        //     onContextMenu={this.showContextMenu}
        // >
        //     <img src={imgURL}/>
        // </div>;

        const doesDisplayName: boolean = this.props.doesDisplayName !== undefined ?
            this.props.doesDisplayName! : true ;
        const sizeInPx: number = this.props.sizeInPx !== undefined ?
            this.props.sizeInPx! : 80 ;
        const borderRatio: number = this.props.borderRatio !== undefined ?
            this.props.borderRatio! : 20;
        const displayTooltip: boolean = this.props.displayTooltip !== undefined ?
            this.props.displayTooltip! : false ;
        const tooltipPosition: Position = this.props.tooltipPosition !== undefined ?
            this.props.tooltipPosition! : Position.TOP ;
        return (
            <Container
                style={{
                    width: `${sizeInPx + 10}px`,
                    height: `${sizeInPx + 10}px`,   // This is to fix a bug which causing the
                                                    // height of the container greater than the width
                }}
            >
                <Tooltip
                    disabled={!displayTooltip}
                    position={tooltipPosition}
                    content={this.props.name}
                >
                    <Popover
                        content={
                            <UserImageContextMenu
                                allowRemoveButton={this.props.allowRemoveButton}
                                onRemoveClicked={this.handleRemoveClicked}
                            />
                        }
                        position={Position.RIGHT_TOP}
                        // onOpened={this.onContextMenuOpened}
                        // onClosed={this.onContextMenuClosed}
                        onInteraction={
                            (nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => {
                                if (nextOpenState === false) {
                                    this.setState({
                                        isContextMenuOpen: nextOpenState,
                                    });
                                }
                            }
                        }
                        isOpen={this.state.isContextMenuOpen}
                    >
                        {/* <div
                            className={classes}
                            onClick={this.showContextMenu}
                            onContextMenu={this.showContextMenu}
                            style={{
                                width: `${sizeInPx}px`,
                                height: `${sizeInPx}px`,
                                border: `${sizeInPx / borderRatio}px solid #ffffff`,
                                borderColor: _.isUndefined(this.props.imgSource) ? "#202b33" : "#ffffff",
                                display: "flex",
                                backgroundColor: _.isUndefined(this.props.imgSource) ? "inherit" : "#ffffff",
                                justifyContent: "center",
                            }}
                        > */}
                            <Button
                                onClick={this.showContextMenu}
                                onContextMenu={this.showContextMenu}
                                active={true}
                                // icon={IconNames.PLUS}
                                icon={
                                    <img
                                        src={this.props.imgSource}
                                        style={{
                                            // width: `${sizeInPx - (sizeInPx / borderRatio)}px`,
                                            // height: `auto`,
                                            maxWidth: "100%",
                                            // maxHeight: "100%",
                                            margin: "auto",
                                        }}
                                    />
                                }
                                loading={_.isUndefined(this.props.imgSource)}
                                style={{
                                    width: `${sizeInPx}px`,
                                    height: `${sizeInPx}px`,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    padding: "0px",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            />
                        {/* </div> */}
                    </Popover>
                </Tooltip>
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

    private showContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();

        if (this.props.allowContextMenu !== false) {
            this.setState({
                isContextMenuOpen: !this.state.isContextMenuOpen,
            });

            // // invoke static API, getting coordinates from mouse event
            // ContextMenu.show(
            //     <Menu>
            //         {/* <MenuItem icon="search-around" text="Search around..." />
            //         <MenuItem icon="search" text="Object viewer" /> */}
            //         {/* <MenuItem icon="remove" text="Remove" /> */}
            //         <MenuItem icon="chat" text="Message" disabled={true}/>
            //         <MenuItem icon={IconNames.PHONE} text="Audio call" disabled={true} />
            //         <MenuItem icon={IconNames.MOBILE_VIDEO} text="Video call" disabled={true}/>
            //         <MenuItem icon={IconNames.PEOPLE} text="Conference" disabled={true}/>
            //         <MenuDivider />
            //         {/* <MenuItem icon="layout-hierarchy={true}" text="Role" />
            //         <MenuDivider /> */}
            //         <MenuItem
            //             icon="remove"
            //             text="Remove"
            //             onClick={this.handleRemoveClicked}
            //         />
            //         {/* <MenuItem disabled={true} text="Clicked on node" /> */}
            //     </Menu>,
            //     { left: e.clientX, top: e.clientY },
            //     () => {
            //         // this.props.setUserImageState(this.componentID,
            //         //     {
            //         //         isContextMenuOpen: false,
            //         //     },
            //         // );
            //     },
            // );
            // // indicate that context menu is open so we can add a CSS class to this element
            // // this.setState({ isContextMenuOpen: true });
            // // this.props.setUserImageState(this.componentID,
            // //     {
            // //         isContextMenuOpen: true,
            // //     },
            // // );
        }
    }

    // private onContextMenuOpened = () => {
    //     this.setState({
    //         isContextMenuOpen: true,
    //     });
    // }

    // private onContextMenuClosed = () => {
    //     this.setState({
    //         isContextMenuOpen: false,
    //     });
    // }

    private handleRemoveClicked = () => {
        if (this.props.onRemoveUser !== undefined && this.props.userID !== undefined) {
            this.props.onRemoveUser(this.props.userID);
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ }: IApplicationState) => ({
    // userImagesMap: components.userImagesMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    // addUserImageState: (componentID: string, userImageState: IComponentUserImageState) =>
    //     dispatch(componentsAction.addUserImageState(componentID, userImageState)),
    // setUserImageState: (componentID: string, userImageState: IComponentUserImageState) =>
    //     dispatch(componentsAction.setUserImageState(componentID, userImageState)),
    // removeUserImageState: (userID: string) =>
    //     dispatch(componentsAction.removeUserImageState(userID)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserImage);
