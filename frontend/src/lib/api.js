import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

console.log("=================================");
console.log("School API URL:", API_URL);
console.log("=================================");

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_URL,

  timeout: 10000,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| REQUEST LOGGER - DEVELOPMENT ONLY
|--------------------------------------------------------------------------
*/

if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(
        `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/*
|--------------------------------------------------------------------------
| RESPONSE LOGGER - DEVELOPMENT ONLY
|--------------------------------------------------------------------------
*/

if (import.meta.env.DEV) {
  api.interceptors.response.use(
    (response) => {
      console.log(
        `[API RESPONSE] ${response.status} ${response.config.url}`
      );

      return response;
    },
    (error) => {
      if (error.response) {
        console.error(
          `[API ERROR] ${error.response.status} ${error.config?.url}`
        );
      } else if (error.request) {
        console.error(
          `[API ERROR] No response from server: ${error.config?.url}`
        );
      } else {
        console.error(
          `[API ERROR] ${error.message}`
        );
      }

      return Promise.reject(error);
    }
  );
}

export default api;