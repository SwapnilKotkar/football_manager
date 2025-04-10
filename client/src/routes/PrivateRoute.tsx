import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "@/app/store";
// import { selectAuth } from "@/features/auth/authSlice";
import Cookies from "js-cookie";

const PrivateRoute = () => {
	// const { accessToken } = useSelector((state: RootState) => selectAuth(state));
	const accessToken = Cookies.get("accessToken");
	console.log("PrivateRoute_accessToken", accessToken);

	return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
