import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useAdmin } from "../../hooks/useAdmin";

const C = {
	dark: "#21141A",
	light: "#FAF7F0",
	accent: "#8CB2C0",
	burgundy: "#694153",
};

const CITIES = ["Батуми", "Тбилиси", "Гонио", "Чакви", "Махинджаури"] as const;
const CONDITIONS = ["отличное", "хорошее", "удовлетворительное", "требует ремонта", "черновая"] as const;
const CURRENCIES = ["USD", "GEL", "EUR"] as const;

type HistoryEntry = {
	id: number;
	event: string;
	description: string | null;
	agent: string | null;
	price: number | null;
	createdAt: string;
};

type FormState = {
	id: string;
	type: string;
	status: string;
	catalogVisible: boolean;
	city: string;
	district: string;
	address: string;
	cadastralCode: string;
	unitType: string;
	areaTotal: string;
	areaLiving: string;
	floor: string;
	floorsTotal: string;
	rooms: string;
	condition: string;
	yearBuilt: string;
	view: string;
	features: string;
	priceCurrent: string;
	priceCurrency: string;
	pricePerSqm: string;
	priceDisplay: string;
	rentalYieldEst: string;
	ownerName: string;
	ownerPhone: string;
	cadastralOwner: string;
	cadastralArea: string;
	encumbrances: boolean;
	cadastralNotes: string;
	coverImage: string;
	photos: string;
	internalNotes: string;
	historyNote: string;
};

const emptyForm = (): FormState => ({
	id: "",
	type: "apartment",
	status: "active",
	catalogVisible: false,
	city: "Батуми",
	district: "",
	address: "",
	cadastralCode: "",
	unitType: "квартира",
	areaTotal: "",
	areaLiving: "",
	floor: "",
	floorsTotal: "",
	rooms: "",
	condition: "хорошее",
	yearBuilt: "",
	view: "",
	features: "",
	priceCurrent: "",
	priceCurrency: "USD",
	pricePerSqm: "",
	priceDisplay: "show",
	rentalYieldEst: "",
	ownerName: "",
	ownerPhone: "",
	cadastralOwner: "",
	cadastralArea: "",
	encumbrances: false,
	cadastralNotes: "",
	coverImage: "",
	photos: "",
	internalNotes: "",
	historyNote: "",
});

function propertyToForm(p: Record<string, unknown>): FormState {
	const features = Array.isArray(p.features)
		? (p.features as string[]).join(", ")
		: "";
	const photos = Array.isArray(p.photos) ? (p.photos as string[]).join("\n") : "";

	return {
		id: String(p.id ?? ""),
		type: String(p.type ?? "apartment"),
		status: String(p.status ?? "active"),
		catalogVisible: Boolean(p.catalogVisible),
		city: String(p.city ?? "Батуми"),
		district: String(p.district ?? ""),
		address: String(p.address ?? ""),
		cadastralCode: String(p.cadastralCode ?? ""),
		unitType: String(p.unitType ?? ""),
		areaTotal: p.areaTotal != null ? String(p.areaTotal) : "",
		areaLiving: p.areaLiving != null ? String(p.areaLiving) : "",
		floor: p.floor != null ? String(p.floor) : "",
		floorsTotal: p.floorsTotal != null ? String(p.floorsTotal) : "",
		rooms: p.rooms != null ? String(p.rooms) : "",
		condition: String(p.condition ?? "хорошее"),
		yearBuilt: p.yearBuilt != null ? String(p.yearBuilt) : "",
		view: String(p.view ?? ""),
		features,
		priceCurrent: p.priceCurrent != null ? String(p.priceCurrent) : "",
		priceCurrency: String(p.priceCurrency ?? "USD"),
		pricePerSqm: p.pricePerSqm != null ? String(p.pricePerSqm) : "",
		priceDisplay: String(p.priceDisplay ?? "show"),
		rentalYieldEst: p.rentalYieldEst != null ? String(p.rentalYieldEst) : "",
		ownerName: String(p.ownerName ?? ""),
		ownerPhone: String(p.ownerPhone ?? ""),
		cadastralOwner: String(p.cadastralOwner ?? ""),
		cadastralArea: p.cadastralArea != null ? String(p.cadastralArea) : "",
		encumbrances: Boolean(p.encumbrances),
		cadastralNotes: String(p.cadastralNotes ?? ""),
		coverImage: String(p.coverImage ?? ""),
		photos,
		internalNotes: String(p.internalNotes ?? ""),
		historyNote: "",
	};
}

