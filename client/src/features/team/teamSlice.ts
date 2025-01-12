import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTeamRequest, getTeamRequest } from "./teamAPI";
import type { RootState } from "../../app/store";
import { extractErrorMessage } from "@/utils/errorMessage";

interface Player {
	_id: string;
	name: string;
	position: string;
	price: number;
	teamName: string;
}

interface TeamState {
	budget: number;
	players: Player[];
	loading: boolean;
	error: string | null;
}

const initialState: TeamState = {
	budget: 0,
	players: [],
	loading: false,
	error: null,
};

export const createTeam = createAsyncThunk(
	"team/createTeam",
	async (_, thunkAPI) => {
		try {
			const response = await createTeamRequest();
			return response;
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "create team failed")
			) as never;
		}
	}
);

export const getTeam = createAsyncThunk("team/getTeam", async (_, thunkAPI) => {
	try {
		const response = await getTeamRequest();
		return response;
	} catch (error: unknown) {
		return thunkAPI.rejectWithValue(
			extractErrorMessage(error, "get team failed")
		) as never;
	}
});

const teamSlice = createSlice({
	name: "team",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createTeam.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createTeam.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(createTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// getTeam
			.addCase(getTeam.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getTeam.fulfilled, (state, action) => {
				state.loading = false;
				state.budget = action.payload.budget;
				state.players = action.payload.players;
			})
			.addCase(getTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const selectTeam = (state: RootState) => state.team;

export default teamSlice.reducer;
