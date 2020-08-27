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
import { Select } from "@blueprintjs/select";
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
    IRegistrationInput,
    IRegistrationResult,
    IRegistrationValidation,
} from "../store/logins/types";
import * as rolesActions from "../store/roles/actions";
import { IRole } from "../store/roles/types";
import { validateEmail } from "../utils/validator";
import { roleSelectProps, TOP_100_ROLES } from "./roles/role-select-item";
import UserAvatarUploader from "./useravataruploader";

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
    cookies?: Cookies;
    hasCookies: boolean;
    registrationValidation: IRegistrationValidation;
    registrationInput: IRegistrationInput;
    registrationResult: IRegistrationResult;
    emailVerificationCodeInput: IEmailVerificationInput;
    emailVerificationCodeLoading: boolean;
    emailVerificationCodeSent: boolean;
    rolesLoading: boolean;
    rolesLoaded: boolean;
    roles: IRole[];
}

interface IPropsFromDispatch {
    setRegistrationValidation: typeof loginsActions.setRegistrationValidation;
    setRegistrationInput: typeof loginsActions.setRegistrationInput;
    setEmailVerificationCodeInput: typeof loginsActions.setEmailVerificationCodeInput;
    emailVerificationCodeRequest: typeof loginsActions.emailVerificationCodeRequest;
    registerResult: typeof loginsActions.registerResult;
    getRoles: typeof rolesActions.getRoles;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class RegisterDetailPanel extends React.PureComponent<AllProps, IPriorityDetailState> {
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // Load roles
        if (!this.props.rolesLoaded) {
            this.props.getRoles();
        }
    }

    public render() {
        // const {role} = this.state;
        const { role } = this.props.registrationInput;
        return (
            <Container>
                {this.props.registrationValidation.isFormValid === false ?
                    (<Callout
                        title={"Invalid registration inputs"}
                        icon={IconNames.WARNING_SIGN}
                        intent={Intent.WARNING}
                        style={{ marginBottom: "20px" }}
                    >
                        Please correct the issues below before submit your registration.
                    </Callout>) :
                    (<div />)
                }
                {this.props.registrationResult.isEmailHasBeenUsed === true ?
                    (<Callout
                        title={"Invalid email"}
                        icon={IconNames.WARNING_SIGN}
                        intent={Intent.WARNING}
                        style={{ marginBottom: "20px" }}
                    >
                        This email has been used for registration.
                        Please use another email or reset your password to log-in.
                    </Callout>) :
                    (<div />)
                }
                {this.props.registrationResult.isInvalidVerificationCode === true ?
                    (<Callout
                        title={"Invalid verification code"}
                        icon={IconNames.WARNING_SIGN}
                        intent={Intent.WARNING}
                        style={{ marginBottom: "20px" }}
                    >
                        The provided verification code is invalid.
                    </Callout>) :
                    (<div />)
                }
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Email"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.email}
                        placeholder="Email..."
                        onChange={this.onChangeRegisterEmailInput}
                        intent={
                            (
                                this.props.registrationValidation.isEmailValid === false ||
                                this.props.registrationResult.isEmailHasBeenUsed === true
                            ) ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Email verification code"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.emailverificationcode}
                        placeholder="Verification code..."
                        onChange={this.onChangeEmailVerificationCode}
                        disabled={!validateEmail(this.props.emailVerificationCodeInput.email)}
                        intent={
                            (
                                this.props.registrationValidation.isEmailVerificationCodeProvided === false ||
                                this.props.registrationResult.isInvalidVerificationCode === true
                            ) ?
                                Intent.DANGER : Intent.NONE
                        }
                        rightElement={
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content={
                                    this.props.emailVerificationCodeSent ?
                                        "Verification has been sent to your email. Click to resend." :
                                        "Send verification code to your email"
                                }
                            >
                                <Button
                                    icon={this.props.emailVerificationCodeLoading ? (
                                        <Spinner
                                            size={12}
                                        />
                                    ) :
                                        (this.props.emailVerificationCodeSent ? IconNames.TICK : IconNames.NUMERICAL)
                                    }
                                    text={
                                        this.props.emailVerificationCodeLoading ?
                                            "" :
                                            (this.props.emailVerificationCodeSent ? "Sent" : "Get code")
                                    }
                                    disabled={
                                        this.props.emailVerificationCodeLoading ||
                                        !validateEmail(this.props.emailVerificationCodeInput.email)
                                    }
                                    onClick={this.emailVerificationCodeRequest}
                                />
                            </Tooltip>
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Password"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.password}
                        placeholder="Password..."
                        type="password"
                        onChange={this.onChangeRegisterPasswordInput}
                        intent={
                            this.props.registrationValidation.isPasswordLengthValid === false ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Retype password"
                // labelFor="text-input"
                // labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.retypepassword}
                        placeholder="Retype password..."
                        type="password"
                        onChange={this.onChangeRegisterRetypePasswordInput}
                        intent={
                            this.props.registrationValidation.isPasswordMatched === false ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Job title"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <RoleSelect
                        {...roleSelectProps}
                        items={this.props.roles}
                        // {...flags}
                        filterable={true}
                        disabled={this.props.rolesLoading}
                        // isItemDisabled={false}
                        // initialContent={undefined}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onItemSelect={this.onChangeRegisterRoleInput}
                        popoverProps={{
                            minimal: true,
                            usePortal: false,
                            autoFocus: true,
                            enforceFocus: true,
                            position: "auto",
                            boundary: "viewport",
                        }}
                    >
                        <Button
                            // icon={IconNames.STAR}
                            loading={this.props.rolesLoading}
                            rightIcon={IconNames.CARET_DOWN}
                            text={role ? `${role.name}` : "(No selection)"}
                            disabled={false}
                            intent={
                                this.props.registrationValidation.isRoleSelected === false ?
                                    Intent.DANGER : Intent.NONE
                            }
                        />
                    </RoleSelect>
                    <Button
                        icon={IconNames.REFRESH}
                        minimal={true}
                        onClick={(e) => {
                            this.props.getRoles(); // Load roles
                        }}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Fullname"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.fullname}
                        placeholder="Fullname..."
                        onChange={this.onChangeRegisterFullnameInput}
                        intent={
                            this.props.registrationValidation.isFullnameLengthValid === false ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Nickname"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.registrationInput.nickname}
                        placeholder="Nickname..."
                        onChange={this.onChangeRegisterNicknameInput}
                        intent={
                            this.props.registrationValidation.isNicknameLengthValid === false ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Avatar"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <UserAvatarUploader
                        name={this.props.registrationInput.nickname}
                        base64Image={this.props.registrationInput.avatarBase64}
                        onAvatarBase64Uploaded={this.onChangeRegisterAvatarInput}
                        intent={
                            this.props.registrationValidation.isAvatarBase64Set === false ?
                                Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                {/* <FormGroup
                    // helperText="Helper text with details..."
                    label="Options"
                    // labelFor="text-input"
                    // labelInfo="(required)"
                >
                    <Switch
                        label="Remember me"
                        disabled={false}
                        defaultChecked={true}
                    />
                </FormGroup> */}
            </Container>
        );
    }

    private onChangeRegisterEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.hasCookies) {
            this.props.cookies!.set("email", e.target.value, { path: "/" });
        }
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            email: e.target.value,
        });

        this.props.setEmailVerificationCodeInput({
            ...this.props.emailVerificationCodeInput,
            email: e.target.value,
        });

        this.props.setRegistrationValidation({
            isEmailValid: validateEmail(e.target.value),
        });
    }

    private onChangeEmailVerificationCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            emailverificationcode: e.target.value,
        });

        this.props.setRegistrationValidation({
            isEmailVerificationCodeProvided: !_.isEmpty(e.target.value),
        });
    }

