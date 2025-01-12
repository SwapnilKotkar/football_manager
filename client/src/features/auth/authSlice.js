import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, refreshToken, logoutUser } from "./authAPI";

const initialState = {
	user: null,
	accessToken: localStorage.getItem("accessToken") || null,
	refreshToken: localStorage.getItem("refreshToken") || null,
	status: "idle",
	error: null,
};

// Async thunks for authentication
export const login = createAsyncThunk(
	"auth/login",
	async (credentials, thunkAPI) => {
		try {
			const response = await loginUser(credentials);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const register = createAsyncThunk(
	"auth/register",
	async (userData, thunkAPI) => {
		try {
			const response = await registerUser(userData);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const refreshAccessToken = createAsyncThunk(
	"auth/refreshAccessToken",
	async (token, thunkAPI) => {
		try {
			const response = await refreshToken(token);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
	try {
		await logoutUser();
		return;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response.data);
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken, refreshToken, user } = action.payload;
			state.accessToken = accessToken;
			state.refreshToken = refreshToken;
			state.user = user;
		},
		clearCredentials: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
		},
	},
	extraReducers: (builder) => {
		builder
			// Handle login
			.addCase(login.pending, (state) => {
				state.status = "loading";
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				localStorage.setItem("accessToken", action.payload.accessToken);
				localStorage.setItem("refreshToken", action.payload.refreshToken);
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to login";
			})
			// Handle register
			.addCase(register.pending, (state) => {
				state.status = "loading";
			})
			.addCase(register.fulfilled, (state, action) => {
				state.status = "succeeded";
				console.log(action.payload);
			})
			.addCase(register.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to register";
			})
			// Handle token refresh
			.addCase(refreshAccessToken.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				localStorage.setItem("accessToken", action.payload.accessToken);
				localStorage.setItem("refreshToken", action.payload.refreshToken);
			})
			.addCase(refreshAccessToken.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload.message || "Failed to refresh token";
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
			})
			// Handle logout
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
			})
			.addCase(logout.rejected, (state, action) => {
				state.error = action.payload.message || "Failed to logout";
			});
	},
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
