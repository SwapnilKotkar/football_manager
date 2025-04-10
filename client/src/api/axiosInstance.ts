// src/api/axiosInstance.ts
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { store, RootState } from "../app/store";
import {
	refreshAccessToken,
	logoutUser,
	clearAuth,
} from "../features/auth/authSlice";

interface CustomRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const axiosInstance = axios.create({
	baseURL: "http://localhost:5000",
});

// Request interceptor to attach the access token to headers
axiosInstance.interceptors.request.use(
	(config) => {
		const state: RootState = store.getState();
		const token = state.auth.accessToken;

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomRequestConfig;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const state: RootState = store.getState();
			const refreshToken = state.auth.refreshToken;

			if (refreshToken) {
				console.log("Refreshing token...");
				try {
					// Refresh the access token
					const response = await store
						.dispatch(refreshAccessToken(refreshToken))
						.unwrap();

					// Update headers with the new access token
					axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`;
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
					}

					// Retry the original request
					return axiosInstance(originalRequest);
				} catch (err) {
					// Clear auth and logout if refresh fails
					store.dispatch(clearAuth());
					store.dispatch(logoutUser(refreshToken));
					window.location.href = "/login";
					return Promise.reject(err);
				}
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
