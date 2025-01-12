import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeam, selectTeam } from "../features/team/teamSlice";
import { AppDispatch } from "../app/store";

function Dashboard(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const { budget, players, loading, error } = useSelector(selectTeam);

	useEffect(() => {
		dispatch(getTeam());
	}, [dispatch]);

	return (
		<div className="p-4">
			<h1 className="text-xl mb-2">Dashboard</h1>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-600">{error}</p>}
			{!loading && !error && (
				<div>
					<p>Budget: {budget}</p>
					<div>
						<h2 className="text-lg mt-4">Players</h2>
						<ul>
							{players.map((player) => (
								<li key={player._id}>
									{player.name} - {player.position} - ${player.price}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

export default Dashboard;
