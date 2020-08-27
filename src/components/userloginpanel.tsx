/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    Popover,
    Position,
    Slider,
    Spinner,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React, { FormEvent } from "react";
import { Cookies } from "react-cookie";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import { IStandardColorGroup } from "../store/colors/types";
import * as loginsActions from "../store/logins/actions";
import {
    IEmailVerificationInput,
    ILoginInput,
    ILoginResult,
    ILoginValidation,
    IRegistrationInput,
    IResetPasswordInput,
    IResetPasswordResult,
    IResetPasswordValidation,
} from "../store/logins/types";
import * as usersActions from "../store/users/actions";
import { IUser } from "../store/users/types";
import {
    CONST_COOKIE_AUTHENTICATION_TOKEN,
    CONST_COOKIE_EMAIL,
    CONST_COOKIE_REMEMBER_ME,
} from "../utils/constants";
import { isUndefinedOrEmpty } from "../utils/strings";
import { IStringTMap } from "../utils/types";
import { validateEmail } from "../utils/validator";
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

interface ILoginDetailState {

}

interface IPropsFromState {
    loginInput: ILoginInput;
    authtoken?: string;
    errors?: string;
    cookies?: Cookies;
    hasCookies: boolean;
    result: ILoginResult;
    loginValidation: ILoginValidation;
    userMap: IStringTMap<IUser>;
    usersLoading: boolean;
    usersLoaded: boolean;
    isForgotPassword: boolean;
    forgotPasswordResetCodeInput: IEmailVerificationInput;
    forgotPasswordResetCodeLoading: boolean;
    forgotPasswordResetCodeSent: boolean;
    resetPasswordInput: IResetPasswordInput;
    resetPasswordValidation: IResetPasswordValidation;
    resetPasswordResult: IResetPasswordResult;
}

interface IPropsFromDispatch {
    loginResult: typeof loginsActions.loginResult;
    setLoginInput: typeof loginsActions.setLoginInput;
    setLoginValidation: typeof loginsActions.setLoginValidation;
    getUsers: typeof usersActions.getUsers;
    setIsForgotPassword: typeof loginsActions.setIsForgotPassword;
    setResetPasswordValidation: typeof loginsActions.setResetPasswordValidation;
    resetPasswordSetInput: typeof loginsActions.resetPasswordSetInput;
    forgotPasswordResetCodeRequest: typeof loginsActions.forgotPasswordResetCodeRequest;
    forgotPasswordResetCodeSetInput: typeof loginsActions.forgotPasswordResetCodeSetInput;
}

