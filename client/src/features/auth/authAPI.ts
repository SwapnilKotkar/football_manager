import axiosInstance from "../../api/axiosInstance";

interface LoginData {
	email: string;
	password: string;
}

interface RegisterData {
	email: string;
	password: string;
}

export const loginRequest = async (data: LoginData) => {
	const response = await axiosInstance.post("/auth/login", data);
	return response.data;
};

export const registerRequest = async (data: RegisterData) => {
	const response = await axiosInstance.post("/auth/register", data);
	return response.data;
};

export const refreshAccessTokenRequest = async (refreshToken: string) => {
	const response = await axiosInstance.post("/auth/refresh", {
		refreshToken,
	});
	return response.data;
};

export const logoutUserRequest = async (refreshToken: string) => {
	const response = await axiosInstance.post("/auth/logout", { refreshToken });
	return response.data;
};
