// src/hooks/useAuth.js
import { useSelector, useDispatch } from "react-redux";
import { logout, refreshAccessToken } from "../features/auth/authSlice";

const useAuth = () => {
	const dispatch = useDispatch();
	const { user, accessToken, refreshToken } = useSelector(
		(state) => state.auth
	);

	const handleLogout = () => {
		dispatch(logout());
	};

	const handleRefreshToken = () => {
		if (refreshToken) {
			dispatch(refreshAccessToken(refreshToken));
		}
	};

	return {
		user,
		accessToken,
		handleLogout,
		handleRefreshToken,
	};
};

export default useAuth;
