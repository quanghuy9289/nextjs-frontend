/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Cookies } from "react-cookie";
import { Reducer } from "redux";
import { ILeaveRequest, ILeaveRequestDeleteInput } from "../leaverequests/types";
import { updateUserSetInput, updateUserSetResult } from "./actions";
import { IUser, IUserResult, IUsersState, UsersActionTypes } from "./types";

const initialState: IUsersState = {
  loading: false,
  loaded: false,
  result: {
    errors: undefined,
    users: [],
  },
  userMap: {},
  updateUserLoading: false,
  updateUserEdited: false,
  updateUserInput: {
    avatarBase64: "",
    email: "",
    fullname: "",
    id: "",
    nickname: "",
    roleID: "",
  },
  updateUserResult: {
    errors: undefined,
    id: undefined,
  },
  deleteUserResult: {
    errors: undefined,
    id: undefined,
  },
};

const reducer: Reducer<IUsersState> = (state = initialState, action) => {
  switch (action.type) {
    case UsersActionTypes.GET_USERS:
      return {
        ...state,
        loading: true,
      };
    case UsersActionTypes.GET_USERS_RESULT: {
      const result: IUserResult = action.payload;
      const userMap = {};
      if (result.errors === undefined) {
        result.users.map((eachUser: IUser, index: number) => {
          userMap[eachUser.id] = eachUser;
        });
      }
      return {
        ...state,
        loading: false,
        loaded: true,
        result,
        userMap,
      };
    }
    case UsersActionTypes.GET_USERS_ERROR: {
      return {
        ...state,
        loading: false,
        loaded: false,
        result: action.payload,
      };
    }
    case UsersActionTypes.UPDATE_USER_SET_INPUT: {
      const actionData: ReturnType<typeof updateUserSetInput> = {
        payload: action.payload,
        type: UsersActionTypes.UPDATE_USER_SET_INPUT,
      };
      return {
        ...state,
        updateUserEdited: _.isUndefined(actionData.payload.firstLoad)
          ? state.updateUserEdited
          : !actionData.payload.firstLoad,
        updateUserInput: actionData.payload.input,
      };
    }
    case UsersActionTypes.UPDATE_USER_REQUEST:
      return {
        ...state,
        updateUserLoading: true,
      };
    case UsersActionTypes.UPDATE_USER_SET_ERROR:
      return {
        ...state,
        updateUserLoading: false,
        updateUserResult: action.payload,
      };
    case UsersActionTypes.UPDATE_USER_SET_RESULT: {
      // const actionData: ReturnType<typeof updateUserSetResult> = {
      //   payload: action.payload,
      //   type: UsersActionTypes.UPDATE_USER_SET_RESULT,
      // };

      return {
        ...state,
        updateUserLoading: false,
        updateUserResult: action.payload,
        userMap: {
          ...state.userMap,
          [action.payload.id]: action.payload,
        },
      };
    }
    case UsersActionTypes.INSERT_OR_UPDATE_LEAVE_REQUESTS_USER: {
      const insertedLeaveRequests: ILeaveRequest[] = action.payload.leaveRequests;
      const requesterUserID: string = action.payload.requesterUserID;
      const addToTop: boolean = action.payload.addToTop;
      const theUser = state.userMap[requesterUserID];
      if (!_.isUndefined(theUser)) {
        let currentLeaveRequests = theUser.leaveRequests;
        if (currentLeaveRequests === undefined) {
          currentLeaveRequests = [];
        }

        if (addToTop) {
          return {
            ...state,
            userMap: {
              ...state.userMap,
              [requesterUserID]: {
                ...theUser,
                leaveRequests: [...insertedLeaveRequests, ...currentLeaveRequests],
              },
            },
            updateUserInput: {
              ...state.updateUserInput,
              leaveRequests: [...insertedLeaveRequests, ...currentLeaveRequests],
            },
          };
        } else {
          return {
            ...state,
            userMap: {
              ...state.userMap,
              [theUser.id]: {
                ...theUser,
                leaveRequests: [...currentLeaveRequests, ...insertedLeaveRequests],
              },
            },
            updateUserInput: {
              ...state.updateUserInput,
              leaveRequests: [...currentLeaveRequests, ...insertedLeaveRequests],
            },
          };
        }
      }
      return state;
    }
    case UsersActionTypes.DELETE_LEAVE_REQUEST_FOR_USER: {
      const input: ILeaveRequestDeleteInput = action.payload;
      const requesterUserID: string = action.payload.requesterUserID;
      const theUser = state.userMap[requesterUserID];
      if (!_.isUndefined(theUser) && !_.isUndefined(theUser.leaveRequests)) {
        const leaveRequests: ILeaveRequest[] = theUser.leaveRequests;
        _.remove(leaveRequests, (eachLeaveRequest: ILeaveRequest) => {
          return eachLeaveRequest.id === input.id;
        });

        return {
          ...state,
          userMap: {
            ...state.userMap,
            [theUser.id]: {
              ...theUser,
              leaveRequests,
            },
          },
          updateUserInput: {
            ...state.updateUserInput,
            leaveRequests,
          },
        };
      }
      return state;
    }
    case UsersActionTypes.CREATE_USER_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case UsersActionTypes.CREATE_USER_SET_RESULT: {
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
    }
    case UsersActionTypes.CREATE_USER_SET_ERROR: {
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
    }
    case UsersActionTypes.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UsersActionTypes.DELETE_USER_SET_ERROR:
      return {
        ...state,
        loading: false,
        deleteUserResult: action.payload,
      };
    case UsersActionTypes.DELETE_USER_SET_RESULT: {
      // const actionData: ReturnType<typeof updateUserSetResult> = {
      //   payload: action.payload,
      //   type: UsersActionTypes.UPDATE_USER_SET_RESULT,
      // };

      const userMap = {};
      _.values(state.userMap).map((eachUser: IUser, index: number) => {
        if (eachUser.id !== action.payload.id) {
          userMap[eachUser.id] = eachUser;
        }
      });

      return {
        ...state,
        loading: false,
        deleteUserResult: action.payload,
        userMap,
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as usersReducer };
