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
    ILoginInput,
    ILoginResult,
    ILoginValidation,
    IRegistrationInput,
    IRegistrationResult,
    IResetPasswordInput,
    IResetPasswordResult,
    IResetPasswordValidation,
} from "../store/logins/types";
import * as rolesActions from "../store/roles/actions";
import { IRole } from "../store/roles/types";
import { isUndefinedOrEmpty } from "../utils/strings";
import { validateEmail } from "../utils/validator";
import { roleSelectProps, TOP_100_ROLES } from "./roles/role-select-item";
import UserAvatarUploader from "./useravataruploader";
import UserLoginPanel from "./userloginpanel";

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
    isLoginLoading: boolean;
    loginInput: ILoginInput;
    result: ILoginResult;
    loginValidation: ILoginValidation;
    resetPasswordValidation: IResetPasswordValidation;
    isForgotPassword: boolean;
    resetPasswordLoading: boolean;
    resetPasswordInput: IResetPasswordInput;
    resetPasswordResult: IResetPasswordResult;
}

interface IPropsFromDispatch {
    openLoginDialog: typeof dialogsActions.openLoginDialog;
    openRegisterDialog: typeof dialogsActions.openRegisterDialog;
    loginRequest: typeof loginsActions.loginRequest;
    loginResult: typeof loginsActions.loginResult;
    setLoginValidation: typeof loginsActions.setLoginValidation;
    logout: typeof loginsActions.logout;
    setResetPasswordValidation: typeof loginsActions.setResetPasswordValidation;
    resetPasswordRequest: typeof loginsActions.resetPasswordRequest;
    setIsForgotPassword: typeof loginsActions.setIsForgotPassword;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class LoginDetailDialog extends React.PureComponent<AllProps, IPriorityDetailState> {
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
                icon={IconNames.LOG_IN}
                onClose={this.handleCloseDialog}
                title={
                    isUndefinedOrEmpty(this.props.result.authtoken) ?
                        "Please login" :
                        "Authorized"
                }
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
                    <UserLoginPanel />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    {isUndefinedOrEmpty(this.props.result.authtoken) ?
                        (
                            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                {!this.props.isForgotPassword ?
                                    [
                                        <Tooltip
                                            key={"TTResisterButton"}
                                            position={Position.BOTTOM_RIGHT}
                                            content="Register if you don't have an account"
                                        >
                                            <Button
                                                onClick={this.handleLoginDialogRegisterClicked}
                                                disabled={this.props.isLoginLoading}
                                            >
                                                Register
                                            </Button>
                                        </Tooltip>,
                                        <Tooltip
                                            key={"TTLoginButton"}
                                            position={Position.BOTTOM_RIGHT}
                                            content="Verify and sign-in with the provided authentication information"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleLogin}
                                                // rightIcon={this.props.isLoginLoading ? spinner : undefined}
                                                loading={this.props.isLoginLoading}
                                            // disabled={this.props.isLoginLoading}
                                            >
                                                Login
                                            </Button>
                                        </Tooltip>,
                                    ] :
                                    [
                                        <Tooltip
                                            key={"TTResetPasswordBackToLoginButton"}
                                            position={Position.BOTTOM_RIGHT}
                                            content="Back to login"
                                        >
                                            <Button
                                                onClick={this.handleBackToLoginClicked}
                                            >
                                                Login
                                            </Button>
                                        </Tooltip>,
                                        <Tooltip
                                            key={"TTResetPasswordButton"}
                                            position={Position.BOTTOM_RIGHT}
                                            content="Reset password"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleResetPassword}
                                                loading={this.props.resetPasswordLoading}
                                                disabled={
                                                    this.props.resetPasswordResult.isSuccess === true
                                                }
                                            >
                                                Reset
                                            </Button>
                                        </Tooltip>,
                                    ]
                                }
                            </div>
                        ) :
                        (
                            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                <Tooltip
                                    position={Position.BOTTOM_RIGHT}
                                    content="Logout"
                                >
                                    <Button
                                        intent={Intent.PRIMARY}
                                        onClick={this.handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </Tooltip>
                            </div>
                        )
                    }
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        // To do
    }

    private handleLoginDialogRegisterClicked = () => {
        this.props.openLoginDialog(false);
        this.props.openRegisterDialog(true);
    }

    private handleLogin = () => {
        if (this.validateInputs()) {
            this.props.loginRequest(this.props.loginInput);
        }
    }

    private handleLogout = () => {
        this.props.logout();
    }

    private handleResetPassword = () => {
        if (this.validateResetPasswordInputs()) {
            this.props.resetPasswordRequest(this.props.resetPasswordInput);
        }
    }

    private handleBackToLoginClicked = () => {
        this.props.setIsForgotPassword(false);
    }

    private validateInputs = () => {
        const isFormValid =
            this.props.loginValidation.isEmailValid &&
            this.props.loginValidation.isPasswordLengthValid;

        this.props.setLoginValidation({
            ...this.props.loginValidation,
            isEmailValid: this.props.loginValidation.isEmailValid === true,
            isPasswordLengthValid: this.props.loginValidation.isPasswordLengthValid === true,
            isFormValid,
        });

        return isFormValid;
    }

    private validateResetPasswordInputs = () => {
        const isFormValid =
            this.props.loginValidation.isEmailValid &&
            this.props.resetPasswordValidation.isNewPasswordLengthValid &&
            this.props.resetPasswordValidation.isNewPasswordMatched &&
            this.props.resetPasswordValidation.isResetCodeProvided
            ;

        this.props.setLoginValidation({
            ...this.props.loginValidation,
            isEmailValid: this.props.loginValidation.isEmailValid === true,
        });

        this.props.setResetPasswordValidation({
            ...this.props.resetPasswordValidation,
            isNewPasswordLengthValid: this.props.resetPasswordValidation.isNewPasswordLengthValid === true,
            isNewPasswordMatched: this.props.resetPasswordValidation.isNewPasswordMatched === true,
            isResetCodeProvided: this.props.resetPasswordValidation.isResetCodeProvided === true,
            isFormValid,
        });

        return isFormValid;
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ logins, dialogs }: IApplicationState) => ({
    loginInput: logins.input,
    result: logins.result,
    isLoginLoading: logins.loading,
    loginValidation: logins.loginValidation,
    resetPasswordValidation: logins.resetPasswordValidation,
    isForgotPassword: logins.isForgotPassword,
    resetPasswordLoading: logins.resetPasswordLoading,
    resetPasswordInput: logins.resetPasswordInput,
    resetPasswordResult: logins.resetPasswordResult,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openLoginDialog: (isOpen: boolean) => dispatch(dialogsActions.openLoginDialog(isOpen)),
    openRegisterDialog: (isOpen: boolean) => dispatch(dialogsActions.openRegisterDialog(isOpen)),
    loginRequest: (input: ILoginInput) => dispatch(loginsActions.loginRequest(input)),
    loginResult: (result: ILoginResult) => dispatch(loginsActions.loginResult(result)),
    logout: () => dispatch(loginsActions.logout()),
    setLoginValidation: (validation: ILoginValidation) =>
        dispatch(loginsActions.setLoginValidation(validation)),
    setResetPasswordValidation: (validation: IResetPasswordValidation) =>
        dispatch(loginsActions.setResetPasswordValidation(validation)),
    resetPasswordRequest: (input: IResetPasswordInput) =>
        dispatch(loginsActions.resetPasswordRequest(input)),
    setIsForgotPassword: (isForgotPassword: boolean) =>
        dispatch(loginsActions.setIsForgotPassword(isForgotPassword)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginDetailDialog);
