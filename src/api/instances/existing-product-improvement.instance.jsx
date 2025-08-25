import axios from "axios";
import Cookies from "js-cookie";

const env = import.meta.env.MODE;
const appName =
  import.meta.env.VITE_APP_NAME +
  (env === "master" ? "" : env.charAt(0).toUpperCase() + env.slice(1));
  
const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      return "Unauthorized access. Please login.";
    } else if (status === 403) {
      return "Access forbidden.";
    } else if (status === 404) {
      return "Resource not found.";
    } else if (status >= 500) {
      return "Server error. Please try again later.";
    } else {
      return data.message || "An error occurred.";
    }
  } else if (error.request) {
    return "No response from server. Check your network.";
  } else {
    return "Request setup error: " + error.message;
  }
};

const existingProductImprovementInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_EXISTING_PRODUCT_IMPROVEMENT,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get(`token${appName}`)}`,
    "Api-Key": import.meta.env.VITE_API_KEY || null,
  },
});

// Request interceptor
existingProductImprovementInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(`token${appName}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
existingProductImprovementInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    const errorMessage = handleError(error);
    return Promise.reject(errorMessage);
  }
);

export default existingProductImprovementInstance;
