/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** GA4 measurement ID (e.g. `G-XXXXXXXXXX`). Empty disables analytics. */
	readonly VITE_GA_MEASUREMENT_ID?: string;
}
