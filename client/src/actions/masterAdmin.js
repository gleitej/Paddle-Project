import axios from 'axios';
import {
  MASTER_ADMIN_ERROR,
  APPLICATION_GET_PENDING,
  CHANGE_USER_STATUS,
  APPLICATION_GET_APPROVED,
} from './types';

// get all pending applications
export const getPendingApplications = () => async (dispatch) => {
  try {
    const res = await axios.get(
      '/api/master-admin/get-all-pending-applications'
    );
    dispatch({ type: APPLICATION_GET_PENDING, payload: res.data });
  } catch (err) {
    dispatch({
      type: MASTER_ADMIN_ERROR,
      payload: { msg: err.message, status: err },
    });
  }
};

// get all approved applicatoins
export const getApprovedApplications = () => async (dispatch) => {
  try {
    const res = await axios.get(
      '/api/master-admin/get-all-approved-applications'
    );
    dispatch({ type: APPLICATION_GET_APPROVED, payload: res.data });
  } catch (err) {
    dispatch({
      type: MASTER_ADMIN_ERROR,
      payload: { msg: err.message, status: err },
    });
  }
};

// change user status
export const changeStatus = (newRole, userId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.put(
      `/api/master-admin/change-status/${userId}`,
      { newStatus: newRole },
      config
    );
    dispatch({ type: CHANGE_USER_STATUS, payload: res.data });
  } catch (err) {
    dispatch({
      type: MASTER_ADMIN_ERROR,
      payload: { msg: err.message, status: err },
    });
  }
};
