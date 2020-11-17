import {
  MASTER_ADMIN_ERROR,
  APPLICATION_GET_PENDING,
  APPLICATION_GET_APPROVED,
  CHANGE_USER_STATUS,
  UPDATE_ADMIN,
} from '../actions/types';

const initailState = {
  approvedApplications: [],
  pendingApplications: [],
  masterAdminLoading: true,
  error: {},
};

export default function (state = initailState, action) {
  const { type, payload } = action;
  switch (type) {
    case APPLICATION_GET_PENDING:
      return {
        ...state,
        pendingApplications: payload,
        masterAdminLoading: false,
      };

    case APPLICATION_GET_APPROVED:
      return {
        ...state,
        approvedApplications: payload,
        masterAdminLoading: false,
      };
    case CHANGE_USER_STATUS:
      return {
        ...state,
        masterAdminLoading: false,
      };
    case UPDATE_ADMIN:
      return {
        ...state,
        approvedApplications: [...state.approvedApplications, { payload }],
        masterAdminLoading: false,
      };
    case MASTER_ADMIN_ERROR:
      return {
        ...state,
        error: payload,
        masterAdminLoading: false,
      };

    default:
      return state;
  }
}
