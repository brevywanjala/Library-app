const initialState = {
    userInfo: null,
  };
  
// UserStateReducer.js
const setUserInfo = (state = initialState, action) => {
    console.log(action.payload,"state")
    console.log("action",action.type)
    switch (action.type) {
      case 'SET_USER_INFO':
        return {
          ...state,
          userInfo: action.payload, // Access the user info payload from the action
        };
      default:
        return state;
    }
  };
  
  
  export default setUserInfo;
  