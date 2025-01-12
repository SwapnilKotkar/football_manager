import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { selectAuth } from "@/features/auth/authSlice";

const PrivateRoute = () => {
	alert(1);
	const { accessToken } = useSelector((state: RootState) => selectAuth(state));
	console.log("PrivateRoute_accessToken", accessToken);

	return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
