import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Access token exists in memory only.
let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    const excludedUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
      "/auth/verify-otp",
    ];

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      excludedUrls.some((path) => url.includes(path))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Share one refresh request if several requests fail together.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          .then((response) => {
            const token = response.data.accessToken;

            if (!token) {
              throw new Error("Refresh response has no access token.");
            }

            setAccessToken(token);
            return token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      return Promise.reject(refreshError);
    }
  }
);