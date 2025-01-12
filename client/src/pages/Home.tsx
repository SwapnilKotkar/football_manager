import React from "react";
import { Link } from "react-router-dom";

function Home(): JSX.Element {
	return (
		<div className="p-4">
			<h1 className="text-xl mb-4">Welcome to Football Manager</h1>
			<Link to="/login" className="text-blue-500 underline">
				Login
			</Link>{" "}
			or{" "}
			<Link to="/register" className="text-blue-500 underline">
				Register
			</Link>
		</div>
	);
}

export default Home;
