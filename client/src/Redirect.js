// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Library from './Library/Library';
import { UserProvider } from './constants/StateContexts/UserContext';




function Redirect() {
  const [userInfo, setUserInfo] = useState(null);
  console.log("user info fethed",userInfo)
  return (
    <Router>

    <UserProvider>

        <Routes>
          <Route path="/" element={<Library
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          />} />

        </Routes>
      
    </UserProvider>
    </Router>
  );
}

export default Redirect;
