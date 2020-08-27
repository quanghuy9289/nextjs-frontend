/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import {
    IActiveUserProfileResult,
    IEmailNotificationInput,
    IEmailVerificationInput,
    IEmailVerificationResult,
    ILoginInput,
    ILoginResult,
    ILoginValidation,
    IRegistrationInput,
    IRegistrationResult,
    IRegistrationValidation,
    IResetPasswordInput,
    IResetPasswordResult,
    IResetPasswordValidation,
    LoginsActionTypes,
} from "./types";

export const setLoginInput = (input: ILoginInput) =>
    action(LoginsActionTypes.SET_LOGIN_INPUT, input);
export const loginRequest = (input: ILoginInput) => action(LoginsActionTypes.LOGIN_REQUEST, input);
export const loginResult = (result: ILoginResult) => action(LoginsActionTypes.LOGIN_RESULT, result);
export const loginError = (errors: string) => action(LoginsActionTypes.LOGIN_ERROR, {errors});
export const logout = () => action(LoginsActionTypes.LOGOUT);
export const setLoginValidation = (validation: ILoginValidation) =>
    action(LoginsActionTypes.SET_LOGIN_VALIDATION, validation);

export const registerRequest = (input: IRegistrationInput) => action(LoginsActionTypes.REGISTER_REQUEST, input);
export const registerResult = (result: IRegistrationResult) => action(LoginsActionTypes.REGISTER_RESULT, result);
export const registerError = (errors: string) => action(LoginsActionTypes.REGISTER_ERROR, {errors});
export const setRegistrationValidation = (validation: IRegistrationValidation) =>
    action(LoginsActionTypes.SET_REGISTRATION_VALIDATION, validation);
export const setRegistrationInput = (input: IRegistrationInput) =>
    action(LoginsActionTypes.SET_REGISTRATION_INPUT, input);

// <Email verification code>
export const setEmailVerificationCodeInput = (input: IEmailVerificationInput) =>
    action(LoginsActionTypes.SET_EMAIL_VERIFICATION_CODE_INPUT, input);
export const emailVerificationCodeRequest = (input: IEmailVerificationInput) =>
    action(LoginsActionTypes.EMAIL_VERIFICATION_CODE_REQUEST, input);
export const emailVerificationCodeResult = (result: IEmailVerificationResult) =>
    action(LoginsActionTypes.EMAIL_VERIFICATION_CODE_RESULT, result);
export const emailVerificationCodeError = (errors: string) =>
    action(LoginsActionTypes.EMAIL_VERIFICATION_CODE_RESULT, {errors});
// </Email verification code>

export const getActiveUserProfileByAuthTokenRequest = () =>
    action(LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_REQUEST);
export const getActiveUserProfileByAuthTokenResult = (result: IActiveUserProfileResult) =>
    action(LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_RESULT, result);

// <Forgot password>
export const setIsForgotPassword = (isForgotPassword: boolean) =>
    action(LoginsActionTypes.SET_IS_FORGOT_PASSWORD, isForgotPassword);
export const setResetPasswordValidation = (validation: IResetPasswordValidation) =>
    action(LoginsActionTypes.SET_RESET_PASSWORD_VALIDATION, validation);
export const resetPasswordSetInput = (input: IResetPasswordInput) =>
    action(LoginsActionTypes.RESET_PASSWORD_SET_INPUT, input);
export const resetPasswordRequest = (input: IResetPasswordInput) =>
    action(LoginsActionTypes.RESET_PASSWORD_REQUEST, input);
export const resetPasswordSetResult = (result: IResetPasswordResult) =>
    action(LoginsActionTypes.RESET_PASSWORD_SET_RESULT, result);
export const resetPasswordSetError = (errors: string) =>
    action(LoginsActionTypes.RESET_PASSWORD_SET_ERROR, {errors});
export const forgotPasswordResetCodeSetInput = (input: IEmailVerificationInput) =>
    action(LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_INPUT, input);
export const forgotPasswordResetCodeRequest = (input: IEmailVerificationInput) =>
    action(LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_REQUEST, input);
export const forgotPasswordResetCodeSetResult = (result: IEmailVerificationResult) =>
    action(LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_RESULT, result);
export const forgotPasswordResetCodeSetError = (errors: string) =>
    action(LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_ERROR, {errors});
// </Forgot password>

// <Email notification>
export const sendEmailNotificationRequest = (input: IEmailNotificationInput) =>
    action(LoginsActionTypes.SEND_EMAIL_NOTIFICATION_REQUEST, input);
// </Email notification>

// <Config>
export const setUserConfigCollapsedColumn = (columnID: string, collapsed: boolean) =>
    action(LoginsActionTypes.SET_USER_CONFIG_COLLAPSED_COLUMN, {columnID, collapsed});
// </Config>
