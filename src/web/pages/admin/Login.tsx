import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "../../hooks/useAdmin";

const C = {
	dark: "#21141A",
	light: "#FFFEF9",
	accent: "#703C54",
	burgundy: "#703C54",
};

export default function AdminLogin() {
	const [, setLocation] = useLocation();
	const { login, authenticated, loading } = useAdmin();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!loading && authenticated) {
			setLocation("/admin");
		}
	}, [loading, authenticated, setLocation]);

	const handleLogin = async () => {
		setError("");
		setSubmitting(true);
		try {
			await login(password);
			setLocation("/admin");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка входа");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: C.dark,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "24px",
				marginTop: "-80px",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: "400px",
					background: "rgba(255,254,249,0.04)",
					border: `1px solid ${C.burgundy}`,
					borderRadius: "10px",
					padding: "40px 32px",
				}}
			>
				<h1
					style={{
						fontFamily: "JUN, Georgia, serif",
						fontSize: "1.75rem",
						color: C.light,
						margin: "0 0 8px",
						fontWeight: 500,
					}}
				>
					SITBO Admin
				</h1>
				<p
					style={{
						fontFamily: "Nunito, sans-serif",
						fontSize: "0.85rem",
						color: "#FFFEF9",
						margin: "0 0 28px",
					}}
				>
					Управление недвижимостью
				</p>

				<label
					style={{
						display: "block",
						fontFamily: "Nunito, sans-serif",
						fontSize: "0.7rem",
						letterSpacing: "0.1em",
						textTransform: "uppercase",
						color: C.light,
						marginBottom: "8px",
					}}
				>
					Пароль
				</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleLogin()}
					style={{
						width: "100%",
						boxSizing: "border-box",
						padding: "12px 14px",
						background: "rgba(33,20,26,0.6)",
						border: `1px solid ${C.burgundy}`,
						borderRadius: "8px",
						color: C.light,
						fontFamily: "Nunito, sans-serif",
						fontSize: "0.95rem",
						marginBottom: "20px",
						outline: "none",
					}}
				/>

				{error && (
					<p
						style={{
							color: "#e88",
							fontFamily: "Nunito, sans-serif",
							fontSize: "0.85rem",
							margin: "0 0 16px",
						}}
					>
						{error}
					</p>
				)}

				<button
					type="button"
					disabled={submitting || !password}
					onClick={handleLogin}
					style={{
						width: "100%",
						padding: "14px",
						background: C.accent,
						color: C.light,
						border: "none",
						borderRadius: "8px",
						fontFamily: "Nunito, sans-serif",
						fontSize: "0.9rem",
						fontWeight: 600,
						cursor: submitting ? "wait" : "pointer",
						opacity: submitting || !password ? 0.6 : 1,
					}}
				>
					{submitting ? "Вход…" : "Войти"}
				</button>
			</div>
		</div>
	);
}
