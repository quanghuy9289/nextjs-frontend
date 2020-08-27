/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Classes, Icon, Menu, MenuDivider, MenuItem, Switch } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PropTypes from "prop-types";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as loginsActions from "../../store/logins/actions";
import * as navbarActions from "../../store/navbar/actions";

// Props passed from mapStateToProps
interface IPropsFromState {

}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {

}

// Component-specific props.
interface IOwnProps {
    onRemoveClicked?: () => void;
    allowRemoveButton?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

// type UserImageContextMenuProps = {
//     enableDarkTheme: boolean,
//     onToggleDarkTheme: any
// }

class UserImageContextMenu extends React.PureComponent<AllProps> {
    public render() {
        return (
            <Menu>
                {/* <MenuItem icon="search-around" text="Search around..." />
                <MenuItem icon="search" text="Object viewer" /> */}
                {/* <MenuItem icon="remove" text="Remove" /> */}
                <MenuItem icon="chat" text="Message" disabled={true}/>
                <MenuItem icon={IconNames.PHONE} text="Audio call" disabled={true} />
                <MenuItem icon={IconNames.MOBILE_VIDEO} text="Video call" disabled={true}/>
                <MenuItem icon={IconNames.PEOPLE} text="Conference" disabled={true}/>
                {this.props.allowRemoveButton === undefined || this.props.allowRemoveButton === true ?
                    [
                        <MenuDivider key="Divider"/>,
                        <MenuItem
                            key="RemoveButton"
                            icon="remove"
                            text="Remove"
                            onClick={this.props.onRemoveClicked}
                        />,
                    ] : null
                }
                {/* <MenuItem icon="layout-hierarchy={true}" text="Role" />
                        <MenuDivider /> */}
                {/* <MenuItem disabled={true} text="Clicked on node" /> */}
            </Menu>
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
)(UserImageContextMenu);
