import Cookies from "js-cookie";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { extractErrorMessage } from "@/utils/errorMessage";
import {
	loginRequest,
	logoutUserRequest,
	refreshAccessTokenRequest,
	registerRequest,
} from "./authAPI";

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	loading: boolean;
	error: string | null;
}

interface AuthPayload {
	accessToken: string;
	refreshToken: string;
}

const initialState: AuthState = {
	accessToken: Cookies.get("accessToken") || null,
	refreshToken: Cookies.get("refreshToken") || null,
	loading: false,
	error: null,
};

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (
		credentials: { email: string; password: string },
		thunkAPI
	): Promise<AuthPayload> => {
		try {
			const response = await loginRequest(credentials);
			console.log("loginRequest_response", response);
			return response; // { accessToken, refreshToken }
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "Login failed")
			) as never;
		}
	}
);

export const registerUser = createAsyncThunk(
	"auth/registerUser",
	async (
		credentials: { email: string; password: string },
		thunkAPI
	): Promise<unknown> => {
		try {
			const response = await registerRequest(credentials);
			return response;
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "Registration failed")
			) as never;
		}
	}
);

// Called by Axios interceptor when a 401 occurs
export const refreshAccessToken = createAsyncThunk(
	"auth/refreshAccessToken",
	async (refreshToken: string, thunkAPI): Promise<AuthPayload> => {
		try {
			const response = await refreshAccessTokenRequest(refreshToken);
			return response; // { accessToken, refreshToken }
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "Token refresh failed")
			) as never;
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (refreshToken: string, thunkAPI): Promise<void> => {
		try {
			await logoutUserRequest(refreshToken);
		} catch (error: unknown) {
			return thunkAPI.rejectWithValue(
				extractErrorMessage(error, "Logout failed")
			) as never;
		}
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearAuth(state) {
			alert("clearAuth");
			state.accessToken = null;
			state.refreshToken = null;
			state.loading = false;
			state.error = null;

			Cookies.remove("accessToken");
			Cookies.remove("refreshToken");
		},
	},
	extraReducers: (builder) => {
		// ---------- LOGIN ----------
		builder.addCase(loginUser.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(
			loginUser.fulfilled,
			(state, action: PayloadAction<AuthPayload>) => {
				state.loading = false;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;

				Cookies.set("accessToken", action.payload.accessToken, {
					secure: true,
					sameSite: "Strict",
				});
				Cookies.set("refreshToken", action.payload.refreshToken, {
					secure: true,
					sameSite: "Strict",
				});
			}
		);
		builder.addCase(loginUser.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});

		// -------- REGISTER --------
		builder.addCase(registerUser.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(registerUser.fulfilled, (state) => {
			state.loading = false;
		});
		builder.addCase(registerUser.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});

		// -------- REFRESH TOKEN --------
		builder.addCase(refreshAccessToken.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(
			refreshAccessToken.fulfilled,
			(state, action: PayloadAction<AuthPayload>) => {
				state.loading = false;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;

				Cookies.set("accessToken", action.payload.accessToken, {
					secure: true,
					sameSite: "Strict",
				});
				Cookies.set("refreshToken", action.payload.refreshToken, {
					secure: true,
					sameSite: "Strict",
				});
			}
		);
		builder.addCase(refreshAccessToken.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});

		// -------- LOGOUT --------
		builder.addCase(logoutUser.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(logoutUser.fulfilled, (state) => {
			state.loading = false;
			state.accessToken = null;
			state.refreshToken = null;

			Cookies.remove("accessToken");
			Cookies.remove("refreshToken");
		});
		builder.addCase(logoutUser.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});
	},
});

export const { clearAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
