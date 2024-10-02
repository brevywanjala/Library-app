import * as actionTypes from "./userTypes";

const storedUserInfo = localStorage.getItem('userInfo');
const INITIAL_STATE = storedUserInfo ? { user: JSON.parse(storedUserInfo) } : { user: null };


const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.USER_INFO:
      return {
        ...state,
        user: action.payload.userInfo, // Update user information with the payload received from the action
      };
    case actionTypes.LOGOUT:
        return {
          ...state,
          user: null, // Clear user information
        };
    default:
      return state; // Return the current state for unknown actions
  }
};

export default userReducer;


