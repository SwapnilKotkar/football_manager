// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import teamReducer from "../features/team/teamSlice";
import transferReducer from "../features/transfer/transferSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		team: teamReducer,
		transfer: transferReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // Optional: Disable if you store non-serializable data
		}),
});

export default store;
