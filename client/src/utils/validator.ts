// import {isValidUsername} from "6pp";

export const UsernameValidator = (username: string) => {
  if (username)
    return {
      isValid: false,
      errorMessage: "username is not valid",
    };
};