function formToPayload(form: FormState) {
	const num = (v: string) => (v.trim() === "" ? null : Number(v));
	return {
		id: form.id.trim(),
		type: form.type,
		status: form.status,
		catalogVisible: form.catalogVisible,
		city: form.city || null,
		district: form.district || null,
		address: form.address || null,
		cadastralCode: form.cadastralCode || null,
		unitType: form.unitType || null,
		areaTotal: num(form.areaTotal),
		areaLiving: num(form.areaLiving),
		floor: num(form.floor),
		floorsTotal: num(form.floorsTotal),
		rooms: num(form.rooms),
		condition: form.condition || null,
		yearBuilt: num(form.yearBuilt),
		view: form.view || null,
		features: form.features
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean),
		priceCurrent: num(form.priceCurrent),
		priceCurrency: form.priceCurrency || null,
		pricePerSqm: num(form.pricePerSqm),
		priceDisplay: form.priceDisplay || null,
		rentalYieldEst: num(form.rentalYieldEst),
		ownerName: form.ownerName || null,
		ownerPhone: form.ownerPhone || null,
		cadastralOwner: form.cadastralOwner || null,
		cadastralArea: num(form.cadastralArea),
		encumbrances: form.encumbrances,
		cadastralNotes: form.cadastralNotes || null,
		coverImage: form.coverImage || null,
		photos: form.photos
			.split("\n")
			.map((s) => s.trim())
			.filter(Boolean),
		internalNotes: form.internalNotes || null,
		historyNote: form.historyNote.trim() || undefined,
	};
}

type PropertyFormProps = {
	propertyId?: string;
};

