import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  CREATE_POST,
  DELETE_POST,
  POST_ERROR,
  GET_POST,
  UPDATE_LIKES,
  ADD_COMMENT,
  REMOVE_COMMENT
} from '../actions/types';

// get all posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/post/all-posts');
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({ type: POST_ERROR, payload: { msg: err, status: err } });
  }
};

// Create post
export const createPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  try {
    const res = await axios.post('/api/post/create-post', formData, config);
    dispatch({
      type: CREATE_POST,
      payload: res.data
    });
    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.name }
    });
  }
};

// Get post and comments by post :id
export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/post/comment/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.message }
    });
  }
};

// Delete post
export const deletePost = postId => async dispatch => {
  console.log(postId);
  try {
    await axios.delete(`/api/post/${postId}`);

    dispatch({
      type: DELETE_POST,
      payload: postId
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Add like
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Remove like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/post/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Add comment

export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.put(
      `/api/post/comment/${postId}`,
      formData,
      config
    );
    dispatch({ type: ADD_COMMENT, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/post/comment/${postId}/${commentId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};
