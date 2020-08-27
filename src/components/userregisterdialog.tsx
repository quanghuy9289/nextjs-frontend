/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    Classes,
    Dialog,
    Intent,
    Position,
    Slider,
    Spinner,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React, { FormEvent } from "react";
import { Cookies } from "react-cookie";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import { IStandardColorGroup } from "../store/colors/types";
import * as dialogsActions from "../store/dialogs/actions";
import * as loginsActions from "../store/logins/actions";
import {
    IRegistrationInput,
    IRegistrationResult,
    IRegistrationValidation,
} from "../store/logins/types";
import * as rolesActions from "../store/roles/actions";
import { IRole } from "../store/roles/types";
import { validateEmail } from "../utils/validator";
import { roleSelectProps, TOP_100_ROLES } from "./roles/role-select-item";
import UserAvatarUploader from "./useravataruploader";
import UserRegisterPanel from "./userregisterpanel";

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

const RoleSelect = Select.ofType<IRole>();

interface IPriorityDetailState {

}

interface IPropsFromState {
    registrationLoading: boolean;
    registrationValidation: IRegistrationValidation;
    registrationInput: IRegistrationInput;
    registrationResult: IRegistrationResult;
}

interface IPropsFromDispatch {
    openLoginDialog: typeof dialogsActions.openLoginDialog;
    openRegisterDialog: typeof dialogsActions.openRegisterDialog;
    registerRequest: typeof loginsActions.registerRequest;
    registerResult: typeof loginsActions.registerResult;
    setRegistrationValidation: typeof loginsActions.setRegistrationValidation;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class RegisterDetailDialog extends React.PureComponent<AllProps, IPriorityDetailState> {
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        // const {role} = this.state;
        return (
            <Dialog
                icon={IconNames.USER}
                onClose={this.handleCloseDialog}
                title="Registration"
                isOpen={this.props.isOpen}
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                isCloseButtonShown={false}
                style={{
                    width: "80%",
                    maxWidth: "500px",
                }}
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.props.registrationResult.id ?
                        (<Callout
                            title={"Completed"}
                            icon={IconNames.TICK}
                            intent={Intent.SUCCESS}
                        >
                            Your account has been registered successfully.
                            Please login to continue.
                        </Callout>) :
                        <UserRegisterPanel />
                    }
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Back to login"
                        >
                            <Button
                                onClick={this.handleBackToLoginClicked}
                            // disabled={this.props.isLoginLoading}
                            >
                                Login
                            </Button>
                        </Tooltip>
                        {this.props.registrationResult.id ?
                            (<div />) :
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Register your account"
                            >
                                <Button
                                    intent={Intent.PRIMARY}
                                    onClick={this.handleRegister}
                                    loading={this.props.registrationLoading}
                                // rightIcon={this.props.isLoginLoading ? spinner : undefined}
                                // disabled={this.props.isLoginLoading}
                                >
                                    Register
                                </Button>
                            </Tooltip>
                        }
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        // To do
    }

    private handleBackToLoginClicked = () => {
        this.props.openRegisterDialog(false);
        this.props.openLoginDialog(true);
    }

    private handleRegister = () => {
        if (this.validateInputs()) {
            this.props.registerRequest(this.props.registrationInput);
        }
    }

    private validateInputs = () => {
        // let isValid = true;
        // const isEmailValid = validateEmail(this.props.registrationInput.email);
        // if (!isEmailValid) { isValid = false; }

        // const isEmailVerificationCodeProvided = !_.isEmpty(this.props.registrationInput.emailverificationcode);
        // if (!isEmailVerificationCodeProvided) { isValid = false; }

        // const isPasswordLengthValid = !_.isEmpty(this.props.registrationInput.password);
        // if (!isPasswordLengthValid) { isValid = false; }

        // const isPasswordMatched = _.isEqual(
        //     this.props.registrationInput.password,
        //     this.props.registrationInput.retypepassword,
        // );
        // if (!isPasswordMatched) { isValid = false; }

        const isFormValid =
            this.props.registrationValidation.isEmailValid &&
            this.props.registrationValidation.isEmailVerificationCodeProvided &&
            this.props.registrationValidation.isPasswordLengthValid &&
            this.props.registrationValidation.isPasswordMatched &&
            this.props.registrationValidation.isAvatarBase64Set &&
            this.props.registrationValidation.isFullnameLengthValid &&
            this.props.registrationValidation.isNicknameLengthValid &&
            this.props.registrationValidation.isRoleSelected;

        this.props.setRegistrationValidation({
            ...this.props.registrationValidation,
            isEmailValid: this.props.registrationValidation.isEmailValid === true,
            isEmailVerificationCodeProvided: this.props.registrationValidation.isEmailVerificationCodeProvided === true,
            isPasswordLengthValid: this.props.registrationValidation.isPasswordLengthValid === true,
            isPasswordMatched: this.props.registrationValidation.isPasswordMatched === true,
            isAvatarBase64Set: this.props.registrationValidation.isAvatarBase64Set === true,
            isFullnameLengthValid: this.props.registrationValidation.isFullnameLengthValid === true,
            isNicknameLengthValid: this.props.registrationValidation.isNicknameLengthValid === true,
            isRoleSelected: this.props.registrationValidation.isRoleSelected === true,
            isFormValid,
        });

        return isFormValid;
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ logins }: IApplicationState) => ({
    registrationLoading: logins.registrationLoading,
    registrationValidation: logins.registrationValidation,
    registrationInput: logins.registrationInput,
    registrationResult: logins.registrationResult,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openLoginDialog: (isOpen: boolean) => dispatch(dialogsActions.openLoginDialog(isOpen)),
    openRegisterDialog: (isOpen: boolean) => dispatch(dialogsActions.openRegisterDialog(isOpen)),
    registerRequest: (input: IRegistrationInput) => dispatch(loginsActions.registerRequest(input)),
    registerResult: (result: IRegistrationResult) => dispatch(loginsActions.registerResult(result)),
    setRegistrationValidation: (validation: IRegistrationValidation) =>
        dispatch(loginsActions.setRegistrationValidation(validation)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RegisterDetailDialog);
