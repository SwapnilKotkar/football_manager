import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import teamReducer from "../features/team/teamSlice";
import transferReducer from "../features/transfer/transferSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		team: teamReducer,
		transfer: transferReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
