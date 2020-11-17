import {
  ADMIN_APPLICATION_ERROR,
  ADMIN_APPLICATION_SUBMIT,
  ADMIN_SET_ROLE,
  ADMIN_CLEAR_ROLE,
  GET_APPLICATION_STATUS,
  CLEAR_USER_ROLE,
  CONFIRM_EMAIL,
} from '../actions/types';

const initailState = {
  role: 'guest',
  applicationStatus: 'applicationNoSubmit',
  userRoleLoading: true,
  error: {},
};

export default function (state = initailState, action) {
  const { type, payload } = action;
  switch (type) {
    // dispatched in ../actions/auth loadUser
    case ADMIN_SET_ROLE:
      return {
        ...state,
        role: payload.role,
        userRoleLoading: false,
      };
    // idk if this is correct
    case CONFIRM_EMAIL:
      return {
        ...state,
        role: payload,
        userRoleLoading: false,
      };
    case ADMIN_APPLICATION_SUBMIT:
    case GET_APPLICATION_STATUS:
      return {
        ...state,
        applicationStatus: payload,
        userRoleLoading: false,
      };
    // dispatched in ../actions/auth.js - logout
    case ADMIN_CLEAR_ROLE:
      return {
        ...state,
        role: 'guest',
        userRoleLoading: false,
      };
    case CLEAR_USER_ROLE:
      return {
        ...state,
        role: 'guest',
        applicationStatus: 'applicationNoSubmit',
        userRoleLoading: false,
        error: {},
      };

    case ADMIN_APPLICATION_ERROR:
      return {
        ...state,
        error: payload,
        userRoleLoading: false,
      };
    default:
      return state;
  }
}
