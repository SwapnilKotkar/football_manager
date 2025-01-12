import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamDetails } from "../features/team/teamSlice";
// import PlayerCard from "../components/ui/PlayerCard";

const Dashboard = () => {
	const dispatch = useDispatch();
	const { team, status, error } = useSelector((state) => state.team);

	useEffect(() => {
		if (!team) {
			dispatch(fetchTeamDetails());
		}
	}, [team, dispatch]);

	if (status === "loading") {
		return <div>Loading team details...</div>;
	}

	if (status === "failed") {
		return <div>Error: {error}</div>;
	}

	console.log("team_data", team);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Your Team</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* {team.players.map((player) => (
					<PlayerCard key={player.playerId} player={player} />
				))} */}
			</div>
		</div>
	);
};

export default Dashboard;
