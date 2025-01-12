import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
	alert(1);
	const accessToken = useSelector((state) => state.auth.accessToken);

	return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
