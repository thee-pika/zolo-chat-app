import { isValidUsername , isValidEmail} from "6pp";

export const UsernameValidator = (username: string) => {
  console.log("username", username);
  if (!isValidUsername(username)) {
    return {
      isValid: false,
      errorMessage: "username is not valid",
    };
  }
};

export const EmailValidator = (email: string) => {
  console.log("emailllllllllll", email);
  if (!isValidEmail(email)) {
    return {
      isValid: false,
      errorMessage: "email is not valid",
    };
  }
};
