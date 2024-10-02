import * as actionTypes from "./userTypes"

export const User =(userInfo) =>{
    console.log("Dispatching User action with userInfo:", userInfo);
    return{
        type:actionTypes.USER_INFO,
        payload :{
            userInfo
            
        }
    }
}
export const logout = () => {
    localStorage.removeItem('userInfo'); // Clear user info from local storage
    return {
      type: actionTypes.LOGOUT,
    };
  };