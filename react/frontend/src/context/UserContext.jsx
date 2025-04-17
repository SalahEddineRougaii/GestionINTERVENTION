import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userContext, setUserContext] = useState(null);

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUserContext(null);
  };

  return (
    <UserContext.Provider value={{ user: userContext, setUserContext, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
