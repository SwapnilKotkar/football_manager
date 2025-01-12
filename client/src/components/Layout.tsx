// src/components/Layout.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { pathname } = useLocation();

	const hideLayoutOnThesePaths = ["/login", "/register"];
	const shouldHideLayout = hideLayoutOnThesePaths.includes(pathname);

	if (shouldHideLayout) {
		return <>{children}</>;
	}

	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	);
};

export default Layout;
