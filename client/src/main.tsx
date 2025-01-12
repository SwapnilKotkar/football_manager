import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // <-- Add here
import { store } from "./app/store";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Provider store={store}>
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	</Provider>
);
