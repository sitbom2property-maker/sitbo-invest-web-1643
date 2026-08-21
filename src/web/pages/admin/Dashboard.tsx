import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "../../hooks/useAdmin";

const C = {
	dark: "#21141A",
	light: "#FFFEF9",
	accent: "#703C54",
	burgundy: "#703C54",
};

type Property = {
	id: string;
	type: string;
	status: string;
	city: string | null;
	district: string | null;
	address: string | null;
	priceCurrent: number | null;
	priceCurrency: string | null;
	catalogVisible: boolean;
};

const STATUS_LABELS: Record<string, string> = {
	active: "Активный",
	reserved: "Резерв",
	sold: "Продано",
};

export default function AdminDashboard() {
	const [, setLocation] = useLocation();
	const { authenticated, loading, apiFetch, logout } = useAdmin();
	const [items, setItems] = useState<Property[]>([]);
	const [fetching, setFetching] = useState(true);
	const [statusFilter, setStatusFilter] = useState("all");
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (!loading && !authenticated) {
			setLocation("/admin/login");
		}
	}, [loading, authenticated, setLocation]);

	useEffect(() => {
		if (!authenticated) return;
		setFetching(true);
		apiFetch("/properties/admin/all")
			.then((r) => r.json())
			.then((data) => setItems(data as Property[]))
			.finally(() => setFetching(false));
	}, [authenticated, apiFetch]);

	const stats = useMemo(() => {
		return {
			active: items.filter((p) => p.status === "active").length,
			reserved: items.filter((p) => p.status === "reserved").length,
			sold: items.filter((p) => p.status === "sold").length,
		};
	}, [items]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return items.filter((p) => {
			if (statusFilter !== "all" && p.status !== statusFilter) return false;
			if (!q) return true;
			const hay = [p.id, p.city, p.district, p.address, p.type]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return hay.includes(q);
		});
	}, [items, statusFilter, search]);

	if (loading || !authenticated) {
		return (
			<div
				style={{
					minHeight: "60vh",
					background: C.dark,
					color: C.light,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: "-80px",
				}}
			>
				Загрузка…
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: C.dark,
				color: C.light,
				padding: "32px clamp(16px,4vw,48px) 64px",
				paddingTop: "100px",
			}}
		>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexWrap: "wrap",
						gap: "16px",
						marginBottom: "32px",
					}}
				>
					<div>
						<h1
							style={{
								fontFamily: "Coolvetica, Inter, sans-serif",
								fontSize: "2rem",
								margin: 0,
								fontWeight: 500,
							}}
						>
							Объекты
						</h1>
						<p
							style={{
								fontFamily: "Inter, sans-serif",
								color: "#FFFEF9",
								margin: "8px 0 0",
								fontSize: "0.9rem",
							}}
						>
							Управление каталогом SITBO Invest
						</p>
					</div>
					<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
						<button
							type="button"
							onClick={() => setLocation("/admin/property/new")}
							style={{
								padding: "10px 18px",
								background: C.accent,
								color: C.light,
								border: "none",
								borderRadius: "2px",
								fontFamily: "Inter, sans-serif",
								fontWeight: 600,
								fontSize: "0.85rem",
								cursor: "pointer",
							}}
						>
							+ Новый объект
						</button>
						<button
							type="button"
							onClick={() => logout().then(() => setLocation("/admin/login"))}
							style={{
								padding: "10px 18px",
								background: "transparent",
								border: `1px solid ${C.burgundy}`,
								color: C.light,
								borderRadius: "2px",
								fontFamily: "Inter, sans-serif",
								fontSize: "0.85rem",
								cursor: "pointer",
							}}
						>
							Выйти
						</button>
					</div>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
						gap: "16px",
						marginBottom: "32px",
					}}
				>
					{[
						{ label: "Активных", value: stats.active, key: "active" },
						{ label: "Резерв", value: stats.reserved, key: "reserved" },
						{ label: "Продано", value: stats.sold, key: "sold" },
					].map((s) => (
						<div
							key={s.key}
							style={{
								background: "rgba(255,254,249,0.05)",
								border: `1px solid ${C.burgundy}`,
								borderRadius: "2px",
								padding: "20px",
							}}
						>
							<p
								style={{
									fontFamily: "Inter, sans-serif",
									fontSize: "0.7rem",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									color: C.light,
									margin: "0 0 8px",
								}}
							>
								{s.label}
							</p>
							<p
								style={{
									fontFamily: "Inter, sans-serif",
									fontSize: "2.2rem",
									margin: 0,
									fontWeight: 600,
								}}
							>
								{s.value}
							</p>
						</div>
					))}
				</div>

				<div
					style={{
						display: "flex",
						gap: "12px",
						flexWrap: "wrap",
						marginBottom: "20px",
					}}
				>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						style={selectStyle}
					>
						<option value="all">Все статусы</option>
						<option value="active">Активный</option>
						<option value="reserved">Резерв</option>
						<option value="sold">Продано</option>
					</select>
					<input
						type="search"
						placeholder="Поиск по ID, городу, адресу…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ ...selectStyle, flex: "1", minWidth: "200px" }}
					/>
				</div>

				<div
					style={{
						overflowX: "auto",
						border: `1px solid ${C.burgundy}`,
						borderRadius: "2px",
					}}
				>
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							fontFamily: "Inter, sans-serif",
							fontSize: "0.85rem",
						}}
					>
						<thead>
							<tr style={{ background: "rgba(105,65,83,0.35)" }}>
								{["ID", "Город", "Адрес", "Статус", "Цена", ""].map((h) => (
									<th
										key={h}
										style={{
											textAlign: "left",
											padding: "12px 14px",
											color: C.light,
											fontWeight: 500,
											fontSize: "0.7rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{fetching ? (
								<tr>
									<td colSpan={6} style={{ padding: "24px", color: "#FFFEF9" }}>
										Загрузка…
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={6} style={{ padding: "24px", color: "#FFFEF9" }}>
										Нет объектов
									</td>
								</tr>
							) : (
								filtered.map((p) => (
									<tr
										key={p.id}
										style={{ borderTop: `1px solid ${C.burgundy}` }}
									>
										<td style={tdStyle}>{p.id}</td>
										<td style={tdStyle}>{p.city ?? "—"}</td>
										<td style={tdStyle}>
											{[p.district, p.address].filter(Boolean).join(", ") || "—"}
										</td>
										<td style={tdStyle}>
											<span
												style={{
													display: "inline-block",
													padding: "2px 8px",
													borderRadius: "2px",
													background: "rgba(140,178,192,0.1)",
													color: C.light,
													fontSize: "0.75rem",
												}}
											>
												{STATUS_LABELS[p.status] ?? p.status}
											</span>
										</td>
										<td style={tdStyle}>
											{p.priceCurrent != null
												? `${p.priceCurrent.toLocaleString()} ${p.priceCurrency ?? ""}`
												: "—"}
										</td>
										<td style={tdStyle}>
											<Link href={`/admin/property/${p.id}`}>
												<a
													style={{
														color: C.light,
														textDecoration: "none",
														fontWeight: 600,
													}}
												>
													Открыть
												</a>
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

const selectStyle: React.CSSProperties = {
	padding: "10px 14px",
	background: "rgba(33,20,26,0.8)",
	border: `1px solid #703C54`,
	borderRadius: "2px",
	color: "#FFFEF9",
	fontFamily: "Inter, sans-serif",
	fontSize: "0.85rem",
	outline: "none",
};

const tdStyle: React.CSSProperties = {
	padding: "12px 14px",
	verticalAlign: "middle",
};
