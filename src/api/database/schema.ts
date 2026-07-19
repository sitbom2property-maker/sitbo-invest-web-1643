import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
	id: text("id").primaryKey(),
	type: text("type").notNull(),
	status: text("status").notNull().default("active"),
	catalogVisible: integer("catalog_visible", { mode: "boolean" })
		.notNull()
		.default(false),
	city: text("city"),
	district: text("district"),
	address: text("address"),
	cadastralCode: text("cadastral_code"),
	unitType: text("unit_type"),
	areaTotal: real("area_total"),
	areaLiving: real("area_living"),
	floor: integer("floor"),
	floorsTotal: integer("floors_total"),
	rooms: integer("rooms"),
	condition: text("condition"),
	yearBuilt: integer("year_built"),
	view: text("view"),
	features: text("features"),
	priceCurrent: real("price_current"),
	priceCurrency: text("price_currency"),
	pricePerSqm: real("price_per_sqm"),
	priceDisplay: text("price_display"),
	rentalYieldEst: real("rental_yield_est"),
	ownerName: text("owner_name"),
	ownerPhone: text("owner_phone"),
	cadastralOwner: text("cadastral_owner"),
	cadastralArea: real("cadastral_area"),
	encumbrances: integer("encumbrances", { mode: "boolean" }).default(false),
	cadastralNotes: text("cadastral_notes"),
	coverImage: text("cover_image"),
	photos: text("photos"),
	internalNotes: text("internal_notes"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
});

export const propertyHistory = sqliteTable("property_history", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	propertyId: text("property_id")
		.notNull()
		.references(() => properties.id, { onDelete: "cascade" }),
	event: text("event").notNull(),
	description: text("description"),
	agent: text("agent"),
	price: real("price"),
	createdAt: text("created_at").notNull(),
});

export const adminSessions = sqliteTable("admin_sessions", {
	token: text("token").primaryKey(),
	createdAt: text("created_at").notNull(),
	expiresAt: text("expires_at").notNull(),
});
