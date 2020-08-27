/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";
import { IStringTMap } from "../../utils/types";
import { IRole } from "../roles/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

export interface ILoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface IRegistrationInput {
  email: string;
  emailverificationcode: string;
  password: string;
  retypepassword: string;
  fullname: string;
  nickname: string;
  avatarBase64: string;
  role?: IRole;
}

export interface IResetPasswordInput {
  email: string;
  resetcode: string;
  newpassword: string;
  retypenewpassword: string;
}

export interface IEmailVerificationInput {
  email: string;
}

export interface ILoginResult {
  authtoken?: string;
  errors?: string;
  isWrongEmailOrPassword?: boolean;
}

export interface ILoginValidation {
  isEmailValid?: boolean;
  isPasswordLengthValid?: boolean;
  isFormValid?: boolean;
}

export interface IResetPasswordValidation {
  isNewPasswordLengthValid?: boolean;
  isNewPasswordMatched?: boolean;
  isResetCodeProvided?: boolean;
  isFormValid?: boolean;
}

export interface IRegistrationValidation {
  isEmailValid?: boolean;
  isEmailVerificationCodeProvided?: boolean;
  isPasswordLengthValid?: boolean;
  isPasswordMatched?: boolean;
  isAvatarBase64Set?: boolean;
  isRoleSelected?: boolean;
  isFullnameLengthValid?: boolean;
  isNicknameLengthValid?: boolean;
  isFormValid?: boolean;
}

export interface IRegistrationResult {
  id?: string;
  errors?: string;
  isEmailHasBeenUsed?: boolean;
  isInvalidVerificationCode?: boolean;
}

export interface IEmailVerificationResult {
  errors?: string;
}

export interface IResetPasswordResult {
  isSuccess?: boolean;
  errors?: string;
  isInvalidResetCode?: boolean;
}

export interface IEmailNotificationInput {
  subject: string;
  content: string;
  taskID?: string;
  userID?: string;
  columnID?: string;
  priorityID?: string;
  projectID?: string;
  mentionedCommentUserIDs?: string[];
  mentionedTaskDescriptionUserIDs?: string[];
}

export interface IUserConfig {
  collapsedColumns?: IStringTMap<boolean>;
}

// Active profile
export interface IActiveUserProfile {
  id: string;
  fullname: string;
  nickname: string;
  email: string;
  avatarBase64: string;
  roleID: string;
  config?: IUserConfig;
}

export interface IActiveUserProfileResult {
  errors?: string;
  profile?: IActiveUserProfile;
}

export enum LoginsActionTypes {
  SET_LOGIN_INPUT = "@@logins/SET_LOGIN_INPUT",
  LOGIN_REQUEST = "@@logins/LOGIN_REQUEST",
  LOGIN_RESULT = "@@logins/LOGIN_RESULT",
  LOGIN_ERROR = "@@logins/LOGIN_ERROR",
  LOGOUT = "@@logins/LOGOUT",
  SET_LOGIN_VALIDATION = "@@logins/SET_LOGIN_VALIDATION",
  REGISTER_REQUEST = "@@logins/REGISTER_REQUEST",
  REGISTER_RESULT = "@@logins/REGISTER_RESULT",
  REGISTER_ERROR = "@@logins/REGISTER_ERROR",
  SET_REGISTRATION_VALIDATION = "@@logins/SET_REGISTRATION_VALIDATION",
  SET_REGISTRATION_INPUT = "@@logins/SET_REGISTRATION_INPUT",
  SET_EMAIL_VERIFICATION_CODE_INPUT = "@@logins/SET_EMAIL_VERIFICATION_CODE_INPUT",
  EMAIL_VERIFICATION_CODE_REQUEST = "@@logins/EMAIL_VERIFICATION_CODE_REQUEST",
  EMAIL_VERIFICATION_CODE_RESULT = "@@logins/EMAIL_VERIFICATION_CODE_RESULT",
  EMAIL_VERIFICATION_CODE_ERROR = "@@logins/EMAIL_VERIFICATION_CODE_ERROR",
  SEND_EMAIL_NOTIFICATION_REQUEST = "@@logins/SEND_EMAIL_NOTIFICATION_REQUEST",
  GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_REQUEST = "@@logins/GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_REQUEST",
  GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_RESULT = "@@logins/GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_RESULT",
  GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_ERROR = "@@logins/GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_ERROR",
  SET_IS_FORGOT_PASSWORD = "@@logins/SET_IS_FORGOT_PASSWORD",
  SET_RESET_PASSWORD_VALIDATION = "@@logins/SET_RESET_PASSWORD_VALIDATION",
  RESET_PASSWORD_SET_INPUT = "@@logins/RESET_PASSWORD_SET_INPUT",
  RESET_PASSWORD_REQUEST = "@@logins/RESET_PASSWORD_REQUEST",
  RESET_PASSWORD_SET_RESULT = "@@logins/RESET_PASSWORD_SET_RESULT",
  RESET_PASSWORD_SET_ERROR = "@@logins/RESET_PASSWORD_SET_ERROR",
  FORGOT_PASSWORD_RESET_CODE_SET_INPUT = "@@logins/FORGOT_PASSWORD_RESET_CODE_SET_INPUT",
  FORGOT_PASSWORD_RESET_CODE_REQUEST = "@@logins/FORGOT_PASSWORD_RESET_CODE_REQUEST",
  FORGOT_PASSWORD_RESET_CODE_SET_RESULT = "@@logins/FORGOT_PASSWORD_RESET_CODE_SET_RESULT",
  FORGOT_PASSWORD_RESET_CODE_SET_ERROR = "@@logins/FORGOT_PASSWORD_RESET_CODE_SET_ERROR",
  SET_USER_CONFIG_COLLAPSED_COLUMN = "@@logins/SET_USER_CONFIG_COLLAPSED_COLUMN",
}

export interface ILoginsState {
  // Logins
  readonly loading: boolean;
  readonly input: ILoginInput;
  readonly result: ILoginResult;
  readonly loginValidation: ILoginValidation;
  // Profile
  readonly activeUserProfile: IActiveUserProfile;
  readonly activeUserProfileResult: IActiveUserProfileResult;
  readonly activeUserProfileLoading: boolean;
  // Get verification code
  readonly emailVerificationCodeInput: IEmailVerificationInput;
  readonly emailVerificationCodeLoading: boolean;
  readonly emailVerificationCodeSent: boolean;
  readonly emailVerificationCodeResult: IEmailVerificationResult;
  // Get reset code
  readonly isForgotPassword: boolean;
  readonly forgotPasswordResetCodeInput: IEmailVerificationInput;
  readonly forgotPasswordResetCodeLoading: boolean;
  readonly forgotPasswordResetCodeSent: boolean;
  readonly forgotPasswordResetCodeResult: IEmailVerificationResult;
  // Registration
  readonly registrationValidation: IRegistrationValidation;
  readonly registrationResult: IRegistrationResult;
  readonly registrationInput: IRegistrationInput;
  readonly registrationLoading: boolean;
  // Reset password
  readonly resetPasswordValidation: IResetPasswordValidation;
  readonly resetPasswordLoading: boolean;
  readonly resetPasswordInput: IResetPasswordInput;
  readonly resetPasswordResult: IResetPasswordResult;
}
