/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Cookies } from "react-cookie";
import { Reducer } from "redux";
import { setUserConfigCollapsedColumn } from "./actions";
import {
  IActiveUserProfileResult,
  IEmailVerificationResult,
  ILoginResult,
  ILoginsState,
  IUserConfig,
  LoginsActionTypes,
} from "./types";

const initialState: ILoginsState = {
  // Logins
  result: {
    authtoken: undefined,
    errors: undefined,
  },
  loginValidation: {},
  input: {
    email: "",
    password: "",
    rememberMe: false,
  },
  loading: false,
  // Profile
  activeUserProfile: {
    id: "",
    fullname: "",
    nickname: "",
    avatarBase64: "",
    email: "",
    roleID: "",
  },
  activeUserProfileResult: {
    errors: undefined,
    profile: undefined,
  },
  activeUserProfileLoading: false,
  // Get verification code
  emailVerificationCodeInput: {
    email: "",
  },
  emailVerificationCodeLoading: false,
  emailVerificationCodeSent: false,
  emailVerificationCodeResult: {
    errors: undefined,
  },
  // Get forget password reset code
  isForgotPassword: false,
  forgotPasswordResetCodeInput: {
    email: "",
  },
  forgotPasswordResetCodeLoading: false,
  forgotPasswordResetCodeSent: false,
  forgotPasswordResetCodeResult: {
    errors: undefined,
  },
  // Registration
  registrationValidation: {},
  registrationInput: {
    email: "",
    emailverificationcode: "",
    fullname: "",
    nickname: "",
    password: "",
    retypepassword: "",
    role: undefined,
    avatarBase64: "",
  },
  registrationResult: {
    id: undefined,
    errors: undefined,
  },
  registrationLoading: false,
  // Reset password
  resetPasswordValidation: {},
  resetPasswordLoading: false,
  resetPasswordInput: {
    email: "",
    newpassword: "",
    resetcode: "",
    retypenewpassword: "",
  },
  resetPasswordResult: {
    isSuccess: undefined,
    errors: undefined,
    isInvalidResetCode: undefined,
  },
};

