import { useSelector } from "react-redux";
import { selectAuth } from "../features/auth/authSlice";
import { RootState } from "../app/store";

export function useAuth() {
	const { accessToken } = useSelector((state: RootState) => selectAuth(state));
	return !!accessToken;
}
