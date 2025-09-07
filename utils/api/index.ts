import axios, { AxiosInstance } from "axios";
import { getCookie, setCookie } from "../cookies";
import {
  Configuration,
  DepartmentsApiFactory,
  FAQsApiFactory,
  GuestApiFactory,
  SupportTicketsApiFactory,
} from "./generated";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || publicRuntimeConfig.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies handling
});

// Request interceptor to add auth token
// Request interceptor to inject the accessToken from sessionStorage
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  async (error) => {
    throw error;
  }
);

// Response interceptor to handle 401 errors with token refresh
api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401, or if we've already tried to refresh, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    // Check if the 401 is from the refresh endpoint itself
    if (originalRequest.url === "/auth/guest/refresh") {
      throw error;
    }

    // Mark this request as retried to prevent infinite loops
    originalRequest._retry = true;

    try {
      // Attempt to refresh the token
      const response = await api.post<{ data: { accessToken: string } }>(
        "/auth/guest/refresh"
      );
      const accessToken = response.data.data.accessToken;
      await setCookie("accessToken", accessToken);

      // Retry the original request with the new token
      return await api(originalRequest);
    } catch (refreshError) {
      // If refresh fails (401 or other error), reject with the original error

      throw error;
    }
  }
);

const factoryArgs: [Configuration, string | undefined, AxiosInstance] = [
  new Configuration({ basePath: api.defaults.baseURL }),
  api.defaults.baseURL,
  api,
];

export const SupportTicketService = SupportTicketsApiFactory(...factoryArgs);

export const GuestService = GuestApiFactory(...factoryArgs);

export const DepartmentService = DepartmentsApiFactory(...factoryArgs);

export const FAQService = FAQsApiFactory(...factoryArgs);
