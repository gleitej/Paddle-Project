import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  ADMIN_SET_ROLE,
  ADMIN_CLEAR_ROLE,
  GET_KEY,
  RESET_PASSWORD,
  CHECK_TOKEN_STATUS,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });

    // sets user role ./userRole

    dispatch({
      type: ADMIN_SET_ROLE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users/register', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// get key
export const getKey = (keyId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/confirm-email/get-key/${keyId}`);
    dispatch({ type: GET_KEY, payload: res.data });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: ADMIN_CLEAR_ROLE });
  dispatch({ type: LOGOUT });
};

// send password reset link
export const sendPasswordResetLink = ({ email }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    await axios.post('/api/users/forgot', body, config);
    dispatch({ type: RESET_PASSWORD, payload: true });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// reset password
export const resetPassword = ({ email, password, token }) => async (
  dispatch
) => {
  const body = JSON.stringify({ email, password });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(`/api/users/reset/${token}`, body, config);
    dispatch(setAlert(res.data.msg, res.data.color));
    dispatch({ type: RESET_PASSWORD, payload: res.data.status });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// check token status
export const checkTokenStatus = (token) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/token-status/${token}`);
    dispatch({ type: CHECK_TOKEN_STATUS, payload: res.data });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
