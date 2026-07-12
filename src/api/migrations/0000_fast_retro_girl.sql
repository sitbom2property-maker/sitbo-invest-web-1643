CREATE TABLE `admin_sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`catalog_visible` integer DEFAULT false NOT NULL,
	`city` text,
	`district` text,
	`address` text,
	`cadastral_code` text,
	`unit_type` text,
	`area_total` real,
	`area_living` real,
	`floor` integer,
	`floors_total` integer,
	`rooms` integer,
	`condition` text,
	`year_built` integer,
	`view` text,
	`features` text,
	`price_current` real,
	`price_currency` text,
	`price_per_sqm` real,
	`price_display` text,
	`rental_yield_est` real,
	`owner_name` text,
	`owner_phone` text,
	`cadastral_owner` text,
	`cadastral_area` real,
	`encumbrances` integer DEFAULT false,
	`cadastral_notes` text,
	`cover_image` text,
	`photos` text,
	`internal_notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `property_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` text NOT NULL,
	`event` text NOT NULL,
	`description` text,
	`agent` text,
	`price` real,
	`created_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
