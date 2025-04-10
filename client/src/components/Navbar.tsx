import React from "react";
import { Button } from "./ui/button";
import { RootState, store } from "@/app/store";
import { clearAuth, logoutUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	return (
		<div className="flex items-center justify-between p-4 border-b shadow-sm">
			<h1 className="text-lg font-medium text-fuchsia-600">Football Manager</h1>
			<div>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => {
						const state: RootState = store.getState();
						const { refreshToken, accessToken } = state.auth;
						console.log("Logging out refreshToken...", refreshToken);
						console.log("Logging out accessToken...", accessToken);
						store.dispatch(logoutUser(refreshToken as string));
						store.dispatch(clearAuth());
						navigate("/login");
					}}
				>
					Logout
				</Button>
			</div>
		</div>
	);
};

export default Navbar;
