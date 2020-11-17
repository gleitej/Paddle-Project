import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_KEY,
  RESET_PASSWORD,
  CHECK_TOKEN_STATUS,
} from '../actions/types';

const initailState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  authLoading: true,
  user: null,
  key: null,
  reset: false,
  tokenStatus: null,
};

export default function (state = initailState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        authLoading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);

      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        authLoading: false,
      };
    case GET_KEY:
      return {
        ...state,
        key: payload,
        authLoading: false,
      };
    case RESET_PASSWORD:
      return {
        ...state,
        reset: payload,
        authLoading: false,
      };
    case CHECK_TOKEN_STATUS:
      return {
        ...state,
        tokenStatus: payload,
        authLoading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        authLoading: false,
        user: null,
      };
    default:
      return { ...state };
  }
}
