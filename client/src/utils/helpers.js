export const formatCurrency = (value) => {
	return `$${value.toLocaleString()}`;
};

export const truncateText = (text, maxLength) => {
	return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
