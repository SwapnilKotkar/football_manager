import axiosInstance from "../../api/axiosInstance";

export const listPlayerForTransfer = (transferData) => {
	return axiosInstance.post("/transfer/list", transferData);
};

export const buyPlayer = (transferId) => {
	return axiosInstance.post(`/transfer/buy/${transferId}`);
};

export const filterTransfers = (filters) => {
	return axiosInstance.get("/transfer/filter", { params: filters });
};
