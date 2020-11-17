import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_RIVERS,
  RIVERS_ERROR,
  GET_RIVER,
  NEW_RIVER,
  RIVER_PHOTOS,
  DELETE_RIVERS,
  GET_RIVER_BY_ID,
  DELETE_SINGLE_PHOTO,
  UPDATE_ADD_PHOTOS,
  SAVE_MAP,
  ADD_COMMENT_RIVER,
  DELETE_COMMENT_RIVER,
  RIVER_COMMENT_UPDATE_LIKES,
  CHANGE_PUBLISH_STATUS,
  UPDATE_DOWNVOTE,
  UPDATE_UPVOTE,
} from './types';

// Get all rivers
export const getRivers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/river/get-all');
    dispatch({
      type: GET_RIVERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// get all rivers created by specific user
export const getRiver = (userObj) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/river/user/${userObj._id}`);
    dispatch({ type: GET_RIVER, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// Get river by id
export const getRiverById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/river/get-one/${id}`);
    dispatch({ type: GET_RIVER_BY_ID, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// create/update new river
export const newRiver = (formData, history, edit = false) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/river/create-river', formData, config);
    const nId = res.data._id.toString();
    // for dev purposes only
    if (nId === undefined) {
      console.error('race time error in /actions/rivers NewRiver');
    }
    dispatch({ type: NEW_RIVER, payload: res.data });
    dispatch(setAlert(edit ? 'River Updated' : 'River Created', 'success'));
    if (!edit) {
      history.push(`/add-river-photos/${nId}`);
    }
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// Upload river photos
export const uploadPhotos = (photos, id) => async (dispatch) => {
  try {
    const res = await axios.post(`file-upload/${id}`, photos);
    dispatch({ type: RIVER_PHOTOS, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// Delete river
export const deleteRiver = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/river/${id}`);
    dispatch({ type: DELETE_RIVERS, payload: id });
    dispatch(setAlert('River deleted', 'danger'));
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// Delete single photo
export const deleteSinglePhoto = (riverId, index) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/river/delete-photo/${riverId}/${index}`
    );
    dispatch({ type: DELETE_SINGLE_PHOTO, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// Update photos
// note majority of logic takes place in component to accomedate loading progress bar
export const updateAddPhotos = (res) => (dispatch) => {
  // NOTE: find definition of error object
  // if (res.data === error) {
  //   dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  // }
  dispatch({ type: UPDATE_ADD_PHOTOS, payload: res.data });
};

export const saveMap = (formData, id) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      `/api/river/create-google-maps/${id}`,
      formData,
      config
    );
    dispatch({ type: SAVE_MAP, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// add comment
export const addCommentRiver = (riverId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.put(
      `/api/river/comment/${riverId}`,
      formData,
      config
    );
    dispatch({ type: ADD_COMMENT_RIVER, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// delete comment
export const deleteCommentRiver = (river_id, comment_id) => async (
  dispatch
) => {
  try {
    await axios.delete(`/api/river/comment/${river_id}/${comment_id}`);
    dispatch({
      type: DELETE_COMMENT_RIVER,
      payload: comment_id,
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// add like
export const addLike = (commentId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/like/${commentId}`);
    dispatch({
      type: RIVER_COMMENT_UPDATE_LIKES,
      payload: { commentId, likes: res.data },
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// remove like
export const removeLike = (commentId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/unlike/${commentId}`);
    dispatch({
      type: RIVER_COMMENT_UPDATE_LIKES,
      payload: { commentId, likes: res.data },
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// change publish status
export const changePublishStatus = (riverId, userId) => async (dispatch) => {
  try {
    await axios.put(`/api/river/publish-status/${riverId}`);

    const res = await axios.get(`/api/river/user/${userId}`);

    dispatch({ type: CHANGE_PUBLISH_STATUS, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// add upvote
export const addUpvote = (riverId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/add-upvote/${riverId}`);
    dispatch({ type: UPDATE_UPVOTE, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// remove upvote
export const removeUpvote = (riverId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/remove-upvote/${riverId}`);
    dispatch({ type: UPDATE_UPVOTE, payload: res.data });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};
// add downvote
export const addDownvote = (riverId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/add-downvote/${riverId}`);
    dispatch({
      type: UPDATE_DOWNVOTE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};

// remove downvote
export const removeDownvote = (riverId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/river/remove-downvote/${riverId}`);
    dispatch({
      type: UPDATE_DOWNVOTE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: RIVERS_ERROR, payload: { msg: err, status: err } });
  }
};
