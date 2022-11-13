import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";
interface IUser {
  userName: string;
  userPassword: string;
}
interface IAuth {
  authenticated: boolean;
  authFailed: boolean;
  signin: ({ userName, userPassword }: IUser) => void;
  signup: ({ userName, userPassword }: IUser) => void;
  signout: () => any;
}
const authContext = createContext<IAuth | null>(null);
export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  const signin = ({ userName, userPassword }: IUser) => {
    axios
      .post("https://what-to-eat-today.azurewebsites.net/login", {
        name: userName,
        password: userPassword,
      })
      .then((response) => {
        console.log(response);
        if (response.data.msg == "Authenticated") {
          setAuthenticated(true);
          localStorage.setItem("user", response.data.accessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
        } else {
          setAuthFailed(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAuthFailed(true);
      });
  };
  const signup = ({ userName, userPassword }: IUser) => {
    axios
      .post("https://what-to-eat-today.azurewebsites.net/register", {
        name: userName,
        password: userPassword,
      })
      .then((response) => {
        console.log(response);
      });
  };
  const signout = () => {
    setAuthenticated(false);
    localStorage.clear();
  };
  // Return the user object and auth methods
  return {
    authenticated,
    authFailed,
    signin,
    signup,
    signout,
  };
}