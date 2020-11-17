import axios from 'axios';
import {
  ADMIN_APPLICATION_SUBMIT,
  GET_APPLICATION_STATUS,
  ADMIN_APPLICATION_ERROR,
  CONFIRM_EMAIL,
} from './types';

import { loadUser, login } from './auth';

import { setAlert } from './alert';

// user role is set in ./auth loadUser

// confirm email
export const confirmEmail = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  const { email, password } = formData;
  try {
    const res = await axios.put('/api/users/confirm-email', formData, config);
    dispatch({ type: CONFIRM_EMAIL, payload: res.data });
    dispatch(login({ email, password }));
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: ADMIN_APPLICATION_ERROR,
      payload: { msg: err, status: err },
    });
  }
};

// get user applicationStatus
export const getApplicationStatus = (user) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/master-admin/get-application-status/${user._id}`
    );
    dispatch({ type: GET_APPLICATION_STATUS, payload: res.data });
  } catch (err) {
    dispatch({
      type: ADMIN_APPLICATION_ERROR,
      payload: { msg: err, status: err },
    });
  }
};

// submit application
export const submitApplicaiton = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      '/api/master-admin/admin-apply',
      formData,
      config
    );

    dispatch({ type: ADMIN_APPLICATION_SUBMIT, payload: res.data });
  } catch (err) {
    dispatch({
      type: ADMIN_APPLICATION_ERROR,
      payload: { msg: err, status: err },
    });
  }
};
