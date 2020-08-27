/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import getConfig from "next/config";
import Router from "next/router";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { IApplicationState } from "..";
import { callApi, callApiWithAuthToken } from "../../utils/api";
import { CONST_COOKIE_AUTHENTICATION_TOKEN } from "../../utils/constants";
import { graphqlRequest, graphqlRequestWithAuthToken } from "../../utils/graphqlAPI";
import {
  emailVerificationCodeError,
  emailVerificationCodeRequest,
  emailVerificationCodeResult,
  forgotPasswordResetCodeSetError,
  forgotPasswordResetCodeSetResult,
  getActiveUserProfileByAuthTokenRequest,
  getActiveUserProfileByAuthTokenResult,
  loginError,
  loginRequest,
  loginResult,
  logout,
  registerError,
  registerRequest,
  registerResult,
  resetPasswordRequest,
  resetPasswordSetError,
  resetPasswordSetResult,
  sendEmailNotificationRequest,
} from "./actions";
import {
  IActiveUserProfileResult,
  IEmailVerificationResult,
  ILoginResult,
  IRegistrationResult,
  IResetPasswordResult,
  LoginsActionTypes,
} from "./types";

import cookie from "js-cookie";
import { LOGIN_MUTATION } from "./query";

// const { publicRuntimeConfig } = getConfig();
// const { API_ENDPOINT } = publicRuntimeConfig;
const API_ENDPOINT: string = process.env.API_ENDPOINT!;
// const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;
// const API_ENDPOINT = "https://api.opendota.com";

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) => state.cookies.cookies;

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const variables = {
      input: {
        email: action.payload.email,
        password: action.payload.password,
      },
    };

    const res = yield call(graphqlRequest, LOGIN_MUTATION, API_ENDPOINT, "/auth/query", variables);
    const cookies = yield select(getCookies);

    if (res.error) {
      yield put(loginError(res.error));
    } else {
      const loginResultData: ILoginResult = res.login;
      // Update cookies
      if (loginResultData.errors === undefined) {
        cookies.set(CONST_COOKIE_AUTHENTICATION_TOKEN, loginResultData.authtoken, { path: "/" });
      } else {
        cookies.remove(CONST_COOKIE_AUTHENTICATION_TOKEN, { path: "/" });
      }
      yield put(loginResult(loginResultData));

      // redirect to main page
      if (loginResultData.errors === undefined && loginResultData.authtoken !== undefined) {
        Router.push("/");
        // yield put(getUsers());
        // // yield put(getProjectsRequest());
        // yield put(getActiveUserProfileByAuthTokenRequest());
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      const result = {
        errors: err.stack!,
        isWrongEmailOrPassword: true,
      };
      yield put(loginResult(result));
      // yield put(loginError(err.stack!));
    } else {
      yield put(loginError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchLoginRequest() {
  yield takeEvery(LoginsActionTypes.LOGIN_REQUEST, handleLogin);
}

function* handleGetActiveUserProfile(action: ReturnType<typeof getActiveUserProfileByAuthTokenRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/user/profile", authToken);
    const cookies = yield select(getCookies);
    const resultData: IActiveUserProfileResult = res;
    if (res.isUnauthorized === true) {
      yield put(logout());
    } else {
      yield put(getActiveUserProfileByAuthTokenResult(resultData));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getActiveUserProfileByAuthTokenResult({ errors: err.stack! }));
    } else {
      yield put(getActiveUserProfileByAuthTokenResult({ errors: "An unknown error occured." }));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetActiveUserProfileRequest() {
  yield takeEvery(LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_REQUEST, handleGetActiveUserProfile);
}

function* handleLogout(action: ReturnType<typeof logout>) {
  try {
    const cookies = yield select(getCookies);
    if (cookies !== null && cookies !== undefined) {
      cookies.remove(CONST_COOKIE_AUTHENTICATION_TOKEN, { path: "/" });
    }
    cookie.remove(CONST_COOKIE_AUTHENTICATION_TOKEN);
    Router.push("/login");
  } catch (err) {
    // To do
    console.log("handleLogout err = ", err);
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchLogoutRequest() {
  yield takeEvery(LoginsActionTypes.LOGOUT, handleLogout);
}

function* handleSendEmailVerificationCode(action: ReturnType<typeof emailVerificationCodeRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, "post", API_ENDPOINT, "/mail/sendemailverificationcode", action.payload);

    if (res.error) {
      yield put(emailVerificationCodeError(res.error));
    } else {
      const resultData: IEmailVerificationResult = res;
      yield put(emailVerificationCodeResult(resultData));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(emailVerificationCodeError(err.stack!));
    } else {
      yield put(emailVerificationCodeError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchSendEmailVerificationCodeRequest() {
  yield takeEvery(LoginsActionTypes.EMAIL_VERIFICATION_CODE_REQUEST, handleSendEmailVerificationCode);
}

function* handleSendEmailNotificationRequest(action: ReturnType<typeof sendEmailNotificationRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/mail/sendemailnotification",
      authToken,
      action.payload,
    );

    if (res.isUnauthorized === true) {
      yield put(logout());
    } else {
      //
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(emailVerificationCodeError(err.stack!));
    } else {
      // yield put(emailVerificationCodeError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchSendEmailNotificationRequest() {
  yield takeEvery(LoginsActionTypes.SEND_EMAIL_NOTIFICATION_REQUEST, handleSendEmailNotificationRequest);
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, "put", API_ENDPOINT, "/user/register", action.payload);
    const cookies = yield select(getCookies);

    if (res.error) {
      yield put(registerError(res.error));
    } else {
      const resultData: IRegistrationResult = res;
      // // Update cookies
      // if (loginResultData.errors === undefined) {
      //   cookies.set(CONST_COOKIE_AUTHENTICATION_TOKEN, loginResultData.authtoken);
      // } else {
      //   cookies.remove(CONST_COOKIE_AUTHENTICATION_TOKEN, {path: "/"});
      // }
      yield put(registerResult(resultData));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(registerError(err.stack!));
    } else {
      yield put(registerError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchRegisterRequest() {
  yield takeEvery(LoginsActionTypes.REGISTER_REQUEST, handleRegister);
}

function* handleForgotPasswordResetCodeRequest(action: ReturnType<typeof emailVerificationCodeRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, "post", API_ENDPOINT, "/mail/sendemailverificationcode", action.payload);

    if (res.error) {
      yield put(forgotPasswordResetCodeSetError(res.error));
    } else {
      const resultData: IEmailVerificationResult = res;
      yield put(forgotPasswordResetCodeSetResult(resultData));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(forgotPasswordResetCodeSetError(err.stack!));
    } else {
      yield put(forgotPasswordResetCodeSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchForgotPasswordResetCodeRequest() {
  yield takeLatest(LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_REQUEST, handleForgotPasswordResetCodeRequest);
}

function* handleResetPasswordRequest(action: ReturnType<typeof resetPasswordRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, "post", API_ENDPOINT, "/user/resetpassword", action.payload);
    const cookies = yield select(getCookies);

    if (res.error) {
      yield put(resetPasswordSetError(res.error));
    } else {
      const resultData: IResetPasswordResult = res;
      yield put(resetPasswordSetResult(resultData));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(resetPasswordSetError(err.stack!));
    } else {
      yield put(resetPasswordSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchResetPasswordRequest() {
  yield takeEvery(LoginsActionTypes.RESET_PASSWORD_REQUEST, handleResetPasswordRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* loginsSaga() {
  yield all([
    fork(watchLoginRequest),
    fork(watchLogoutRequest),
    fork(watchSendEmailVerificationCodeRequest),
    fork(watchRegisterRequest),
    fork(watchForgotPasswordResetCodeRequest),
    fork(watchResetPasswordRequest),
    fork(watchGetActiveUserProfileRequest),
    fork(watchSendEmailNotificationRequest),
  ]);
}

export default loginsSaga;
