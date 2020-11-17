import {
  GET_PROFILES,
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
} from '../actions/types';

const initialState = {
  profile: [],
  profiles: [],
  profileLoading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        profileLoading: false,
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        profileLoading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        profile: null,
        profileLoading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        profileLoading: true,
      };
    default:
      return state;
  }
}
