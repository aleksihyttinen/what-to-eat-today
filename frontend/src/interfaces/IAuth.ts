import IUser from "./IUser";

export default interface IAuth {
  authenticated: boolean;
  authFailed: boolean;
  signin: ({ userName, userPassword }: IUser) => void;
  signup: ({ userName, userPassword }: IUser) => void;
  signout: () => any;
}
