import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transfer from "../pages/Transfer";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Layout from "@/components/Layout";
import PublicRoute from "./PublicRoute";

function AppRoutes(): JSX.Element {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Home />} />

				{/* Public Routes */}
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>

				{/* Protected Routes */}
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/transfer" element={<Transfer />} />
				</Route>

				{/* Fallback Route */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Layout>
	);
}

export default AppRoutes;
