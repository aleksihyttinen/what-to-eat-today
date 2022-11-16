import axios from "axios";
import { useState, useContext, createContext } from "react";
import IAuth from "../interfaces/IAuth";
import IUser from "../interfaces/IUser";

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
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  const [signupSuccessful, setSignupSuccessful]  = useState<boolean>(false);

  const signin = ({ userName, userPassword }: IUser) => {
    axios
      .post("https://what-to-eat-today.azurewebsites.net/login", {
        name: userName,
        password: userPassword,
      })
      .then((response) => {
        console.log(response.data.msg);
        if (response.data.msg === "Authenticated") {
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
        setSignupSuccessful(true);
      }).catch((err) => {
        console.log(err);
        setAuthFailed(true);
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
    signupSuccessful,
    signin,
    signup,
    signout,
  };
}
