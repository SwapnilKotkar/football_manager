import axiosInstance from "../../api/axiosInstance";

export const createTeamRequest = async () => {
	const response = await axiosInstance.post("/team/create");
	return response.data;
};

export const getTeamRequest = async () => {
	const response = await axiosInstance.get("/team");
	return response.data;
};

// ... other Team-related API calls