interface IOwnProps {
    priority?: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class LoginDetailPanel extends React.PureComponent<AllProps, ILoginDetailState> {
    public state: ILoginDetailState = {

    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // Load users
        if (!this.props.usersLoaded) {
            this.props.getUsers();
        }
    }

    public render() {
        return (
            <Container>
                {this.props.result.isWrongEmailOrPassword === true ?
                    (<Callout
                        title={"Incorrect login information"}
                        icon={IconNames.WARNING_SIGN}
                        intent={Intent.WARNING}
                        style={{ marginBottom: "20px" }}
                    >
                        Your username or password is wrong, please try again.
                    </Callout>) :
                    (<div />)
                }
                {this.props.resetPasswordResult.isInvalidResetCode === true ?
                    (<Callout
                        title={"Invalid reset code"}
                        icon={IconNames.WARNING_SIGN}
                        intent={Intent.WARNING}
                        style={{ marginBottom: "20px" }}
                    >
                        The provided reset code is invalid.
                    </Callout>) :
                    (<div />)
                }
                {!isUndefinedOrEmpty(this.props.result.authtoken) ?
                    (
                        <div>
                            <Callout
                                title={"Hello there"}
                                icon={IconNames.TICK_CIRCLE}
                                intent={Intent.SUCCESS}
                                style={{ marginBottom: "20px" }}
                            >
                                Thank you for your registration. You have been successfully authenticated.<br />
                                You will be contacted shortly when your account has been assigned
                                to the corresponding projects and Task Ripple is opened for operation.
                            </Callout>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Your current team members:"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                {this.props.usersLoading ?
                                    (
                                        <Spinner
                                            intent={Intent.NONE}
                                            size={50}
                                        />
                                    ) :
                                    (
                                        <div>
                                            {
                                                _.map(this.props.userMap, (eachUser: IUser, userID: string) => {
                                                    return (
                                                        <UserImage
                                                            key={eachUser.id}
                                                            sizeInPx={50}
                                                            name={eachUser.nickname}
                                                            imgSource={eachUser.avatarBase64}
                                                            allowContextMenu={false}
                                                        />
                                                    );
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </FormGroup>
                        </div>
                    ) :
                    (
                        this.props.resetPasswordResult.isSuccess === true ?
                            <div>
                                <Callout
                                    title={"Password reset"}
                                    icon={IconNames.TICK_CIRCLE}
                                    intent={Intent.SUCCESS}
                                    style={{ marginBottom: "20px" }}
                                >
                                    Your password has been reset successfully. Please login again.
                            </Callout>
                            </div> :
                            <div>
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Email"
                                // labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <InputGroup
                                        value={this.props.loginInput.email}
                                        placeholder="Email..."
                                        onChange={this.onChangeLoginEmailInput}
                                        intent={
                                            this.props.loginValidation.isEmailValid === false ?
                                                Intent.DANGER : Intent.NONE
                                        }
                                    />
                                </FormGroup>
                                {!this.props.isForgotPassword ?
                                    [
                                        <FormGroup
                                            key={"LoginPassword"}
                                            // helperText="Helper text with details..."
                                            label="Password"
                                        // labelFor="text-input"
                                        // labelInfo="(required)"
                                        >
                                            <InputGroup
                                                value={this.props.loginInput.password}
                                                placeholder="Password..."
                                                type="password"
                                                onChange={this.onChangeLoginPasswordInput}
                                                intent={
                                                    this.props.loginValidation.isPasswordLengthValid === false ?
                                                        Intent.DANGER : Intent.NONE
                                                }
                                                rightElement={
                                                    <Tooltip
                                                        position={Position.BOTTOM_RIGHT}
                                                        content={"Forgot your password ?"}
                                                    >
                                                        <Button
                                                            icon={IconNames.KEY}
                                                            text={"Forgot?"}
                                                            onClick={this.handleForgotPassword}
                                                        />
                                                    </Tooltip>
                                                }
                                            />
                                        </FormGroup>,
                                        <FormGroup
                                            key={"LoginOptions"}
                                            // helperText="Helper text with details..."
                                            label="Options"
                                        // labelFor="text-input"
                                        // labelInfo="(required)"
                                        >
                                            <Switch
                                                label="Remember me"
                                                disabled={false}
                                                // defaultChecked={true}
                                                checked={this.props.loginInput.rememberMe}
                                                onChange={this.onChangeLoginRememberInput}
                                            />
                                        </FormGroup>,
                                    ] :
                                    [
                                        <FormGroup
                                            key={"ForgotPasswordResetCode"}
                                            // helperText="Helper text with details..."
                                            label="Reset code"
                                        // labelFor="text-input"
                                        // labelInfo="(required)"
                                        >
                                            <InputGroup
                                                value={this.props.resetPasswordInput.resetcode}
                                                placeholder="Reset code..."
                                                onChange={this.onChangeForgotPasswordResetCode}
                                                disabled={!validateEmail(this.props.loginInput.email)}
                                                intent={
                                                    (
                                                        this.props.resetPasswordValidation.isResetCodeProvided === false ||
                                                        this.props.resetPasswordResult.isInvalidResetCode === true
                                                    ) ?
                                                        Intent.DANGER : Intent.NONE
                                                }
                                                rightElement={
                                                    <Tooltip
                                                        position={Position.BOTTOM_RIGHT}
                                                        content={
                                                            this.props.forgotPasswordResetCodeSent ?
                                                                "Reset password code has been sent to your email." :
                                                                "Send reset code to your email"
                                                        }
                                                    >
                                                        <Button
                                                            icon={this.props.forgotPasswordResetCodeLoading ? (
                                                                <Spinner
                                                                    size={12}
                                                                />
                                                            ) :
                                                                (
                                                                    this.props.forgotPasswordResetCodeSent ?
                                                                        IconNames.TICK : IconNames.NUMERICAL
                                                                )
                                                            }
                                                            text={
                                                                this.props.forgotPasswordResetCodeLoading ?
                                                                    "" :
                                                                    (
                                                                        this.props.forgotPasswordResetCodeSent ?
                                                                            "Sent" : "Get code"
                                                                    )
                                                            }
                                                            disabled={
                                                                this.props.forgotPasswordResetCodeLoading ||
                                                                !validateEmail(this.props.loginInput.email)
                                                            }
                                                            onClick={this.handleResetCodeRequest}
                                                        />
                                                    </Tooltip>
                                                }
                                            />
                                        </FormGroup>,
                                        <FormGroup
                                            key={"ForgotPasswordNew"}
                                            // helperText="Helper text with details..."
                                            label="New password"
                                        // labelFor="text-input"
                                        // labelInfo="(required)"
                                        >
                                            <InputGroup
                                                value={this.props.resetPasswordInput.newpassword}
                                                placeholder="New password..."
                                                type="password"
                                                onChange={this.onChangeResetPasswordNewInput}
                                                intent={
                                                    this.props.resetPasswordValidation.isNewPasswordLengthValid === false ?
                                                        Intent.DANGER : Intent.NONE
                                                }
                                            />
                                        </FormGroup>,
                                        <FormGroup
                                            key={"ForgotPasswordNewRetype"}
                                            // helperText="Helper text with details..."
                                            label="Retype"
                                        // labelFor="text-input"
                                        // labelInfo="(required)"
                                        >
                                            <InputGroup
                                                value={this.props.resetPasswordInput.retypenewpassword}
                                                placeholder="Retype new password..."
                                                type="password"
                                                onChange={this.onChangeResetPasswordNewRetypeInput}
                                                intent={
                                                    this.props.resetPasswordValidation.isNewPasswordMatched === false ?
                                                        Intent.DANGER : Intent.NONE
                                                }
                                            />
                                        </FormGroup>,
                                    ]
                                }
                                {/* <FormGroup
                                // helperText="Helper text with details..."
                                label="Authentication token"
                                // labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <InputGroup
                                    value={this.props.authtoken || ""}
                                    placeholder="..."
                                    readOnly={true}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Errors"
                                // labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <InputGroup
                                    value={this.props.errors || ""}
                                    placeholder="..."
                                    readOnly={true}
                                />
                            </FormGroup> */}
                            </div>
                    )
                }
            </Container>
        );
    }

    private onChangeLoginEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.hasCookies && this.props.loginInput.rememberMe) {
            this.props.cookies!.set(CONST_COOKIE_EMAIL, e.target.value, { path: "/" });
        }

        this.props.setLoginInput({
            ...this.props.loginInput,
            email: e.target.value,
        });

        this.props.setLoginValidation({
            isEmailValid: validateEmail(e.target.value),
        });

        this.props.forgotPasswordResetCodeSetInput({
            email: e.target.value,
        });
    }

    private onChangeLoginPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setLoginInput({
            ...this.props.loginInput,
            password: e.target.value,
        });
        this.props.setLoginValidation({
            isPasswordLengthValid: !_.isEmpty(e.target.value),
        });
    }

    private onChangeLoginRememberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.hasCookies) {
            this.props.cookies!.set(CONST_COOKIE_REMEMBER_ME, e.target.checked, { path: "/" });
            if (e.target.checked) {
                this.props.cookies!.set(CONST_COOKIE_EMAIL, this.props.loginInput.email, { path: "/" });
            } else {
                this.props.cookies!.remove(CONST_COOKIE_EMAIL, { path: "/" });
            }
        }

        this.props.setLoginInput({
            ...this.props.loginInput,
            rememberMe: e.target.checked,
        });
    }

    private onChangeResetPasswordNewInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.resetPasswordSetInput({
            ...this.props.resetPasswordInput,
            newpassword: e.target.value,
        });

        this.props.setResetPasswordValidation({
            isNewPasswordLengthValid: !_.isEmpty(e.target.value),
        });
    }

    private onChangeResetPasswordNewRetypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.resetPasswordSetInput({
            ...this.props.resetPasswordInput,
            retypenewpassword: e.target.value,
        });

        this.props.setResetPasswordValidation({
            isNewPasswordMatched: _.isEqual(this.props.resetPasswordInput.newpassword, e.target.value),
        });
    }

    private onChangeForgotPasswordResetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.resetPasswordSetInput({
            ...this.props.resetPasswordInput,
            resetcode: e.target.value,
        });

        this.props.setResetPasswordValidation({
            isResetCodeProvided: !_.isEmpty(e.target.value),
        });
    }

    private handleResetCodeRequest = (e) => {
        this.props.forgotPasswordResetCodeRequest(this.props.forgotPasswordResetCodeInput);
    }

    private handleForgotPassword = (e: React.MouseEvent<HTMLElement>) => {
        this.props.setIsForgotPassword(true);
        this.props.forgotPasswordResetCodeSetInput({
            email: this.props.loginInput.email,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ logins, cookies, users }: IApplicationState) => ({
    loginInput: logins.input,
    authtoken: logins.result.authtoken,
    errors: logins.result.errors,
    cookies: cookies.cookies,
    hasCookies: cookies.hasCookies,
    result: logins.result,
    loginValidation: logins.loginValidation,
    userMap: users.userMap,
    usersLoading: users.loading,
    usersLoaded: users.loaded,
    forgotPasswordResetCodeInput: logins.forgotPasswordResetCodeInput,
    forgotPasswordResetCodeLoading: logins.forgotPasswordResetCodeLoading,
    forgotPasswordResetCodeSent: logins.forgotPasswordResetCodeSent,
    isForgotPassword: logins.isForgotPassword,
    resetPasswordInput: logins.resetPasswordInput,
    resetPasswordValidation: logins.resetPasswordValidation,
    resetPasswordResult: logins.resetPasswordResult,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    loginResult: (result: ILoginResult) =>
        dispatch(loginsActions.loginResult(result)),
    setLoginInput: (input: ILoginInput) => dispatch(loginsActions.setLoginInput(input)),
    setLoginValidation: (validation: ILoginValidation) =>
        dispatch(loginsActions.setLoginValidation(validation)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    setIsForgotPassword: (isForgetPassword: boolean) =>
        dispatch(loginsActions.setIsForgotPassword(isForgetPassword)),
    setResetPasswordValidation: (validation: IResetPasswordValidation) =>
        dispatch(loginsActions.setResetPasswordValidation(validation)),
    resetPasswordSetInput: (input: IResetPasswordInput) =>
        dispatch(loginsActions.resetPasswordSetInput(input)),
    forgotPasswordResetCodeSetInput: (input: IEmailVerificationInput) =>
        dispatch(loginsActions.forgotPasswordResetCodeSetInput(input)),
    forgotPasswordResetCodeRequest: (input: IEmailVerificationInput) =>
        dispatch(loginsActions.forgotPasswordResetCodeRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginDetailPanel);
