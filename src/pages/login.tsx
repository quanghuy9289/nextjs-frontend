/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
  Button,
  Callout,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  Position,
  Switch,
  Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { Cookies, withCookies } from "react-cookie";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";

import { IApplicationState } from "../store";
import * as cookiesActions from "../store/cookies/actions";
import * as loginsActions from "../store/logins/actions";
import { ILoginInput, ILoginResult, ILoginValidation } from "../store/logins/types";

import { CONST_COOKIE_EMAIL, CONST_COOKIE_REMEMBER_ME } from "../utils/constants";

import { validateEmail } from "../utils/validator";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  overflow: auto;
  border: solid 1px #f2f2f2;
  width: 500px;
  margin: 30px auto;
  background-color: #f9f9f9;
`;

const ButtonGroup = styled(ControlGroup)`
  display: flex;
  align-self: flex-end;

  & > span {
    margin-left: 10px;
  }
`;

interface IPropsFromState {
  loginInput: ILoginInput;
  authtoken?: string;
  errors?: string;
  cookiesStore: Cookies;
  hasCookies: boolean;
  result: ILoginResult;
  loginValidation: ILoginValidation;
  isLoginLoading: boolean;
  // userMap: IStringTMap<IUser>;
  usersLoading: boolean;
  usersLoaded: boolean;
  isForgotPassword: boolean;
  // forgotPasswordResetCodeInput: IEmailVerificationInput;
  forgotPasswordResetCodeLoading: boolean;
  forgotPasswordResetCodeSent: boolean;
  // resetPasswordInput: IResetPasswordInput;
  // resetPasswordValidation: IResetPasswordValidation;
  // resetPasswordResult: IResetPasswordResult;
}

interface IPropsFromDispatch {
  loginResult: typeof loginsActions.loginResult;
  setLoginInput: typeof loginsActions.setLoginInput;
  setLoginValidation: typeof loginsActions.setLoginValidation;
  loginRequest: typeof loginsActions.loginRequest;
  // getUsers: typeof usersActions.getUsers;
  setIsForgotPassword: typeof loginsActions.setIsForgotPassword;
  setResetPasswordValidation: typeof loginsActions.setResetPasswordValidation;
  resetPasswordSetInput: typeof loginsActions.resetPasswordSetInput;
  forgotPasswordResetCodeRequest: typeof loginsActions.forgotPasswordResetCodeRequest;
  forgotPasswordResetCodeSetInput: typeof loginsActions.forgotPasswordResetCodeSetInput;
  setCookiesSharedObject: typeof cookiesActions.setCookiesSharedObject;
}

type AllProps = IPropsFromState & IPropsFromDispatch;

class Login extends React.PureComponent<AllProps> {
  constructor(props) {
    super(props);
    // Share cookies object reference to redux store
    if (!this.props.cookiesStore) {
      this.props.setCookiesSharedObject(props.cookies);
    }
  }

  public render() {
    return (
      <Container>
        {this.props.result.isWrongEmailOrPassword === true ? (
          <Callout
            title={"Incorrect login information"}
            icon={IconNames.WARNING_SIGN}
            intent={Intent.WARNING}
            style={{ marginBottom: "20px" }}
          >
            Your username or password is wrong, please try again.
          </Callout>
        ) : (
          <div />
        )}
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
            intent={this.props.loginValidation.isEmailValid === false ? Intent.DANGER : Intent.NONE}
          />
        </FormGroup>
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
            intent={this.props.loginValidation.isPasswordLengthValid === false ? Intent.DANGER : Intent.NONE}
          />
        </FormGroup>
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
        </FormGroup>
        <ButtonGroup fill={false} vertical={false}>
          <Tooltip
            key={"TTResisterButton"}
            position={Position.BOTTOM_RIGHT}
            content="Register if you don't have an account"
          >
            <Button onClick={this.handleLoginDialogRegisterClicked} disabled={this.props.isLoginLoading}>
              Register
            </Button>
          </Tooltip>

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
          </Tooltip>
        </ButtonGroup>
      </Container>
    );
  }

  private onChangeLoginEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.hasCookies && this.props.loginInput.rememberMe) {
      this.props.cookiesStore!.set(CONST_COOKIE_EMAIL, e.target.value, { path: "/" });
    }

    this.props.setLoginInput({
      ...this.props.loginInput,
      email: e.target.value,
    });

    this.props.setLoginValidation({
      isEmailValid: validateEmail(e.target.value),
    });
  };

  private onChangeLoginPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setLoginInput({
      ...this.props.loginInput,
      password: e.target.value,
    });
    this.props.setLoginValidation({
      isPasswordLengthValid: !_.isEmpty(e.target.value),
    });
  };

  private onChangeLoginRememberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.hasCookies) {
      this.props.cookiesStore!.set(CONST_COOKIE_REMEMBER_ME, e.target.checked, { path: "/" });
      if (e.target.checked) {
        this.props.cookiesStore!.set(CONST_COOKIE_EMAIL, this.props.loginInput.email, { path: "/" });
      } else {
        this.props.cookiesStore!.remove(CONST_COOKIE_EMAIL, { path: "/" });
      }
    }

    this.props.setLoginInput({
      ...this.props.loginInput,
      rememberMe: e.target.checked,
    });
  };

  private handleLoginDialogRegisterClicked = () => {
    // TODO: handle register
  };

  private handleLogin = () => {
    if (this.validateInputs()) {
      this.props.loginRequest(this.props.loginInput);
    }
  };

  private validateInputs = () => {
    const isFormValid = this.props.loginValidation.isEmailValid && this.props.loginValidation.isPasswordLengthValid;

    this.props.setLoginValidation({
      ...this.props.loginValidation,
      isEmailValid: this.props.loginValidation.isEmailValid === true,
      isPasswordLengthValid: this.props.loginValidation.isPasswordLengthValid === true,
      isFormValid,
    });

    return isFormValid;
  };
}

const mapStateToProps = ({ logins, cookies }: IApplicationState) => ({
  loginInput: logins.input,
  result: logins.result,
  isLoginLoading: logins.loading,
  loginValidation: logins.loginValidation,
  resetPasswordValidation: logins.resetPasswordValidation,
  isForgotPassword: logins.isForgotPassword,
  resetPasswordLoading: logins.resetPasswordLoading,
  resetPasswordInput: logins.resetPasswordInput,
  resetPasswordResult: logins.resetPasswordResult,
  cookiesStore: cookies.cookies,
  hasCookies: cookies.hasCookies,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setLoginInput: (input: ILoginInput) => dispatch(loginsActions.setLoginInput(input)),
  loginRequest: (input: ILoginInput) => dispatch(loginsActions.loginRequest(input)),
  loginResult: (result: ILoginResult) => dispatch(loginsActions.loginResult(result)),
  logout: () => dispatch(loginsActions.logout()),
  setLoginValidation: (validation: ILoginValidation) => dispatch(loginsActions.setLoginValidation(validation)),
  setCookiesSharedObject: (cookies: Cookies) => dispatch(cookiesActions.setCookiesSharedObject(cookies)),
  // setResetPasswordValidation: (validation: IResetPasswordValidation) =>
  //   dispatch(loginsActions.setResetPasswordValidation(validation)),
  // resetPasswordRequest: (input: IResetPasswordInput) => dispatch(loginsActions.resetPasswordRequest(input)),
  // setIsForgotPassword: (isForgotPassword: boolean) => dispatch(loginsActions.setIsForgotPassword(isForgotPassword)),
});

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Login));