    private onChangeRegisterFullnameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            fullname: e.target.value,
        });

        this.props.setRegistrationValidation({
            isFullnameLengthValid: !_.isEmpty(e.target.value),
        });
    }

    private onChangeRegisterNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            nickname: e.target.value,
        });

        this.props.setRegistrationValidation({
            isNicknameLengthValid: !_.isEmpty(e.target.value),
        });
    }

    private onChangeRegisterAvatarInput = (fileBase64: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            avatarBase64: fileBase64,
        });

        this.props.setRegistrationValidation({
            isAvatarBase64Set: !_.isEmpty(fileBase64),
        });
    }

    private onChangeRegisterPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            password: e.target.value,
        });

        this.props.setRegistrationValidation({
            isPasswordLengthValid: !_.isEmpty(e.target.value),
        });
    }

    private onChangeRegisterRetypePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            retypepassword: e.target.value,
        });

        this.props.setRegistrationValidation({
            isPasswordMatched: _.isEqual(this.props.registrationInput.password, e.target.value),
        });
    }

    private emailVerificationCodeRequest = (e) => {
        this.props.emailVerificationCodeRequest(this.props.emailVerificationCodeInput);
    }

    private onChangeRegisterRoleInput = (role: IRole) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.setRegistrationInput({
            ...this.props.registrationInput,
            role,
        });

        this.props.setRegistrationValidation({
            isRoleSelected: !_.isNull(role),
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ logins, cookies, roles }: IApplicationState) => ({
    cookies: cookies.cookies,
    hasCookies: cookies.hasCookies,
    registrationInput: logins.registrationInput,
    registrationResult: logins.registrationResult,
    registrationValidation: logins.registrationValidation,
    emailVerificationCodeInput: logins.emailVerificationCodeInput,
    emailVerificationCodeLoading: logins.emailVerificationCodeLoading,
    emailVerificationCodeSent: logins.emailVerificationCodeSent,
    rolesLoading: roles.loading,
    rolesLoaded: roles.loaded,
    roles: roles.result.roles,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    // setRegisterInput: (email: string, password: string) => dispatch(loginsActions.setRegisterInput(email, password)),
    setRegistrationValidation: (validation: IRegistrationValidation) =>
        dispatch(loginsActions.setRegistrationValidation(validation)),
    emailVerificationCodeRequest: (input: IEmailVerificationInput) =>
        dispatch(loginsActions.emailVerificationCodeRequest(input)),
    setEmailVerificationCodeInput: (input: IEmailVerificationInput) =>
        dispatch(loginsActions.setEmailVerificationCodeInput(input)),
    setRegistrationInput: (input: IRegistrationInput) =>
        dispatch(loginsActions.setRegistrationInput(input)),
    registerResult: (result: IRegistrationResult) =>
        dispatch(loginsActions.registerResult(result)),
    getRoles: () =>
        dispatch(rolesActions.getRoles()),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RegisterDetailPanel);
