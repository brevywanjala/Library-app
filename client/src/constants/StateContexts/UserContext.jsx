import React, { createContext, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component
const UserProvider = ({ children }) => {

  // State to store user info
  const [userInfo, setUserInfo] = useState(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
      
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
