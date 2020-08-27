/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Classes,
    Menu,
    MenuDivider,
    MenuItem,
    Switch,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import * as dialogsActions from "../../store/dialogs/actions";
import * as loginsActions from "../../store/logins/actions";
import * as navbarActions from "../../store/navbar/actions";
import { IProject } from "../../store/projects/types";

// Props passed from mapStateToProps
interface IPropsFromState {
    isUsingDarkTheme: boolean;
    userLoading: boolean;
    currentProject: IProject;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    enableDarkTheme: typeof navbarActions.enableDarkTheme;
    logout: typeof loginsActions.logout;
    openSprintRequirementDialog: typeof dialogsActions.openSprintRequirementDialog;
}

// Component-specific props.
interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

// type UserSettingMenuProps = {
//     enableDarkTheme: boolean,
//     onToggleDarkTheme: any
// }

class UserSettingMenu extends React.PureComponent<AllProps> {
    public render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <MenuDivider title="Theme" />
                <MenuItem
                    icon="style"
                    text="Dark theme"
                    shouldDismissPopover={false}
                    labelElement={
                        <Switch
                            large={true}
                            checked={this.props.isUsingDarkTheme}
                            alignIndicator={Alignment.RIGHT}
                            onChange={this.onToggleDarkTheme}
                        />
                    }
                />
                <MenuDivider title="User" />
                <MenuItem
                    icon={IconNames.USER}
                    text="Profile"
                    disabled={true}
                    shouldDismissPopover={true}
                />
                <MenuItem
                    icon={IconNames.CONFIRM}
                    text="Sprint requirement"
                    shouldDismissPopover={true}
                    disabled={this.props.userLoading || _.isEmpty(this.props.currentProject.id)}
                    onClick={this.handleOpenSprintRequirementDialog}
                />
                <MenuItem
                    icon={IconNames.LOG_OUT}
                    text="Logout"
                    shouldDismissPopover={true}
                    onClick={this.handleLogout}
                />
                {/* <MenuDivider title="Edit" />
                <MenuItem icon="cut" text="Cut" label="⌘X" />
                <MenuItem icon="duplicate" text="Copy" label="⌘C" />
                <MenuItem icon="clipboard" text="Paste" label="⌘V" disabled={true} />
                <MenuDivider title="Text" />
                <MenuItem disabled={true} icon="align-left" text="Alignment">
                    <MenuItem icon="align-left" text="Left" />
                    <MenuItem icon="align-center" text="Center" />
                    <MenuItem icon="align-right" text="Right" />
                    <MenuItem icon="align-justify" text="Justify" />
                </MenuItem>
                <MenuItem icon="style" text="Style">
                    <MenuItem icon="bold" text="Bold" />
                    <MenuItem icon="italic" text="Italic" />
                    <MenuItem icon="underline" text="Underline" />
                </MenuItem>
                <MenuItem icon="asterisk" text="Miscellaneous">
                    <MenuItem icon="badge" text="Badge" />
                    <MenuItem icon="book" text="Long items will truncate when they reach max-width" />
                    <MenuItem icon="more" text="Look in here for even more items">
                        <MenuItem icon="briefcase" text="Briefcase" />
                        <MenuItem icon="calculator" text="Calculator" />
                        <MenuItem icon="dollar" text="Dollar" />
                        <MenuItem icon="dot" text="Shapes">
                            <MenuItem icon="full-circle" text="Full circle" />
                            <MenuItem icon="heart" text="Heart" />
                            <MenuItem icon="ring" text="Ring" />
                            <MenuItem icon="square" text="Square" />
                        </MenuItem>
                    </MenuItem>
                </MenuItem> */}
            </Menu>
        );
    }

    public onToggleDarkTheme = () => {
        this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
    }

    private handleLogout = () => {
        this.props.logout();
    }

    private handleOpenSprintRequirementDialog = () => {
        this.props.openSprintRequirementDialog(true);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
// const mapStateToProps = ({ navbar, users, board}: IApplicationState) => ({
//     isUsingDarkTheme: navbar.isUsingDarkTheme,
//     userLoading: users.loading,
//     currentProject: board.project,
// });

// // Mapping our action dispatcher to props is especially useful when creating container components.
// const mapDispatchToProps = (dispatch: Dispatch) => ({
//     enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
//     logout: () => dispatch(loginsActions.logout()),
//     openSprintRequirementDialog: (isOpen: boolean) =>
//         dispatch(dialogsActions.openSprintRequirementDialog(isOpen)),
// });

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(UserSettingMenu);

export default UserSettingMenu;
