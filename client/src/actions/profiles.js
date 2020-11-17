import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILES,
  GET_PROFILE,
  PROFILE_ERROR
  // CLEAR_PROFILE
} from './types';

// get all profiles
export const getProfiles = () => async dispatch => {
  // dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/profile/profiles');
    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err, status: err } });
  }
};

// get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err, status: err } });
  }
};

// create/update current user's profile
export const createUpdateProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const res = await axios.post('/api/profile', formData, config);
    dispatch({ type: GET_PROFILE, payload: res.data });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    if (!edit) {
      history.push('/single-file-upload-new');
    }
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err, status: err } });
  }
};

export const singleFileUpload = res => async dispatch => {
  try {
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err, status: err } });
  }
};
