import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";
interface IUser {
  userEmail: string;
  userPassword: string;
}
interface IAuth {
  authenticated: boolean;
  authFailed: boolean;
  signin: ({ userEmail, userPassword }: IUser) => void;
  signup: ({ userEmail, userPassword }: IUser) => void;
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

  const signin = ({ userEmail, userPassword }: IUser) => {
    axios
      .post("http://localhost:8080/login", {
        email: userEmail,
        password: userPassword,
      })
      .then((response) => {
        console.log(response);
        response.data == "Authenticated"
          ? setAuthenticated(true)
          : setAuthFailed(true);
      })
      .catch((err) => {
        console.log(err);
        setAuthFailed(true);
      });
  };
  const signup = ({ userEmail, userPassword }: IUser) => {
    axios
      .post("http://localhost:8080/register", {
        email: userEmail,
        password: userPassword,
      })
      .then((response) => {
        console.log(response);
      });
  };
  const signout = () => {
    setAuthenticated(false);
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
