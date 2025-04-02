import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token;
};

export const getUserFromToken = () => {
  const token = getToken();

  if (!token) {
    return {message: "Please login to access", user: null}; 
  }

  try {
    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return {message: "Login is expired, please login again", user: null}; 
    }

    return {message: "Decode success", user: decodedToken}; 
  } catch (error) {
    localStorage.removeItem("token");
    return {message: "Token is invalid, please login again", user: null}; 
  }
};