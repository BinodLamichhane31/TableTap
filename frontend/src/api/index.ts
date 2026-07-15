import axios from "axios";
import useAuthStore from "../providers/useAuthStore";

const apiHost =
  import.meta.env.VITE_API_HOST || "http://localhost:3030";
const baseURL = `${apiHost}/api/v1`;
export const socketbaseURL = `${apiHost}/orders`;

export const axiosPrivateInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPublicInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivateInstance.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          localStorage.getItem("rToken") || sessionStorage.getItem("rToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            timeout: 15000,
          }
        );
        const accessToken = response.data;

        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setIsAuth(true);
        axiosPrivateInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosPrivateInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("rToken");
        sessionStorage.removeItem("rToken");
        useAuthStore.getState().clearAccessToken();
        useAuthStore.getState().setIsAuth(false);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
