import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

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

const masterDataManagementInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_MASTER_DATA_MANAGEMENT,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(`token${appName}`)}`,
    "Api-Key": import.meta.env.VITE_API_KEY || null,
  },
});

// Request interceptor
masterDataManagementInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(`token${appName}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
masterDataManagementInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    const errorMessage = handleError(error);
    toast("An Error Occurred", {
      duration: 5000,
      description: (
        <div className="text-sm text-muted-foreground">{errorMessage}</div>
      ),
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
    return Promise.reject(errorMessage);
  }
);

export default masterDataManagementInstance;
