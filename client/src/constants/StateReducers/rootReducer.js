// rootReducer.js

import { combineReducers } from 'redux';

import setUserInfo from './UserStateReducer';


const rootReducer = combineReducers({
  userInfo: setUserInfo,
  // other reducers...
});

export default rootReducer;
