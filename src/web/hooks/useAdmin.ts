import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "sitbo_admin_token";

export function useAdmin() {
	const [token, setToken] = useState<string | null>(() =>
		typeof localStorage !== "undefined"
			? localStorage.getItem(TOKEN_KEY)
			: null,
	);
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) {
			setLoading(false);
			return;
		}

		fetch("/api/auth/verify", {
			headers: { "x-admin-token": stored },
		})
			.then((res) => {
				if (res.ok) {
					setAuthenticated(true);
					setToken(stored);
				} else {
					localStorage.removeItem(TOKEN_KEY);
					setToken(null);
					setAuthenticated(false);
				}
			})
			.catch(() => {
				localStorage.removeItem(TOKEN_KEY);
				setToken(null);
				setAuthenticated(false);
			})
			.finally(() => setLoading(false));
	}, []);

	const login = useCallback(async (password: string) => {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});

		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error(
				(data as { error?: string }).error ?? "Неверный пароль",
			);
		}

		const { token: newToken } = (await res.json()) as { token: string };
		localStorage.setItem(TOKEN_KEY, newToken);
		setToken(newToken);
		setAuthenticated(true);
		return newToken;
	}, []);

	const logout = useCallback(async () => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (stored) {
			await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "x-admin-token": stored },
			}).catch(() => {});
		}
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setAuthenticated(false);
	}, []);

	const apiFetch = useCallback(
		(path: string, options: RequestInit = {}) => {
			const stored = localStorage.getItem(TOKEN_KEY);
			const headers = new Headers(options.headers);
			if (stored) {
				headers.set("x-admin-token", stored);
			}
			if (
				options.body &&
				!headers.has("Content-Type") &&
				typeof options.body === "string"
			) {
				headers.set("Content-Type", "application/json");
			}
			return fetch(`/api${path.startsWith("/") ? path : `/${path}`}`, {
				...options,
				headers,
			});
		},
		[],
	);

	return {
		token,
		loading,
		authenticated,
		login,
		logout,
		apiFetch,
	};
}
