import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	listTransferRequest,
	removeTransferRequest,
	buyPlayerRequest,
	filterTransfersRequest,
} from "./transferAPI";
import type { RootState } from "../../app/store";
import { extractErrorMessage } from "@/utils/errorMessage";

interface TransferItem {
	_id: string;
	userId: string;
	playerId: unknown; // or a more specific Player type if you have one
	askingPrice: number;
	isListed: boolean;
}

interface TransferState {
	items: TransferItem[];
	loading: boolean;
	error: string | null;
}

const initialState: TransferState = {
	items: [],
	loading: false,
	error: null,
};

export const listTransfer = createAsyncThunk(
	"transfer/listTransfer",
	async (payload: { playerId: string; askingPrice: number }, thunkAPI) => {
		try {
			const response = await listTransferRequest(payload);
			return response;
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "list transfer failed")
			) as never;
		}
	}
);

export const removeTransfer = createAsyncThunk(
	"transfer/removeTransfer",
	async (transferId: string, thunkAPI) => {
		try {
			const response = await removeTransferRequest(transferId);
			return { transferId, response };
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "remove transfer failed")
			) as never;
		}
	}
);

export const buyPlayer = createAsyncThunk(
	"transfer/buyPlayer",
	async (transferId: string, thunkAPI) => {
		try {
			const response = await buyPlayerRequest(transferId);
			return { transferId, response };
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "buy player failed")
			) as never;
		}
	}
);

export const filterTransfers = createAsyncThunk(
	"transfer/filterTransfers",
	async (queryParams: Record<string, unknown>, thunkAPI) => {
		try {
			const response = await filterTransfersRequest(queryParams);
			return response;
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "filter transfers failed")
			) as never;
		}
	}
);

const transferSlice = createSlice({
	name: "transfer",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// listTransfer
			.addCase(listTransfer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(listTransfer.fulfilled, (state, action) => {
				state.loading = false;
				console.log(action.payload);
			})
			.addCase(listTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// removeTransfer
			.addCase(removeTransfer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeTransfer.fulfilled, (state, action) => {
				state.loading = false;
				// Filter out the removed transfer from local items if needed
				state.items = state.items.filter(
					(item) => item._id !== action.payload.transferId
				);
			})
			.addCase(removeTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// buyPlayer
			.addCase(buyPlayer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(buyPlayer.fulfilled, (state, action) => {
				state.loading = false;
				console.log(action.payload);
			})
			.addCase(buyPlayer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// filterTransfers
			.addCase(filterTransfers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(filterTransfers.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload; // assuming the API returns an array
			})
			.addCase(filterTransfers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const selectTransfer = (state: RootState) => state.transfer;

export default transferSlice.reducer;
