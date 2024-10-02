import { combineReducers } from "redux";

import userReducer from "./Users/UserReducer";
const rootReducer =combineReducers({
 user :userReducer,
})

export default rootReducer
