import {
  GET_RIVERS,
  RIVERS_ERROR,
  GET_RIVER,
  NEW_RIVER,
  DELETE_RIVERS,
  GET_RIVER_BY_ID,
  SAVE_MAP,
  ADD_COMMENT_RIVER,
  DELETE_COMMENT_RIVER,
  RIVER_COMMENT_UPDATE_LIKES,
  CHANGE_PUBLISH_STATUS,
  UPDATE_UPVOTE,
  UPDATE_DOWNVOTE,
} from '../actions/types';

const intialState = {
  rivers: [],
  userRivers: [],
  newRiver: [],
  singleRiver: {},
  riverLoading: true,
  riverSubmited: true,
  error: {},
};

export default function (state = intialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_RIVERS:
      return {
        ...state,
        rivers: payload,
        riverLoading: false,
        riverSubmited: true,
      };
    case GET_RIVER:
      return {
        ...state,
        userRivers: payload,
        riverLoading: false,
        riverSubmited: true,
      };
    case RIVERS_ERROR:
      return {
        ...state,
        error: payload,
        riverLoading: false,
        riverSubmited: true,
      };
    case NEW_RIVER:
      return {
        ...state,
        userRivers: payload,
        newRiver: payload,
        riverLoading: false,
        riverSubmited: false,
      };
    case GET_RIVER_BY_ID:
      return {
        ...state,
        singleRiver: payload,
        riverLoading: false,
      };
    case DELETE_RIVERS:
      return {
        ...state,
        userRivers: state.userRivers.filter((river) => river._id !== payload),
        riverLoading: false,
      };
    case SAVE_MAP:
      return {
        ...state,
        riverLoading: false,
      };

    case ADD_COMMENT_RIVER:
      return {
        ...state,
        singleRiver: { ...state.singleRiver, comments: payload },
        riverLoading: false,
      };

    case DELETE_COMMENT_RIVER:
      return {
        ...state,
        singleRiver: {
          ...state.singleRiver,
          comments: state.singleRiver.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        riverLoading: false,
      };
    case RIVER_COMMENT_UPDATE_LIKES:
      return {
        ...state,
        singleRiver: {
          ...state.singleRiver,
          comments: state.singleRiver.comments.map((comment) =>
            comment._id === payload.commentId
              ? { ...comment, likes: payload.likes }
              : comment
          ),
        },
        riverLoading: false,
      };
    case UPDATE_UPVOTE:
      return {
        ...state,
        singleRiver: {
          ...state.singleRiver,
          upVote: payload,
        },
        riverLoading: false,
      };

    case UPDATE_DOWNVOTE:
      return {
        ...state,
        singleRiver: {
          ...state.singleRiver,
          downVote: payload,
        },
        riverLoading: false,
      };
    case CHANGE_PUBLISH_STATUS:
      return {
        ...state,
        userRivers: payload,
        riverLoading: false,
      };
    default:
      return state;
  }
}
