import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profiles from './profiles';
import posts from './posts';
import rivers from './rivers';
import userRole from './userRole';
import masterAdmin from './masterAdmin';

export default combineReducers({
  alert,
  auth,
  profiles,
  posts,
  rivers,
  userRole,
  masterAdmin,
});
