import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

/**
 * Combines and merges Tailwind CSS classes efficiently with clsx and tailwind-merge
 * @param  {...string} inputs - CSS class strings to be combined and merged
 * @returns {string} - The final merged className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Extract domain from URL
export function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

// Format date using moment
export function formatDate(date, format = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "";
  return dayjs(date).format(format);
}

// export function formatTime(time) {
//   const date = new Date(time);
//   const options = {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//     timeZone: "Asia/Jakarta",
//   };

//   const formatted = date.toLocaleString("en-US", options);

//   // Hilangkan karakter non-jam dan ubah titik ke titik dua
//   const formattedWithColon = formatted.replace("at", "").trim();
//   let finalFormatted = formattedWithColon.replace(/\./g, ":");

//   return finalFormatted;
// }

// export function formatTime(time) {
//   const date = new Date(time);

//   // Ubah ke zona waktu Asia/Jakarta secara manual
//   const jakartaOffset = 7 * 60; // dalam menit
//   const localTime = new Date(date.getTime() + jakartaOffset * 60000);

//   const day = String(localTime.getDate()).padStart(2, "0");
//   const month = localTime.toLocaleString("en-US", {
//     // month: "short",
//     // timeZone: "Asia/Jakarta",
//   });
//   const year = localTime.getFullYear();

//   const hours = String(localTime.getHours()).padStart(2, "0");
//   const minutes = String(localTime.getMinutes()).padStart(2, "0");
//   const seconds = String(localTime.getSeconds()).padStart(2, "0");

//   return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
// }

export function formatTime(date) {
  return dayjs(date).format("DD MMMM YYYY, HH:mm:ss");
}

export function formatDateMonth(date) {
  return dayjs(date).format("DD MMMM YYYY");
}

// Format number as currency with commas
export function floatToCurrency(amount, decimals = 2) {
  if (!amount) return "";
  return Number(amount)
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Convert currency string back to float number
export function currencyToFloat(currencyStr) {
  if (!currencyStr) return 0;
  return parseFloat(currencyStr.replace(/[^0-9.-]+/g, ""));
}

// Download JSON data as Excel file
export function downloadExcel(data, filename = "Export Data.xlsx") {
  if (!data || !data.length) return;

  // Process data to format dates and amounts
  const processedData = data.map((row) => {
    const processed = { ...row };

    // Format any date fields
    Object.keys(processed).forEach((key) => {
      if (processed[key] instanceof Date) {
        processed[key] = formatDate(processed[key]);
      }
      // Format any numeric/amount fields
      else if (typeof processed[key] === "number") {
        processed[key] = floatToCurrency(processed[key]);
      }
    });

    return processed;
  });

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}

/**
 * Checks if a value is empty
 * @param {*} value - The value to check
 * @returns {boolean} - Returns true if the value is null, undefined, empty string, or empty array
 */
export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

/**
 * Formats a number with a thousands separator
 * @param {number} value - The number to format
 * @returns {string} - The formatted number string
 */
export function formatNumber(value, decimalPlaces = 0) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

/**
 * Formats a currency value
 * @param {number} value - The value to format as currency
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} - The formatted currency string
 */
export function formatCurrency(value, currency = "USD") {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - The truncated string
 */
export function truncateString(str, maxLength = 50) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export function titleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Deep clones an object or array
 * @param {object|array} obj - The object or array to clone
 * @returns {object|array} - A deep clone of the input
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounces a function call
 * @param {function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {function} - The debounced function
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Generates a random ID
 * @param {number} length - The length of the ID
 * @returns {string} - The random ID
 */
export function generateRandomId(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get query params from URL as object
export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

// Remove duplicate values from array
export function removeDuplicates(array) {
  return [...new Set(array)];
}

// Calculate the number of days between two dates
export function getDayRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getFileName(filePath) {
  return filePath.split("/").pop();
}

export function getMultiDimensionalTotalSteps(arrGroup) {
  return arrGroup.flat().filter(x => Array.isArray(x)).reduce((sum, arr) => sum + arr.length, 0);
}

export function cleanTableObject(obj) {
  delete obj.__isDisabled;
  delete obj.__rowNumber;
  return obj;
}

/**
 * Utility functions for generating test IDs at runtime
 * These can be used outside of React components
 */

/**
 * Check if test IDs should be generated based on environment
 * @returns {boolean}
 */
export const shouldGenerateTestIds = () => {
  const env = import.meta.env.VITE_NODE_ENV;
  // Don't generate test IDs in production or UAT environments
  return env !== 'production' && env !== 'uat';
};

/**
 * Create a test ID props object
 * Useful for spreading into component props
 * 
 * @param {string} testId - Generated test ID
 * @returns {Object} - Props object with data-testid or empty object
 */
export const createTestIdProps = (testId) => {
  // Only return props if we should generate test IDs and testId exists
  if (!shouldGenerateTestIds() || !testId) {
    return {};
  }

  return { 'data-testid': testId };
};