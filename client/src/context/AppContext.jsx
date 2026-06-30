import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../util/Constants.js";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = AppConstants.BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(backendUrl + "/profile");
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        toast.error("Unable to retrive profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const response = await axios.get(backendUrl + "/is-authenticated");
      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
