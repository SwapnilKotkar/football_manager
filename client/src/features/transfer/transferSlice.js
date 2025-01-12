import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	listPlayerForTransfer,
	buyPlayer,
	filterTransfers,
} from "./transferAPI";

const initialState = {
	transfers: [],
	status: "idle",
	error: null,
};

// Async thunks for transfer management
export const listForTransfer = createAsyncThunk(
	"transfer/listForTransfer",
	async (transferData, thunkAPI) => {
		try {
			const response = await listPlayerForTransfer(transferData);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const purchasePlayer = createAsyncThunk(
	"transfer/purchasePlayer",
	async (transferId, thunkAPI) => {
		try {
			const response = await buyPlayer(transferId);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const getFilteredTransfers = createAsyncThunk(
	"transfer/getFilteredTransfers",
	async (filters, thunkAPI) => {
		try {
			const response = await filterTransfers(filters);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

const transferSlice = createSlice({
	name: "transfer",
	initialState,
	reducers: {
		// Define synchronous actions if needed
	},
	extraReducers: (builder) => {
		builder
			// Handle list for transfer
			.addCase(listForTransfer.pending, (state) => {
				state.status = "loading";
			})
			.addCase(listForTransfer.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.transfers.push(action.payload.transfer);
			})
			.addCase(listForTransfer.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.payload.message || "Failed to list player for transfer";
			})
			// Handle purchase player
			.addCase(purchasePlayer.pending, (state) => {
				state.status = "loading";
			})
			.addCase(purchasePlayer.fulfilled, (state, action) => {
				state.status = "succeeded";
				console.log(action.payload);
			})
			.addCase(purchasePlayer.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to purchase player";
			})
			// Handle get filtered transfers
			.addCase(getFilteredTransfers.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getFilteredTransfers.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.transfers = action.payload;
			})
			.addCase(getFilteredTransfers.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to fetch transfers";
			});
	},
});

export default transferSlice.reducer;
