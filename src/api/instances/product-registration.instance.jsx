import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
import { toast } from "sonner";
import { useUIStore } from "@/stores/uiStore";
import { Button, Table } from "@/components/Dexain";

const env = import.meta.env.MODE;
const appName =
  import.meta.env.VITE_APP_NAME +
  (env === "master" ? "" : env.charAt(0).toUpperCase() + env.slice(1));
  
const handleError = (error) => {
  // Handle response errors with detailed messages
  if (error.response) {
    const { status, data } = error.response;

    // Authentication errors
    if (status === 401) {
      return "Your session has expired. Please log in again to continue.";
    }
    // Authorization errors
    else if (status === 403) {
      return "You don't have permission to access this resource. Please contact your administrator.";
    }
    // Not found errors
    else if (status === 404) {
      return "The requested resource could not be found. Please check the URL and try again.";
    }
    // Validation errors
    else if (status === 422) {
      const validationErrors = data.errors || {};
      const errorMessages = Object.values(validationErrors).flat();
      return `Validation failed: ${errorMessages.join(", ")}`;
    }
    // Server errors
    else if (status >= 500) {
      return "Internal Server Error";
    }
    // Other response errors
    else {
      return data.message || "Something went wrong. Please try again.";
    }
  }
  // Network errors
  else if (error.request) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }
  // Request configuration errors
  else {
    return `Unable to process your request: ${error.message}. Please try again or contact support if the problem persists.`;
  }
};

// Create a function to get the UI store
const getUIStore = () => useUIStore.getState();

const productRegistrationInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_PRODUCT_REGISTRATION,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(`token${appName}`)}`,
    "Api-Key": import.meta.env.VITE_API_KEY || null,
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// Request interceptor
productRegistrationInstance.interceptors.request.use(
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
productRegistrationInstance.interceptors.response.use(
  (response) => {
    if (response?.data) {
      const { success, data, message } = response.data;
      console.log("masuk instance")

      if (success) {
        return data;
      } else {
        // Use UI store to show error
        const { openModal, closeModal, openConfirmationModal } = getUIStore();

        if (data?.length > 0) {
          console.log('ini data abis submit', data)
          // Generate columns from data for passing to table
          const generateColumnsFromData = (data) => {
            if (!data || !data.length) return [];

            // Extract keys from the first item to use as column headers
            const firstItem = data[0];
            return Object.keys(firstItem).map((key) => ({
              id: key,
              accessorKey: key,
              header: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              cell: (info) => info.getValue(),
            }));
          };
          console.log("generated column", generateColumnsFromData(data))

          openModal({
            type: "modal",
            title: "An Error Occurred",
            description: message,
            zIndex: "z-[var(--z-tooltip)]",
            content: (
              <div className="text-sm">
                {<Table columns={generateColumnsFromData(data)} data={data} />}
              </div>
            ),
            variant: "error",
            size: "3xl",
            footer: (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  color="primary"
                  onClick={() => closeModal()}
                >
                  Close
                </Button>
              </div>
            ),
          });
        } else {
          console.log("data error: ", data)
          openConfirmationModal({
            size: "md",
            variant: "error",
            title: "An Error Occurred",
            description: message,
            // content: <div className="text-xl text-center">{message}</div>,
            zIndex: "z-[var(--z-tooltip)]",
            // footer: (
            //   <div className="flex justify-end">
            //     <Button variant="outline" color="primary" onClick={() => closeModal()}>
            //       Close
            //     </Button>
            //   </div>
            // ),
          });
        }

        return Promise.reject(message);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    console.error(
      "Product Registration Instance Interceptor Response Error :",
      error
    );

    // Check if toast should be suppressed for this request
    const suppressToast = error.config?.suppressErrorToast;

    const errorMessage = handleError(error);

    // Only show toast if not suppressed
    if (!suppressToast) {
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
    }

    return Promise.reject(errorMessage);
  }
);

export default productRegistrationInstance;
