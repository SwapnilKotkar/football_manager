import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
// import Button from "../components/ui/Button.tsx";

const Login = () => {
	const dispatch = useDispatch();
	const authStatus = useSelector((state) => state.auth.status);
	const authError = useSelector((state) => state.auth.error);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login({ email, password }));
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-4">Login</h2>
				{authError && <p className="text-red-500">{authError}</p>}
				<div className="mb-4">
					<label className="block text-gray-700">Email:</label>
					<input
						type="email"
						className="w-full p-2 border border-gray-300 rounded mt-1"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-700">Password:</label>
					<input
						type="password"
						className="w-full p-2 border border-gray-300 rounded mt-1"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="w-full">
					{authStatus === "loading" ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
};

export default Login;
