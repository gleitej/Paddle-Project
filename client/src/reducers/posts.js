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

const initailState = {
  posts: [],
  post: [],
  postLoading: true,
  error: {}
};

export default function(state = initailState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        postLoading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        postLoading: false
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        postLoading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        postLoading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        postLoading: false
      };
    case POST_ERROR:
      return {
        ...state,
        postLoading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };
    default:
      return state;
  }
}
