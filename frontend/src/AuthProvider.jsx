import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '',
    userType: '',
    token: '',
  });

  useEffect(() => {
    // Check session storage on component mount
    const storedToken = sessionStorage.getItem('token' | "");
    const storedUserId = sessionStorage.getItem('userId' | "") ;
    const storedUserType = sessionStorage.getItem('userType' | "") ;

    if (storedToken && storedUserId && storedUserType) {
      setUser({
        userId: storedUserId,
        userType: storedUserType,
        token: storedToken,
      });
    }
  }, []);


  // Individual setter functions
  const setUserId = (newUserId) => {
    setUser((prevUser) => ({ ...prevUser, userId: newUserId }));
    sessionStorage.setItem('userId', newUserId);
  };

  const setUserType = (newUserType) => {
    setUser((prevUser) => ({ ...prevUser, userType: newUserType }));
    sessionStorage.setItem('userType', newUserType);
  };

  const setToken = (newToken) => {
    setUser((prevUser) => ({ ...prevUser, token: newToken }));
    sessionStorage.setItem('token', newToken);
  };

    const clearUser = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userType');
        setUser({ userId: '', userType: '', token: '' });
    }

  const value = { user, setUserId, setUserType, setToken, clearUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };