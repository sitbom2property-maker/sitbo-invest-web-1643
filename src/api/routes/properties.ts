import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { createDb } from "../database";
import {
	properties,
	propertyHistory,
	adminSessions,
} from "../database/schema";

type Env = {
	Bindings: {
		DB: D1Database;
		ADMIN_PASSWORD: string;
	};
};

const propertiesRouter = new Hono<Env>();

function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
	if (!value) return fallback;
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

function stringifyJsonField(value: unknown): string | null {
	if (value == null) return null;
	if (typeof value === "string") return value;
	return JSON.stringify(value);
}

function formatProperty(
	row: typeof properties.$inferSelect,
	includeInternal: boolean,
) {
	const {
		features,
		photos,
		ownerName,
		ownerPhone,
		internalNotes,
		...rest
	} = row;

	const base = {
		...rest,
		features: parseJsonField<string[]>(features, []),
		photos: parseJsonField<string[]>(photos, []),
	};

	if (includeInternal) {
		return { ...base, ownerName, ownerPhone, internalNotes };
	}

	return base;
}

const requireAuth: MiddlewareHandler<Env> = async (c, next) => {
	const token = c.req.header("x-admin-token");
	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const rows = await db
		.select()
		.from(adminSessions)
		.where(eq(adminSessions.token, token))
		.limit(1);

	const session = rows[0];
	if (!session || new Date(session.expiresAt) < new Date()) {
		if (session) {
			await db.delete(adminSessions).where(eq(adminSessions.token, token));
		}
		return c.json({ error: "Unauthorized" }, 401);
	}

	await next();
};

function bodyToRow(
	body: Record<string, unknown>,
	existing?: typeof properties.$inferSelect,
) {
	const now = new Date().toISOString();
	const features =
		body.features != null
			? stringifyJsonField(body.features)
			: existing?.features ?? null;
	const photos =
		body.photos != null
			? stringifyJsonField(body.photos)
			: existing?.photos ?? null;

	return {
		id: (body.id as string) ?? existing?.id ?? "",
		type: (body.type as string) ?? existing?.type ?? "apartment",
		status: (body.status as string) ?? existing?.status ?? "active",
		catalogVisible: Boolean(
			body.catalogVisible ?? existing?.catalogVisible ?? false,
		),
		city: (body.city as string | null) ?? existing?.city ?? null,
		district: (body.district as string | null) ?? existing?.district ?? null,
		address: (body.address as string | null) ?? existing?.address ?? null,
		cadastralCode:
			(body.cadastralCode as string | null) ?? existing?.cadastralCode ?? null,
		unitType: (body.unitType as string | null) ?? existing?.unitType ?? null,
		areaTotal:
			body.areaTotal != null
				? Number(body.areaTotal)
				: (existing?.areaTotal ?? null),
		areaLiving:
			body.areaLiving != null
				? Number(body.areaLiving)
				: (existing?.areaLiving ?? null),
		floor:
			body.floor != null ? Number(body.floor) : (existing?.floor ?? null),
		floorsTotal:
			body.floorsTotal != null
				? Number(body.floorsTotal)
				: (existing?.floorsTotal ?? null),
		rooms:
			body.rooms != null ? Number(body.rooms) : (existing?.rooms ?? null),
		condition:
			(body.condition as string | null) ?? existing?.condition ?? null,
		yearBuilt:
			body.yearBuilt != null
				? Number(body.yearBuilt)
				: (existing?.yearBuilt ?? null),
		view: (body.view as string | null) ?? existing?.view ?? null,
		features,
		priceCurrent:
			body.priceCurrent != null
				? Number(body.priceCurrent)
				: (existing?.priceCurrent ?? null),
		priceCurrency:
			(body.priceCurrency as string | null) ?? existing?.priceCurrency ?? null,
		pricePerSqm:
			body.pricePerSqm != null
				? Number(body.pricePerSqm)
				: (existing?.pricePerSqm ?? null),
		priceDisplay:
			(body.priceDisplay as string | null) ?? existing?.priceDisplay ?? null,
		rentalYieldEst:
			body.rentalYieldEst != null
				? Number(body.rentalYieldEst)
				: (existing?.rentalYieldEst ?? null),
		ownerName:
			(body.ownerName as string | null) ?? existing?.ownerName ?? null,
		ownerPhone:
			(body.ownerPhone as string | null) ?? existing?.ownerPhone ?? null,
		cadastralOwner:
			(body.cadastralOwner as string | null) ??
			existing?.cadastralOwner ??
			null,
		cadastralArea:
			body.cadastralArea != null
				? Number(body.cadastralArea)
				: (existing?.cadastralArea ?? null),
		encumbrances: Boolean(
			body.encumbrances ?? existing?.encumbrances ?? false,
		),
		cadastralNotes:
			(body.cadastralNotes as string | null) ??
			existing?.cadastralNotes ??
			null,
		coverImage:
			(body.coverImage as string | null) ?? existing?.coverImage ?? null,
		photos,
		internalNotes:
			(body.internalNotes as string | null) ??
			existing?.internalNotes ??
			null,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};
}

propertiesRouter.get("/", async (c) => {
	const db = createDb(c.env.DB);
	const rows = await db
		.select()
		.from(properties)
		.where(eq(properties.catalogVisible, true));

	return c.json(rows.map((r) => formatProperty(r, false)));
});

propertiesRouter.get("/admin/all", requireAuth, async (c) => {
	const db = createDb(c.env.DB);
	const rows = await db.select().from(properties);
	return c.json(rows.map((r) => formatProperty(r, true)));
});

propertiesRouter.get("/admin/:id", requireAuth, async (c) => {
	const id = c.req.param("id");
	const db = createDb(c.env.DB);
	const rows = await db
		.select()
		.from(properties)
		.where(eq(properties.id, id))
		.limit(1);

	const row = rows[0];
	if (!row) {
		return c.json({ error: "Not found" }, 404);
	}

	const history = await db
		.select()
		.from(propertyHistory)
		.where(eq(propertyHistory.propertyId, id))
		.orderBy(desc(propertyHistory.createdAt));

	return c.json({
		property: formatProperty(row, true),
		history,
	});
});

propertiesRouter.post("/admin", requireAuth, async (c) => {
	try {
		const body = await c.req.json<Record<string, unknown>>();
		if (!body.id || typeof body.id !== "string") {
			return c.json({ error: "id is required" }, 400);
		}

		const db = createDb(c.env.DB);
		const existing = await db
			.select()
			.from(properties)
			.where(eq(properties.id, body.id))
			.limit(1);

		if (existing[0]) {
			return c.json({ error: "Property already exists" }, 409);
		}

		const row = bodyToRow(body);
		await db.insert(properties).values(row);

		const historyNote = body.historyNote as string | undefined;
		await db.insert(propertyHistory).values({
			propertyId: row.id,
			event: historyNote ? "note" : "created",
			description:
				historyNote ||
				`Объект создан (${row.type}, ${row.city ?? "—"})`,
			agent: (body.agent as string) ?? "admin",
			price: row.priceCurrent,
			createdAt: row.createdAt,
		});

		return c.json(formatProperty(row, true), 201);
	} catch (err) {
		console.error("[POST /admin]", err);
		return c.json({ error: "Invalid request" }, 400);
	}
});

propertiesRouter.put("/admin/:id", requireAuth, async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json<Record<string, unknown>>();
		const db = createDb(c.env.DB);

		const rows = await db
			.select()
			.from(properties)
			.where(eq(properties.id, id))
			.limit(1);

		const existing = rows[0];
		if (!existing) {
			return c.json({ error: "Not found" }, 404);
		}

		const row = bodyToRow({ ...body, id }, existing);
		await db.update(properties).set(row).where(eq(properties.id, id));

		const now = row.updatedAt;
		const agent = (body.agent as string) ?? "admin";

		if (existing.priceCurrent !== row.priceCurrent) {
			await db.insert(propertyHistory).values({
				propertyId: id,
				event: "price_change",
				description: `Цена: ${existing.priceCurrent ?? "—"} → ${row.priceCurrent ?? "—"} ${row.priceCurrency ?? ""}`,
				agent,
				price: row.priceCurrent,
				createdAt: now,
			});
		}

		if (existing.status !== row.status) {
			await db.insert(propertyHistory).values({
				propertyId: id,
				event: "status_change",
				description: `Статус: ${existing.status} → ${row.status}`,
				agent,
				price: row.priceCurrent,
				createdAt: now,
			});
		}

		const historyNote = body.historyNote as string | undefined;
		if (historyNote?.trim()) {
			await db.insert(propertyHistory).values({
				propertyId: id,
				event: "note",
				description: historyNote.trim(),
				agent,
				price: row.priceCurrent,
				createdAt: now,
			});
		}

		return c.json(formatProperty(row, true));
	} catch (err) {
		console.error("[PUT /admin/:id]", err);
		return c.json({ error: "Invalid request" }, 400);
	}
});

propertiesRouter.delete("/admin/:id", requireAuth, async (c) => {
	const id = c.req.param("id");
	const db = createDb(c.env.DB);
	await db.delete(properties).where(eq(properties.id, id));
	return c.json({ success: true });
});

propertiesRouter.post("/admin/:id/history", requireAuth, async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json<{
			event?: string;
			description?: string;
			agent?: string;
			price?: number;
		}>();

		const db = createDb(c.env.DB);
		const rows = await db
			.select()
			.from(properties)
			.where(eq(properties.id, id))
			.limit(1);

		if (!rows[0]) {
			return c.json({ error: "Not found" }, 404);
		}

		const now = new Date().toISOString();
		const entry = {
			propertyId: id,
			event: body.event ?? "note",
			description: body.description ?? null,
			agent: body.agent ?? "admin",
			price: body.price ?? rows[0].priceCurrent,
			createdAt: now,
		};

		await db.insert(propertyHistory).values(entry);

		return c.json(entry, 201);
	} catch {
		return c.json({ error: "Invalid request" }, 400);
	}
});

propertiesRouter.get("/:id", async (c) => {
	const id = c.req.param("id");
	const db = createDb(c.env.DB);
	const rows = await db
		.select()
		.from(properties)
		.where(
			and(eq(properties.id, id), eq(properties.catalogVisible, true)),
		)
		.limit(1);

	const row = rows[0];
	if (!row) {
		return c.json({ error: "Not found" }, 404);
	}

	return c.json(formatProperty(row, false));
});

export default propertiesRouter;
