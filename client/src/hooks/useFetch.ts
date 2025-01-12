import { useState, useEffect } from "react";

export function useFetch<T>(
	fetchFunction: () => Promise<T>,
	deps: unknown[] = []
): {
	data: T | null;
	loading: boolean;
	error: string | null;
} {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			try {
				const result = await fetchFunction();
				if (isMounted) {
					setData(result);
					setLoading(false);
				}
			} catch (err: unknown) {
				if (isMounted) {
					if (err instanceof Error) {
						setError(err.message);
					} else if (typeof err === "string") {
						setError(err);
					} else {
						setError("Something went wrong");
					}
					setLoading(false);
				}
			}
		})();

		return () => {
			isMounted = false;
		};
	}, deps);

	return { data, loading, error };
}
