import axiosInstance from "../../api/axiosInstance";

export const createTeam = () => {
	return axiosInstance.post("/team/create");
};

export const getTeamDetails = () => {
	return axiosInstance.get("/team");
};

export const addPlayerToTeam = (playerData) => {
	return axiosInstance.post("/team/players", playerData);
};

export const updatePlayerInTeam = (playerId, updateData) => {
	return axiosInstance.put(`/team/players/${playerId}`, updateData);
};

export const deletePlayerFromTeam = (playerId) => {
	return axiosInstance.delete(`/team/players/${playerId}`);
};

export const deleteTeam = () => {
	return axiosInstance.delete("/team");
};
