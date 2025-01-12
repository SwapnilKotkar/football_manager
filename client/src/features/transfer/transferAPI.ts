import axiosInstance from "../../api/axiosInstance";

export const listTransferRequest = async (data: {
	playerId: string;
	askingPrice: number;
}) => {
	const response = await axiosInstance.post("/transfer/list", data);
	return response.data;
};

export const removeTransferRequest = async (transferId: string) => {
	const response = await axiosInstance.delete(`/transfer/remove/${transferId}`);
	return response.data;
};

export const buyPlayerRequest = async (transferId: string) => {
	const response = await axiosInstance.post(`/transfer/buy/${transferId}`);
	return response.data;
};

export const filterTransfersRequest = async (
	queryParams: Record<string, unknown>
) => {
	const response = await axiosInstance.get("/transfer/filter", {
		params: queryParams,
	});
	return response.data;
};