const reducer: Reducer<ILoginsState> = (state = initialState, action) => {
  switch (action.type) {
    case LoginsActionTypes.SET_LOGIN_INPUT:
      return {
        ...state,
        input: action.payload,
        resetPasswordInput: {
          // Also update the email for reset password input
          ...state.resetPasswordInput,
          ...action.payload,
        },
      };
    case LoginsActionTypes.SET_LOGIN_VALIDATION:
      return {
        ...state,
        loginValidation: {
          ...state.loginValidation,
          ...action.payload,
        },
      };
    case LoginsActionTypes.LOGIN_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case LoginsActionTypes.LOGIN_RESULT: {
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
    }
    case LoginsActionTypes.LOGIN_ERROR: {
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
    }
    case LoginsActionTypes.LOGOUT: {
      return {
        ...state,
        result: {
          errors: undefined,
          authtoken: undefined,
        },
      };
    }
    case LoginsActionTypes.REGISTER_REQUEST: {
      return {
        ...state,
        registrationLoading: true,
      };
    }
    case LoginsActionTypes.REGISTER_RESULT: {
      return {
        ...state,
        registrationLoading: false,
        registrationResult: action.payload,
      };
    }
    case LoginsActionTypes.REGISTER_ERROR: {
      return {
        ...state,
        registrationLoading: false,
        registrationResult: action.payload,
      };
    }
    case LoginsActionTypes.SET_REGISTRATION_VALIDATION:
      return {
        ...state,
        registrationValidation: {
          ...state.registrationValidation,
          ...action.payload,
        },
      };
    case LoginsActionTypes.SET_REGISTRATION_INPUT: {
      return {
        ...state,
        registrationInput: action.payload,
      };
    }
    case LoginsActionTypes.SET_EMAIL_VERIFICATION_CODE_INPUT: {
      return {
        ...state,
        emailVerificationCodeInput: action.payload,
      };
    }
    case LoginsActionTypes.EMAIL_VERIFICATION_CODE_REQUEST:
      return {
        ...state,
        emailVerificationCodeLoading: true,
      };
    case LoginsActionTypes.EMAIL_VERIFICATION_CODE_RESULT:
      const emailVerificationCodeResult: IEmailVerificationResult = action.payload;
      let emailVerificationCodeSent: boolean = false;
      if (emailVerificationCodeResult.errors === undefined) {
        emailVerificationCodeSent = true;
      }
      return {
        ...state,
        emailVerificationCodeLoading: false,
        emailVerificationCodeResult,
        emailVerificationCodeSent,
      };
    case LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_REQUEST: {
      return {
        ...state,
        activeUserProfileLoading: true,
      };
    }
    case LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_RESULT: {
      const result: IActiveUserProfileResult = action.payload;
      let activeUserProfile = initialState.activeUserProfile;
      if (result.errors === undefined && result.profile !== undefined) {
        activeUserProfile = result.profile;
      }

      return {
        ...state,
        activeUserProfileLoading: false,
        activeUserProfileResult: action.payload,
        activeUserProfile,
      };
    }
    case LoginsActionTypes.GET_ACTIVE_USER_PROFILE_BY_AUTH_TOKEN_ERROR: {
      return {
        ...state,
        activeUserProfileLoading: false,
        activeUserProfileResult: action.payload,
      };
    }
    case LoginsActionTypes.SET_IS_FORGOT_PASSWORD: {
      return {
        ...state,
        isForgotPassword: action.payload,
        resetPasswordResult: {
          errors: undefined,
          isInvalidResetCode: undefined,
          isSuccess: undefined,
        },
      };
    }
    case LoginsActionTypes.SET_RESET_PASSWORD_VALIDATION: {
      return {
        ...state,
        resetPasswordValidation: {
          ...state.resetPasswordValidation,
          ...action.payload,
        },
      };
    }
    case LoginsActionTypes.RESET_PASSWORD_SET_INPUT: {
      return {
        ...state,
        resetPasswordInput: action.payload,
        resetPasswordResult: {
          errors: undefined,
          isInvalidResetCode: undefined,
          isSuccess: undefined,
        },
      };
    }
    case LoginsActionTypes.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordLoading: true,
      };
    case LoginsActionTypes.RESET_PASSWORD_SET_RESULT:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordResult: action.payload,
      };
    case LoginsActionTypes.RESET_PASSWORD_SET_ERROR:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordResult: action.payload,
      };
    case LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_INPUT: {
      return {
        ...state,
        forgotPasswordResetCodeInput: action.payload,
      };
    }
    case LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_REQUEST:
      return {
        ...state,
        forgotPasswordResetCodeLoading: true,
      };
    case LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_RESULT:
      const forgotPasswordResetCodeResult: IEmailVerificationResult = action.payload;
      let forgotPasswordResetCodeSent: boolean = false;
      if (forgotPasswordResetCodeResult.errors === undefined) {
        forgotPasswordResetCodeSent = true;
      }
      return {
        ...state,
        forgotPasswordResetCodeLoading: false,
        forgotPasswordResetCodeResult,
        forgotPasswordResetCodeSent,
      };
    case LoginsActionTypes.FORGOT_PASSWORD_RESET_CODE_SET_ERROR:
      return {
        ...state,
        forgotPasswordResetCodeLoading: false,
        forgotPasswordResetCodeResult: action.payload,
      };
    case LoginsActionTypes.SET_USER_CONFIG_COLLAPSED_COLUMN: {
      const actionData: ReturnType<typeof setUserConfigCollapsedColumn> = {
        payload: action.payload,
        type: LoginsActionTypes.SET_USER_CONFIG_COLLAPSED_COLUMN,
      };

      let config: IUserConfig | undefined = state.activeUserProfile.config;
      if (config === undefined) {
        config = {
          collapsedColumns: {
            [actionData.payload.columnID]: actionData.payload.collapsed,
          },
        };
      } else {
        if (config.collapsedColumns === undefined) {
          config.collapsedColumns = {};
        }
        config.collapsedColumns[actionData.payload.columnID] = actionData.payload.collapsed;
      }

      return {
        ...state,
        activeUserProfile: {
          ...state.activeUserProfile,
          config,
        },
      };
    }
    case LoginsActionTypes.SEND_EMAIL_NOTIFICATION_REQUEST:
    default: {
      return state;
    }
  }
};

export { reducer as loginsReducer };
