import { getType } from "typesafe-actions";
import * as actions from "../actions";
import {
  initEntityState,
  entityLoadingStarted,
  entityLoadingSucceeded,
  entityLoadingFailed,
} from "../utils";

export const defaultState = {
  accessToken: initEntityState(null),
  authInfo: initEntityState(null),
  authStatus: false,
  myBalance: 0,
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    case getType(actions.getAccessToken.request):
      return {
        ...state,
        accessToken: entityLoadingStarted(state.accessToken, action.payload),
      };
    case getType(actions.getAccessToken.success):
      return {
        ...state,
        accessToken: entityLoadingSucceeded(state.accessToken, action.payload),
      };
    case getType(actions.getAccessToken.failure):
      return { ...state, accessToken: entityLoadingFailed(state.accessToken) };

    case getType(actions.getAuthInfo.request):
      return {
        ...state,
        authInfo: entityLoadingStarted(state.authInfo, action.payload),
      };
    case getType(actions.getAuthInfo.success):
      return {
        ...state,
        authInfo: entityLoadingSucceeded(state.authInfo, action.payload),
      };
    case getType(actions.getAuthInfo.failure):
      return {
        ...state,
        authInfo: entityLoadingFailed(state.auth),
      };
    case getType(actions.setAuthStatus.success):
      return {
        ...state,
        authStatus: true,
      };
    case getType(actions.setAuthStatus.failure):
      return {
        ...state,
        authStatus: false,
      };

    case getType(actions.getMyBalance):
      return {
        ...state,
        myBalance: action.payload,
      };

    default:
      return state;
  }
};

export default states;
