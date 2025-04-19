import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

interface FailedRequest {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
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
      //   resolve(api(error.config as InternalAxiosRequestConfig));
      resolve(api(config));
    }
  });
  failedQueue = [];
};

// Request interceptor (no manual Authorization header since tokens are in cookies)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tokens are handled by httpOnly cookies, so no need to add Authorization header
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle 401 and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 and not already retrying
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
        // Request new access token using refresh token cookie
        await api.post("/auth/refresh");

        // New accessToken cookie is set by the backend via Set-Cookie
        // Process queued requests
        processQueue(null);

        // Retry the original request with the new accessToken cookie
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., invalid refresh token)
        processQueue(refreshError as AxiosError);
        // Optionally redirect to login
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors or after retry, reject the error
    return Promise.reject(error);
  }
);

export { api };
