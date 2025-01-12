import axiosInstance from "../../api/axiosInstance";

export const registerUser = (userData) => {
	return axiosInstance.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
	return axiosInstance.post("/auth/login", credentials);
};

export const refreshToken = (token) => {
	return axiosInstance.post("/auth/refresh-token", { token });
};

export const logoutUser = () => {
	return axiosInstance.post("/auth/logout");
};
