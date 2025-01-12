// src/api/axiosInstance.js
import axios from "axios";
import store from "../app/store";
import {
	refreshAccessToken,
	clearCredentials,
	logout,
} from "../features/auth/authSlice";

// Create an Axios instance
const axiosInstance = axios.create({
	baseURL: "http://localhost:5000", // Update with your backend base URL or use environment variables
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

// Function to process the failed requests queue
const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const token = state.auth.accessToken;
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		const originalRequest = error.config;

		// Check if error response is 401 and the request has not been retried yet
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers["Authorization"] = "Bearer " + token;
						return axiosInstance(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const state = store.getState();
			const refreshToken = state.auth.refreshToken;

			if (!refreshToken) {
				store.dispatch(clearCredentials());
				store.dispatch(logout());
				window.location.href = "/login"; // Redirect to login
				return Promise.reject(error);
			}

			return new Promise(function (resolve, reject) {
				store
					.dispatch(refreshAccessToken(refreshToken))
					.unwrap()
					.then((newTokens) => {
						axiosInstance.defaults.headers["Authorization"] =
							"Bearer " + newTokens.accessToken;
						originalRequest.headers["Authorization"] =
							"Bearer " + newTokens.accessToken;
						processQueue(null, newTokens.accessToken);
						resolve(axiosInstance(originalRequest));
					})
					.catch((err) => {
						processQueue(err, null);
						store.dispatch(clearCredentials());
						store.dispatch(logout());
						window.location.href = "/login"; // Redirect to login
						reject(err);
					})
					.finally(() => {
						isRefreshing = false;
					});
			});
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