export default function PropertyForm({ propertyId }: PropertyFormProps) {
	const params = useParams<{ id: string }>();
	const id = propertyId ?? params.id;
	const isNew = !id || id === "new";

	const [, setLocation] = useLocation();
	const { authenticated, loading, apiFetch } = useAdmin();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [loadError, setLoadError] = useState("");

	useEffect(() => {
		if (!loading && !authenticated) {
			setLocation("/admin/login");
		}
	}, [loading, authenticated, setLocation]);

	useEffect(() => {
		if (isNew || !authenticated) return;
		apiFetch(`/properties/admin/${id}`)
			.then(async (r) => {
				if (!r.ok) throw new Error("Не найден");
				const data = (await r.json()) as {
					property: Record<string, unknown>;
					history: HistoryEntry[];
				};
				setForm(propertyToForm(data.property));
				setHistory(data.history ?? []);
			})
			.catch(() => setLoadError("Не удалось загрузить объект"));
	}, [isNew, id, authenticated, apiFetch]);

	const set =
		<K extends keyof FormState>(key: K) =>
		(value: FormState[K]) => {
			setForm((f) => ({ ...f, [key]: value }));
		};

	const handleSave = async () => {
		setError("");
		if (isNew && !form.id.trim()) {
			setError("Укажите ID объекта");
			return;
		}

		setSaving(true);
		const payload = formToPayload(form);

		try {
			const res = isNew
				? await apiFetch("/properties/admin", {
						method: "POST",
						body: JSON.stringify(payload),
					})
				: await apiFetch(`/properties/admin/${id}`, {
						method: "PUT",
						body: JSON.stringify(payload),
					});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(
					(data as { error?: string }).error ?? "Ошибка сохранения",
				);
			}

			if (isNew) {
				setLocation(`/admin/property/${form.id.trim()}`);
			} else {
				const data = (await res.json()) as Record<string, unknown>;
				setForm(propertyToForm(data));
				const histRes = await apiFetch(`/properties/admin/${id}`);
				if (histRes.ok) {
					const histData = (await histRes.json()) as {
						history: HistoryEntry[];
					};
					setHistory(histData.history ?? []);
				}
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка");
		} finally {
			setSaving(false);
		}
	};

	if (loading || !authenticated) {
		return (
			<div style={{ minHeight: "60vh", background: C.dark, color: C.light, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-80px" }}>
				Загрузка…
			</div>
		);
	}

	return (
		<div style={{ minHeight: "100vh", background: C.dark, color: C.light, padding: "32px clamp(16px,4vw,48px) 64px", marginTop: "-80px" }}>
			<div style={{ maxWidth: isNew ? "800px" : "1200px", margin: "0 auto" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
					<div>
						<Link href="/admin">
							<a style={{ color: C.accent, fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", textDecoration: "none" }}>← Назад</a>
						</Link>
						<h1 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.75rem", margin: "8px 0 0", fontWeight: 500 }}>
							{isNew ? "Новый объект" : `Объект ${id}`}
						</h1>
					</div>
					<button type="button" disabled={saving} onClick={handleSave} style={{ padding: "12px 24px", background: C.accent, color: C.dark, border: "none", borderRadius: "8px", fontFamily: "DM Sans, sans-serif", fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
						{saving ? "Сохранение…" : "Сохранить"}
					</button>
				</div>

				{loadError && <p style={{ color: "#e88", marginBottom: "16px" }}>{loadError}</p>}
				{error && <p style={{ color: "#e88", marginBottom: "16px" }}>{error}</p>}

				<div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
					<div style={{ flex: "1 1 520px", minWidth: 0 }}>
						<Section title="Основное">
							{isNew && (
								<Field label="ID *">
									<input value={form.id} onChange={(e) => set("id")(e.target.value)} style={inputStyle} placeholder="batumi-apt-001" />
								</Field>
							)}
							<Row>
								<Field label="Тип">
									<input value={form.type} onChange={(e) => set("type")(e.target.value)} style={inputStyle} placeholder="apartment" />
								</Field>
								<Field label="Статус">
									<select value={form.status} onChange={(e) => set("status")(e.target.value)} style={inputStyle}>
										<option value="active">Активный</option>
										<option value="reserved">Резерв</option>
										<option value="sold">Продано</option>
									</select>
								</Field>
							</Row>
							<Toggle label="В каталоге" checked={form.catalogVisible} onChange={(v) => set("catalogVisible")(v)} />
						</Section>

						<Section title="Локация">
							<Field label="Город">
								<select value={form.city} onChange={(e) => set("city")(e.target.value)} style={inputStyle}>
									{CITIES.map((c) => (
										<option key={c} value={c}>{c}</option>
									))}
								</select>
							</Field>
							<Field label="Район">
								<input value={form.district} onChange={(e) => set("district")(e.target.value)} style={inputStyle} />
							</Field>
							<Field label="Адрес">
								<input value={form.address} onChange={(e) => set("address")(e.target.value)} style={inputStyle} />
							</Field>
						</Section>

						<Section title="Характеристики">
							<Row>
								<Field label="Кадастровый код">
									<input value={form.cadastralCode} onChange={(e) => set("cadastralCode")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Тип юнита">
									<input value={form.unitType} onChange={(e) => set("unitType")(e.target.value)} style={inputStyle} />
								</Field>
							</Row>
							<Row>
								<Field label="Площадь общая, м²">
									<input type="number" value={form.areaTotal} onChange={(e) => set("areaTotal")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Жилая, м²">
									<input type="number" value={form.areaLiving} onChange={(e) => set("areaLiving")(e.target.value)} style={inputStyle} />
								</Field>
							</Row>
							<Row>
								<Field label="Этаж">
									<input type="number" value={form.floor} onChange={(e) => set("floor")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Этажей в доме">
									<input type="number" value={form.floorsTotal} onChange={(e) => set("floorsTotal")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Комнат">
									<input type="number" value={form.rooms} onChange={(e) => set("rooms")(e.target.value)} style={inputStyle} />
								</Field>
							</Row>
							<Row>
								<Field label="Состояние">
									<select value={form.condition} onChange={(e) => set("condition")(e.target.value)} style={inputStyle}>
										{CONDITIONS.map((c) => (
											<option key={c} value={c}>{c}</option>
										))}
									</select>
								</Field>
								<Field label="Год постройки">
									<input type="number" value={form.yearBuilt} onChange={(e) => set("yearBuilt")(e.target.value)} style={inputStyle} />
								</Field>
							</Row>
							<Field label="Вид">
								<input value={form.view} onChange={(e) => set("view")(e.target.value)} style={inputStyle} />
							</Field>
							<Field label="Особенности (через запятую)">
								<input value={form.features} onChange={(e) => set("features")(e.target.value)} style={inputStyle} placeholder="балкон, парковка" />
							</Field>
						</Section>

						<Section title="Цена">
							<Row>
								<Field label="Цена">
									<input type="number" value={form.priceCurrent} onChange={(e) => set("priceCurrent")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Валюта">
									<select value={form.priceCurrency} onChange={(e) => set("priceCurrency")(e.target.value)} style={inputStyle}>
										{CURRENCIES.map((c) => (
											<option key={c} value={c}>{c}</option>
										))}
									</select>
								</Field>
							</Row>
							<Row>
								<Field label="Цена за м²">
									<input type="number" value={form.pricePerSqm} onChange={(e) => set("pricePerSqm")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Отображение цены">
									<select value={form.priceDisplay} onChange={(e) => set("priceDisplay")(e.target.value)} style={inputStyle}>
										<option value="show">Показывать</option>
										<option value="price_on_request">По запросу</option>
									</select>
								</Field>
							</Row>
							<Field label="Доходность аренды, %">
								<input type="number" value={form.rentalYieldEst} onChange={(e) => set("rentalYieldEst")(e.target.value)} style={inputStyle} />
							</Field>
						</Section>

						<Section title="Внутренние данные">
							<Row>
								<Field label="Владелец">
									<input value={form.ownerName} onChange={(e) => set("ownerName")(e.target.value)} style={inputStyle} />
								</Field>
								<Field label="Телефон владельца">
									<input value={form.ownerPhone} onChange={(e) => set("ownerPhone")(e.target.value)} style={inputStyle} />
								</Field>
							</Row>
							<Field label="Внутренние заметки">
								<textarea value={form.internalNotes} onChange={(e) => set("internalNotes")(e.target.value)} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
							</Field>
						</Section>

						<Section title="Кадастр">
							<Field label="Владелец по кадастру">
								<input value={form.cadastralOwner} onChange={(e) => set("cadastralOwner")(e.target.value)} style={inputStyle} />
							</Field>
							<Field label="Площадь по кадастру, м²">
								<input type="number" value={form.cadastralArea} onChange={(e) => set("cadastralArea")(e.target.value)} style={inputStyle} />
							</Field>
							<Toggle label="Обременения" checked={form.encumbrances} onChange={(v) => set("encumbrances")(v)} />
							<Field label="Заметки по кадастру">
								<textarea value={form.cadastralNotes} onChange={(e) => set("cadastralNotes")(e.target.value)} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
							</Field>
						</Section>

						<Section title="Медиа">
							<Field label="Обложка (URL)">
								<input value={form.coverImage} onChange={(e) => set("coverImage")(e.target.value)} style={inputStyle} />
							</Field>
							<Field label="Фото (по одному URL на строку)">
								<textarea value={form.photos} onChange={(e) => set("photos")(e.target.value)} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
							</Field>
						</Section>

						<Section title="История">
							<Field label="Заметка в историю (при сохранении)">
								<textarea value={form.historyNote} onChange={(e) => set("historyNote")(e.target.value)} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder="Комментарий к сохранению…" />
							</Field>
						</Section>
					</div>

					{!isNew && (
						<aside style={{ flex: "0 0 320px", maxWidth: "100%" }}>
							<h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.1rem", margin: "0 0 16px", color: C.accent }}>История</h2>
							<div style={{ borderLeft: `2px solid ${C.burgundy}`, paddingLeft: "16px" }}>
								{history.length === 0 ? (
									<p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", color: "rgba(250,247,240,0.45)" }}>Нет записей</p>
								) : (
									history.map((h) => (
										<div key={h.id} style={{ marginBottom: "20px", position: "relative" }}>
											<div style={{ position: "absolute", left: "-23px", top: "6px", width: "8px", height: "8px", borderRadius: "50%", background: C.accent }} />
											<p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.65rem", color: C.accent, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
												{h.event} · {new Date(h.createdAt).toLocaleString("ru-RU")}
											</p>
											{h.description && (
												<p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", margin: "0 0 4px", lineHeight: 1.4 }}>{h.description}</p>
											)}
											{h.price != null && (
												<p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "rgba(250,247,240,0.5)", margin: 0 }}>
													Цена: {h.price.toLocaleString()}
												</p>
											)}
										</div>
									))
								)}
							</div>
						</aside>
					)}
				</div>
			</div>
		</div>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div style={{ marginBottom: "28px", padding: "20px", background: "rgba(250,247,240,0.03)", border: `1px solid ${C.burgundy}`, borderRadius: "10px" }}>
			<h2 style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, margin: "0 0 16px" }}>{title}</h2>
			{children}
		</div>
	);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div style={{ marginBottom: "14px" }}>
			<label style={{ display: "block", fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "rgba(250,247,240,0.6)", marginBottom: "6px" }}>{label}</label>
			{children}
		</div>
	);
}

function Row({ children }: { children: React.ReactNode }) {
	return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>{children}</div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
	return (
		<label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem" }}>
			<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: C.accent }} />
			{label}
		</label>
	);
}

const inputStyle: React.CSSProperties = {
	width: "100%",
	boxSizing: "border-box",
	padding: "10px 12px",
	background: "rgba(33,20,26,0.6)",
	border: `1px solid ${C.burgundy}`,
	borderRadius: "6px",
	color: C.light,
	fontFamily: "DM Sans, sans-serif",
	fontSize: "0.85rem",
	outline: "none",
};
