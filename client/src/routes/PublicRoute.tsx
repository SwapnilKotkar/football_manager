import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { selectAuth } from "@/features/auth/authSlice";

const PublicRoute = (): JSX.Element => {
	const { accessToken } = useSelector((state: RootState) => selectAuth(state));
	console.log("PublicRoute_accessToken", accessToken);
	return !accessToken ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;
