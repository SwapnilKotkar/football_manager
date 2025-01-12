import axios from "axios";

export const extractErrorMessage = (
	error: unknown,
	fallbackMessage: string
): string => {
	if (axios.isAxiosError(error) && error.response) {
		return error.response.data.message || fallbackMessage;
	}
	return fallbackMessage;
};
