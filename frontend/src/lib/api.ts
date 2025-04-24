import { env } from "@/configs";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

console.log(env.SERVER_ORIGIN);

interface FailedRequest {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

const api: AxiosInstance = axios.create({
  baseURL: `${env.SERVER_ORIGIN}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for sending/receiving httpOnly cookies
});

// State to manage token refresh
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Process queued requests after token refresh
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(config));
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config; // No Authorization header needed as cookies are used
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if the error is 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log("Queuing request:", originalRequest.url);
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token endpoint
        await api.post("/auth/refresh");

        // Successfully refreshed tokens; process queued requests
        processQueue(null);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...");

        // Log the user out via the backend logout endpoint
        await api.post("/auth/logout");

        // Redirect to login page
        window.location.href = "/login";

        // Reject queued requests with the error
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle non-401 errors
    if (error.response?.status === 403) {
      const errorData = error.response.data as { message: string }; // Replace with actual type
      console.error("Access Forbidden:", errorData.message);
      return Promise.reject(new Error("Forbidden: Access denied."));
    }

    if (error.response?.status === 500) {
      const errorData = error.response.data as { message: string }; // Replace with actual type
      console.error("Internal Server Error:", errorData.message);
      return Promise.reject(
        new Error("Something went wrong. Please try again.")
      );
    }

    return Promise.reject(error); // Reject all other errors
  }
);

export { api };
