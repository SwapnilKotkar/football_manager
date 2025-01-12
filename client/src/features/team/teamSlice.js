import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTeam, getTeamDetails } from "./teamAPI";

const initialState = {
	team: null,
	status: "idle",
	error: null,
};

// Async thunks for team management
export const createNewTeam = createAsyncThunk(
	"team/createNewTeam",
	async (_, thunkAPI) => {
		try {
			const response = await createTeam();
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const fetchTeamDetails = createAsyncThunk(
	"team/fetchTeamDetails",
	async (_, thunkAPI) => {
		try {
			const response = await getTeamDetails();
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

const teamSlice = createSlice({
	name: "team",
	initialState,
	reducers: {
		// Define synchronous actions if needed
	},
	extraReducers: (builder) => {
		builder
			// Handle create new team
			.addCase(createNewTeam.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createNewTeam.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.team = action.payload.team;
			})
			.addCase(createNewTeam.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to create team";
			})
			// Handle fetch team details
			.addCase(fetchTeamDetails.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchTeamDetails.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.team = action.payload.team;
			})
			.addCase(fetchTeamDetails.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to fetch team details";
			});
	},
});

export default teamSlice.reducer;
